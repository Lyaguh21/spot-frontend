const pluralize = (
  value: number,
  forms: [string, string, string],
) => {
  const absolute = Math.abs(value) % 100;
  const lastDigit = absolute % 10;

  if (absolute > 10 && absolute < 20) {
    return forms[2];
  }

  if (lastDigit === 1) {
    return forms[0];
  }

  if (lastDigit > 1 && lastDigit < 5) {
    return forms[1];
  }

  return forms[2];
};

export const formatRelativeTime = (
  date: string | number | Date,
  now = new Date(),
) => {
  const elapsed = Math.max(0, now.getTime() - new Date(date).getTime());
  const minutes = Math.floor(elapsed / 60_000);

  if (minutes < 1) {
    return "только что";
  }

  if (minutes < 60) {
    return `${minutes} ${pluralize(minutes, ["минуту", "минуты", "минут"])} назад`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ${pluralize(hours, ["час", "часа", "часов"])} назад`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    if (days === 1) {
      return "день назад";
    }

    return `${days} ${pluralize(days, ["день", "дня", "дней"])} назад`;
  }

  const weeks = Math.floor(days / 7);
  if (days < 30) {
    if (weeks === 1) {
      return "неделю назад";
    }

    return `${weeks} ${pluralize(weeks, ["неделю", "недели", "недель"])} назад`;
  }

  const months = Math.floor(days / 30);
  if (days < 365) {
    if (months === 1) {
      return "месяц назад";
    }

    return `${months} ${pluralize(months, ["месяц", "месяца", "месяцев"])} назад`;
  }

  const years = Math.floor(days / 365);
  if (years === 1) {
    return "год назад";
  }

  return `${years} ${pluralize(years, ["год", "года", "лет"])} назад`;
};
