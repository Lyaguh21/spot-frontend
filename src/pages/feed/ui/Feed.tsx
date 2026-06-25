import { Stack, Text } from "@mantine/core";
import SearchUsersSection from "./components/SearchUsersSection/SearchUsersSection";
import { useGetFeedQuery } from "@/entities/feed";
import FeedItem, { FeedItemSkeleton } from "./components/FeedItem/FeedItem";
import styles from "./Feed.module.css";
import { OnboardingTour } from "@gfazioli/mantine-onboarding-tour";

export default function FeedPage() {
  const { data, isLoading, isError } = useGetFeedQuery();

  return (
    <Stack className={styles.page} gap="md">
      <SearchUsersSection />
      <OnboardingTour.Target id="app-tour-feed-section">
        <Stack gap="md">
          {isLoading &&
            Array.from({ length: 5 }, (_, index) => (
              <FeedItemSkeleton key={index} />
            ))}

          {!isLoading &&
            data?.map((item, index) => (
              <FeedItem
                key={item.id ?? `${item.visitDate}-${index}`}
                item={item}
              />
            ))}

          {!isLoading && !isError && data?.length === 0 && (
            <Text className={styles.state}>
              Подпишитесь на пользователей, чтобы увидеть их места в ленте.
            </Text>
          )}

          {isError && (
            <Text className={styles.state}>
              Не удалось загрузить ленту. Попробуйте обновить страницу.
            </Text>
          )}
        </Stack>
      </OnboardingTour.Target>
    </Stack>
  );
}
