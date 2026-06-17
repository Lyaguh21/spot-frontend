import { SpotButton, SpotGlassCard } from "@/shared/ui";
import {
  Anchor,
  Avatar,
  Badge,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandTelegram,
  IconCode,
  IconExternalLink,
  IconHeartHandshake,
  IconServer,
  IconDeviceMobile,
} from "@tabler/icons-react";
import styles from "./AboutPage.module.css";

const DEVELOPERS = [
  {
    name: "Артём Кирюшин",
    role: "Frontend Developer",
    photoUrl: "https://avatars.githubusercontent.com/u/91676348?v=4",
    github: "https://github.com/Lyaguh21",
    telegram: "https://t.me/FrontendSwamp",
  },
  {
    name: "Завеса Алиса",
    role: "Backend Developer",
    photoUrl: "https://avatars.githubusercontent.com/u/196025989?v=4",
    github: "https://github.com/lisazavesa",
  },
];

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    description: "Исходный код проекта",
    href: "https://github.com/Lyaguh21/spot",
    icon: IconBrandGithub,
  },
  {
    label: "Telegram",
    description: "Новости и связь",
    href: "https://t.me/FrontendSwamp",
    icon: IconBrandTelegram,
  },
];

const SUPPORT_GOALS = [
  {
    title: "Создание мобильного приложения",
    icon: IconDeviceMobile,
  },
  {
    title: "Оплата платного API",
    icon: IconCode,
  },
  {
    title: "Оплата сервера и улучшение его качества",
    icon: IconServer,
  },
  {
    title: "Поддержка разработчиков",
    icon: IconHeartHandshake,
  },
];

export default function AboutPage() {
  return (
    <Stack mt="md" className={styles.root} gap={18}>
      <section className={styles.hero}>
        <Title className={styles.title} order={2}>
          SPOT
        </Title>
        <Text className={styles.lead}>
          SPOT - opensource-pet проект, который помогает сохранять важные места
          и впечатления, делится ими с близкими и открывать новые вместе.
        </Text>
      </section>

      <section className={styles.section}>
        <Text className={styles.sectionTitle}>Разработчики</Text>
        <SimpleGrid cols={2} spacing={12}>
          {DEVELOPERS.map((developer) => (
            <SpotGlassCard
              className={styles.developerCard}
              key={developer.name}
            >
              <Stack className={styles.developerLayout} gap={12} align="center">
                <Stack className={styles.developerInfo} gap={8} align="center">
                  <Avatar
                    className={styles.avatar}
                    src={developer.photoUrl}
                    alt={developer.name}
                    size={58}
                    radius="xl"
                  />
                  <Stack className={styles.developerCopy} gap={2}>
                    <Text className={styles.developerName}>
                      {developer.name}
                    </Text>
                    <Text className={styles.developerRole}>
                      {developer.role}
                    </Text>
                  </Stack>
                </Stack>

                <Group gap={8} wrap="nowrap" justify="center">
                  <Anchor
                    className={styles.iconLink}
                    href={developer.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${developer.name}: GitHub`}
                  >
                    <IconBrandGithub size={18} />
                  </Anchor>
                  {developer.telegram && (
                    <Anchor
                      className={styles.iconLink}
                      href={developer.telegram}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${developer.name}: Telegram`}
                    >
                      <IconBrandTelegram size={18} />
                    </Anchor>
                  )}
                </Group>
              </Stack>
            </SpotGlassCard>
          ))}
        </SimpleGrid>
      </section>

      <section className={styles.section}>
        <Text className={styles.sectionTitle}>Мы в соц сетях</Text>
        <Stack gap={10}>
          {SOCIAL_LINKS.map((link) => {
            const Icon = link.icon;

            return (
              <Anchor
                className={styles.socialLink}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                key={link.label}
              >
                <ThemeIcon className={styles.socialIcon} size={42} radius="xl">
                  <Icon size={21} />
                </ThemeIcon>
                <Stack className={styles.socialCopy} gap={1}>
                  <Text className={styles.socialTitle}>{link.label}</Text>
                  <Text className={styles.socialDescription}>
                    {link.description}
                  </Text>
                </Stack>
                <IconExternalLink className={styles.externalIcon} size={18} />
              </Anchor>
            );
          })}
        </Stack>
      </section>

      <section className={styles.section}>
        <SpotGlassCard className={styles.supportCard}>
          <Stack gap={14}>
            <Stack gap={6}>
              <Text className={styles.sectionTitle}>Поддержать проект</Text>
              <Text className={styles.supportText}>
                SPOT - это независимый проект реализующийся на средства
                разработчиков, ваша поддержка поможет нам развиваться и сделать
                сервис лучше.
              </Text>
            </Stack>

            <Stack className={styles.goals} gap={8}>
              <Text className={styles.goalsTitle}>На что пойдут средства</Text>
              {SUPPORT_GOALS.map((goal) => {
                const Icon = goal.icon;

                return (
                  <Group
                    className={styles.goal}
                    gap={10}
                    wrap="nowrap"
                    key={goal.title}
                  >
                    <ThemeIcon
                      className={styles.goalIcon}
                      size={34}
                      radius="xl"
                    >
                      <Icon size={18} />
                    </ThemeIcon>
                    <Text className={styles.goalText}>{goal.title}</Text>
                  </Group>
                );
              })}
            </Stack>
            <SpotButton>Поддержать</SpotButton>
          </Stack>
        </SpotGlassCard>
      </section>
    </Stack>
  );
}
