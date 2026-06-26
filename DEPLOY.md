# Деплой Spot на VPS

Инструкция рассчитана на два репозитория:

- frontend: `https://github.com/Lyaguh21/spot-frontend.git`
- backend: `https://github.com/Lyaguh21/spot-backend.git`

На сервере они лежат рядом в `/opt/spot`, общий env-файл лежит в `/opt/spot/.env`.

## 1. Установка зависимостей на VPS

```bash
apt update && apt upgrade -y

apt install -y \
  ca-certificates \
  curl \
  gnupg \
  git \
  ufw \
  nginx

apt remove -y docker.io docker-doc docker-compose podman-docker containerd runc

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

systemctl enable docker nginx
systemctl start docker nginx

docker --version
docker compose version
```

## 2. Firewall

```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
ufw status
```

## 3. Клон репозиториев

```bash
mkdir -p /opt/spot
cd /opt/spot

git clone https://github.com/Lyaguh21/spot-frontend.git spot-frontend
git clone https://github.com/Lyaguh21/spot-backend.git spot-backend

git config --global --add safe.directory /opt/spot/spot-frontend
git config --global --add safe.directory /opt/spot/spot-backend
```

Если репозитории приватные, заранее настрой доступ на сервере: GitHub token в credential helper или SSH deploy key.

## 4. `/opt/spot/.env`

Твой текущий env почти подходит. В Docker нельзя оставлять `localhost` в `DATABASE_URL`: внутри backend-контейнера это будет сам backend-контейнер, а не Postgres. Для compose host базы должен быть `postgres`.

`POSTGRES_DB`, `POSTGRES_USER` и `POSTGRES_PASSWORD` нужны postgres-контейнеру при первом создании базы. Они должны совпадать с логином, паролем и именем БД в `DATABASE_URL`.

```bash
nano /opt/spot/.env
```

```env
POSTGRES_DB=backend_db
POSTGRES_USER=admin
POSTGRES_PASSWORD=replace_with_strong_password

DATABASE_URL="postgresql://admin:replace_with_strong_password@postgres:5432/backend_db?schema=public"
PORT=3000

FRONTEND_PORT=3000
VITE_API_URL=/api

JWT_ACCESS_SECRET=replace_with_long_random_secret
JWT_REFRESH_SECRET=replace_with_another_long_random_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

COOKIE_SECURE=true
COOKIE_SAMESITE=lax

S3_ENDPOINT=https://s3.ru1.storage.beget.cloud
S3_BUCKET=your_bucket
S3_ACCESS_KEY=your_s3_access_key
S3_SECRET_KEY=your_s3_secret_key

SMTP_HOST=smtp.beget.com
SMTP_PORT=465
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

Для первой проверки по обычному HTTP через Nginx можно временно поставить `COOKIE_SECURE=false`. После подключения HTTPS верни `COOKIE_SECURE=true` и перезапусти compose.

Если на сервере уже была создана база с другими `POSTGRES_*`, простая смена этих переменных не переименует существующий volume. Для чистого первого деплоя это не проблема; для уже созданной БД нужно мигрировать данные или явно пересоздавать volume.

## 5. Ручной деплой

Если на VPS уже лежит старая тестовая база и ее не нужно сохранять, один раз очисти postgres volume до деплоя:

```bash
cd /opt/spot/spot-frontend
export APP_ENV_FILE=/opt/spot/.env
export BACKEND_DIR=/opt/spot/spot-backend

docker compose --env-file "$APP_ENV_FILE" -f docker-compose.prod.yml down -v
```

Потом вводи этот блок целиком в SSH-сессии на VPS. Он обновляет оба репозитория, проверяет, что env и backend Dockerfile на месте, потом собирает и запускает контейнеры.

```bash
set -e

APP_DIR=/opt/spot
FRONTEND_DIR="$APP_DIR/spot-frontend"
BACKEND_DIR="$APP_DIR/spot-backend"
APP_ENV_FILE="$APP_DIR/.env"

test -f "$APP_ENV_FILE"
test -f "$FRONTEND_DIR/docker-compose.prod.yml"
test -f "$BACKEND_DIR/Dockerfile"

cd "$FRONTEND_DIR"
git pull --ff-only origin main

cd "$BACKEND_DIR"
git pull --ff-only origin main

export BACKEND_DIR
export APP_ENV_FILE

cd "$FRONTEND_DIR"

docker compose --env-file "$APP_ENV_FILE" -f docker-compose.prod.yml build frontend backend migrate
docker compose --env-file "$APP_ENV_FILE" -f docker-compose.prod.yml up -d postgres
# Это не prisma migrate deploy. Сервис migrate синхронизирует схему через prisma db push --accept-data-loss.
docker compose --env-file "$APP_ENV_FILE" -f docker-compose.prod.yml --profile migrate run --rm migrate
docker compose --env-file "$APP_ENV_FILE" -f docker-compose.prod.yml up -d --remove-orphans frontend backend
docker compose --env-file "$APP_ENV_FILE" -f docker-compose.prod.yml ps
```

Проверка frontend на VPS:

```bash
curl -I http://127.0.0.1:3000
```

Порт `3000` привязан к `127.0.0.1`, поэтому наружу приложение открывается через Nginx на 80/443. Backend наружу не публикуется; frontend-контейнер проксирует запросы `/api/*` в backend.

Логи:

```bash
cd /opt/spot/spot-frontend
export APP_ENV_FILE=/opt/spot/.env
export BACKEND_DIR=/opt/spot/spot-backend

docker compose --env-file "$APP_ENV_FILE" -f docker-compose.prod.yml logs -f frontend
docker compose --env-file "$APP_ENV_FILE" -f docker-compose.prod.yml logs -f backend
docker compose --env-file "$APP_ENV_FILE" -f docker-compose.prod.yml logs -f postgres
```
## 6. Nginx для домена

```bash
nano /etc/nginx/sites-available/spot
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/spot /etc/nginx/sites-enabled/spot
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

## 7. HTTPS

```bash
apt install -y snapd
snap install core
snap refresh core
snap install --classic certbot
ln -s /snap/bin/certbot /usr/local/bin/certbot

certbot --nginx -d your-domain.com -d www.your-domain.com
certbot renew --dry-run
```

После выпуска сертификата проверь, что в `/opt/spot/.env` стоит `COOKIE_SECURE=true`, и перезапусти приложение:

```bash
cd /opt/spot/spot-frontend
export APP_ENV_FILE=/opt/spot/.env
export BACKEND_DIR=/opt/spot/spot-backend

docker compose --env-file "$APP_ENV_FILE" -f docker-compose.prod.yml up -d --build frontend backend
```

## 8. CI/CD через GitHub Actions

Workflow лежит в `spot-frontend/.github/workflows/deploy.yml`. Он по push в `main`:

1. Заходит на VPS по SSH.
2. Клонирует или обновляет `spot-frontend` и `spot-backend` в `/opt/spot`.
3. Собирает Docker images.
4. Поднимает Postgres.
5. Синхронизирует Prisma schema через `prisma db push --accept-data-loss`.
6. Поднимает frontend и backend.

Создай SSH-ключ для GitHub Actions:

```bash
ssh-keygen -t ed25519 -C "github-actions"
cat ~/.ssh/id_ed25519.pub
cat ~/.ssh/id_ed25519
```

Публичный ключ добавь на VPS:

```bash
mkdir -p /root/.ssh
nano /root/.ssh/authorized_keys
chmod 700 /root/.ssh
chmod 600 /root/.ssh/authorized_keys
```

В GitHub репозитории `spot-frontend` создай Secrets:

- `VPS_HOST`: IP сервера
- `VPS_USER`: обычно `root`
- `VPS_PORT`: обычно `22`
- `VPS_SSH_KEY`: приватный ключ из `cat ~/.ssh/id_ed25519`
- `BACKEND_REPO_URL`: опционально, если backend repo отличается от `https://github.com/Lyaguh21/spot-backend.git`

Перед первым запуском CI/CD обязательно создай `/opt/spot/.env` на сервере.
