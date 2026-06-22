import { IVisitAuthor } from "@/entities/map";
import { SpotAvatar } from "@/shared/ui";
import { Avatar, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import styles from "../ViewVisitInfoDrawer.module.css";

type VisitAuthorRowProps = {
  author?: IVisitAuthor | null;
  authors?: IVisitAuthor[];
  coupleId?: string | number | null;
  label?: string;
};

const isVisitAuthor = (
  value: IVisitAuthor | null | undefined,
): value is IVisitAuthor => Boolean(value?.username);

export function VisitAuthorRow({
  author,
  authors,
  coupleId,
  label = "Автор метки",
}: VisitAuthorRowProps) {
  const navigate = useNavigate();
  const displayAuthors = (authors?.length ? authors : author ? [author] : [])
    .filter(isVisitAuthor)
    .slice(0, 2);

  if (!displayAuthors.length) {
    return null;
  }

  const firstAuthor = displayAuthors[0];
  const targetPath =
    displayAuthors.length > 1 && coupleId
      ? `/couple/${coupleId}`
      : `/profile/${firstAuthor.username}`;
  const displayName = displayAuthors
    .map((item) => item.name || item.username)
    .join(" и ");
  const displayUsername = displayAuthors
    .map((item) => `@${item.username}`)
    .join(" и ");

  return (
    <UnstyledButton
      className={styles.authorButton}
      onClick={(event) => {
        event.stopPropagation();
        navigate(targetPath);
      }}
    >
      <Group gap={9} wrap="nowrap">
        <Avatar.Group spacing={13} className={styles.authorAvatars}>
          {displayAuthors.map((item) => {
            const itemName = item.name || item.username;

            return (
              <SpotAvatar
                key={item.username}
                size={38}
                radius="xl"
                src={item.avatarUrl}
                alt={itemName}
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(targetPath);
                }}
              >
                {itemName.charAt(0).toUpperCase()}
              </SpotAvatar>
            );
          })}
        </Avatar.Group>
        <Stack gap={1} style={{ minWidth: 0 }}>
          <Text className={styles.authorLabel}>{label}</Text>
          <Text className={styles.authorName} truncate>
            {displayName}
          </Text>
          <Text className={styles.authorUsername} truncate>
            {displayUsername}
          </Text>
        </Stack>
      </Group>
    </UnstyledButton>
  );
}
