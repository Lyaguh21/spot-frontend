import { useSearchUsersQuery } from "@/entities/user";
import { SpotActionIcon, SpotAvatar } from "@/shared/ui";
import {
  ActionIcon,
  Box,
  Center,
  Flex,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  Transition,
  UnstyledButton,
} from "@mantine/core";
import { OnboardingTour } from "@gfazioli/mantine-onboarding-tour";
import { useDebouncedValue } from "@mantine/hooks";
import { IconArrowUpRight, IconSearch, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SearchUsersSection.module.css";

export default function SearchUsersSection() {
  const [isSearch, setIsSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search.trim(), 200);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { currentData, isFetching, isError } = useSearchUsersQuery(
    { search: debouncedSearch, limit: 5 },
    { skip: !debouncedSearch },
  );

  const users = currentData?.items.slice(0, 5) ?? [];
  const showResults = debouncedSearch.length > 0;

  useEffect(() => {
    if (!isSearch) {
      return;
    }

    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [isSearch]);

  const closeSearch = () => {
    setIsSearch(false);
    setSearch("");
  };

  return (
    <Box component="section" className={styles.section}>
      <Flex className={styles.header} justify="space-between" align="center">
        {!isSearch && (
          <>
            <Title order={1} className={styles.title}>
              Лента
            </Title>
            <OnboardingTour.Target id="app-tour-search">
              <SpotActionIcon
                size={52}
                onClick={() => setIsSearch(true)}
                aria-label="Найти пользователя"
              >
                <IconSearch />
              </SpotActionIcon>
            </OnboardingTour.Target>
          </>
        )}

        <Transition
          mounted={isSearch}
          transition="pop-top-left"
          duration={220}
          timingFunction="cubic-bezier(0.22, 1, 0.36, 1)"
        >
          {(transitionStyle) => (
            <Paper
              className={styles.searchSurface}
              style={transitionStyle}
              radius="lg"
            >
              <TextInput
                ref={inputRef}
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    closeSearch();
                  }
                }}
                placeholder="Найти пользователя"
                aria-label="Поиск пользователей"
                autoComplete="off"
                leftSection={<IconSearch size={21} stroke={2} />}
                rightSection={
                  <ActionIcon
                    className={styles.closeButton}
                    variant="subtle"
                    radius="xl"
                    onClick={closeSearch}
                    aria-label="Закрыть поиск"
                  >
                    <IconX size={18} />
                  </ActionIcon>
                }
                classNames={{
                  root: styles.inputRoot,
                  input: styles.input,
                  section: styles.inputSection,
                }}
              />

              <Transition
                mounted={showResults}
                transition="fade-down"
                duration={180}
              >
                {(resultsStyle) => (
                  <Stack
                    className={styles.results}
                    style={resultsStyle}
                    gap={0}
                    aria-live="polite"
                  >
                    {isFetching && users.length === 0 && (
                      <Center className={styles.state}>
                        <Loader size="xs" />
                        <Text size="sm">Ищем пользователей</Text>
                      </Center>
                    )}

                    {!isFetching && !isError && users.length === 0 && (
                      <Center className={styles.state}>
                        <Text size="sm">
                          По запросу «{debouncedSearch}» никого не нашли
                        </Text>
                      </Center>
                    )}

                    {isError && (
                      <Center className={styles.state}>
                        <Text size="sm">Не удалось выполнить поиск</Text>
                      </Center>
                    )}

                    {users.map((user) => (
                      <UnstyledButton
                        className={styles.userRow}
                        key={user.id}
                        onClick={() =>
                          navigate({ pathname: `/profile/${user.username}` })
                        }
                      >
                        <Group gap="sm" wrap="nowrap">
                          <SpotAvatar
                            size={44}
                            src={user.avatarUrl}
                            alt={user.username}
                          >
                            {user.name.charAt(0)}
                          </SpotAvatar>
                          <Stack className={styles.userText} gap={1}>
                            <Text className={styles.userName} truncate>
                              {user.name}
                            </Text>
                            <Text className={styles.username} truncate>
                              @{user.username}
                            </Text>
                          </Stack>
                          <IconArrowUpRight
                            className={styles.userArrow}
                            size={18}
                            stroke={1.8}
                          />
                        </Group>
                      </UnstyledButton>
                    ))}
                  </Stack>
                )}
              </Transition>
            </Paper>
          )}
        </Transition>
      </Flex>
    </Box>
  );
}
