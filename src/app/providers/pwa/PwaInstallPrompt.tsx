import { Box, Group, Modal, Stack, Text, Title } from "@mantine/core";
import {
  IconBook,
  IconChevronRightFilled,
  IconDeviceMobile,
  IconDownload,
  IconShare2,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { SpotButton } from "@/shared/ui";

import classes from "./PwaInstallPrompt.module.css";

const OPEN_COUNT_KEY = "spot:pwa-install-open-count";
const LEGACY_DISMISSED_KEY = "spot:pwa-install-dismissed";
const SNOOZED_UNTIL_OPEN_COUNT_KEY =
  "spot:pwa-install-snoozed-until-open-count";
const NEVER_REMIND_KEY = "spot:pwa-install-never-remind";
const INSTALLED_KEY = "spot:pwa-installed";
const SECOND_APP_OPEN = 3;
const REMIND_AFTER_OPENS = 3;

let didRegisterOpen = false;

type BeforeInstallPromptChoice = {
  outcome: "accepted" | "dismissed";
  platform: string;
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<BeforeInstallPromptChoice>;
};

type PromptMode = "native" | "ios";

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

function getStorageItem(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStorageItem(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}

function removeStorageItem(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    return;
  }
}

function getStoredNumber(key: string) {
  const value = Number(getStorageItem(key));

  return Number.isNaN(value) ? null : value;
}

function isIosDevice() {
  const navigatorWithTouch = window.navigator as Navigator & {
    maxTouchPoints?: number;
  };

  return (
    /iPad|iPhone|iPod/.test(window.navigator.platform) ||
    (window.navigator.platform === "MacIntel" &&
      (navigatorWithTouch.maxTouchPoints ?? 0) > 1)
  );
}

function isIosSafari() {
  const userAgent = window.navigator.userAgent;
  const isSafari = /Safari/i.test(userAgent);
  const isOtherIosBrowser = /CriOS|FxiOS|EdgiOS|OPiOS/i.test(userAgent);

  return isIosDevice() && isSafari && !isOtherIosBrowser;
}

function isPwaInstalled() {
  const navigatorWithStandalone = window.navigator as NavigatorWithStandalone;
  const isStandaloneDisplay =
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.matchMedia?.("(display-mode: fullscreen)").matches;

  return (
    isStandaloneDisplay ||
    navigatorWithStandalone.standalone === true ||
    document.referrer.startsWith("android-app://") ||
    getStorageItem(INSTALLED_KEY) === "true"
  );
}

function registerAppOpen() {
  const savedCount = Number(getStorageItem(OPEN_COUNT_KEY) ?? "0");

  if (didRegisterOpen) {
    return savedCount;
  }

  didRegisterOpen = true;

  if (Number.isNaN(savedCount)) {
    setStorageItem(OPEN_COUNT_KEY, "1");
    return 1;
  }

  const nextCount = savedCount + 1;
  setStorageItem(OPEN_COUNT_KEY, String(nextCount));

  return nextCount;
}

function isPromptSnoozed(openCount: number) {
  const snoozedUntilOpenCount = getStoredNumber(SNOOZED_UNTIL_OPEN_COUNT_KEY);

  return snoozedUntilOpenCount !== null && openCount < snoozedUntilOpenCount;
}

function isPromptDisabled() {
  return getStorageItem(NEVER_REMIND_KEY) === "true";
}

function migrateLegacyDismissal(openCount: number) {
  if (!getStorageItem(LEGACY_DISMISSED_KEY)) {
    return;
  }

  removeStorageItem(LEGACY_DISMISSED_KEY);

  if (!isPromptSnoozed(openCount)) {
    setStorageItem(
      SNOOZED_UNTIL_OPEN_COUNT_KEY,
      String(openCount + REMIND_AFTER_OPENS),
    );
  }
}

function snoozePrompt() {
  const openCount = getStoredNumber(OPEN_COUNT_KEY) ?? 0;

  removeStorageItem(LEGACY_DISMISSED_KEY);
  setStorageItem(
    SNOOZED_UNTIL_OPEN_COUNT_KEY,
    String(openCount + REMIND_AFTER_OPENS),
  );
}

function markInstalled() {
  setStorageItem(INSTALLED_KEY, "true");
  removeStorageItem(LEGACY_DISMISSED_KEY);
  removeStorageItem(SNOOZED_UNTIL_OPEN_COUNT_KEY);
}

function disablePromptPermanently() {
  setStorageItem(NEVER_REMIND_KEY, "true");
  removeStorageItem(LEGACY_DISMISSED_KEY);
  removeStorageItem(SNOOZED_UNTIL_OPEN_COUNT_KEY);
}

export default function PwaInstallPrompt() {
  const [opened, setOpened] = useState(false);
  const [mode, setMode] = useState<PromptMode>("native");
  const [canOfferPrompt, setCanOfferPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIosGuideOpen, setIsIosGuideOpen] = useState(false);
  const [installLoading, setInstallLoading] = useState(false);

  useEffect(() => {
    if (isPwaInstalled()) {
      markInstalled();
      return;
    }

    if (isPromptDisabled()) {
      return;
    }

    const openCount = registerAppOpen();
    migrateLegacyDismissal(openCount);

    if (isPromptSnoozed(openCount)) {
      return;
    }

    const shouldOfferPrompt = openCount >= SECOND_APP_OPEN;
    setCanOfferPrompt(shouldOfferPrompt);

    if (shouldOfferPrompt && isIosSafari()) {
      setMode("ios");
      setOpened(true);
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      markInstalled();
      setDeferredPrompt(null);
      setOpened(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (
      canOfferPrompt &&
      deferredPrompt &&
      !isPwaInstalled() &&
      !isPromptDisabled() &&
      !isPromptSnoozed(getStoredNumber(OPEN_COUNT_KEY) ?? 0)
    ) {
      setMode("native");
      setOpened(true);
    }
  }, [canOfferPrompt, deferredPrompt]);

  const handleClose = () => {
    snoozePrompt();
    setCanOfferPrompt(false);
    setOpened(false);
    setIsIosGuideOpen(false);
  };

  const handleNeverRemind = () => {
    disablePromptPermanently();
    setCanOfferPrompt(false);
    setDeferredPrompt(null);
    setOpened(false);
    setIsIosGuideOpen(false);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    setInstallLoading(true);

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;

      if (choice.outcome === "accepted") {
        markInstalled();
      } else {
        snoozePrompt();
      }

      setCanOfferPrompt(false);
      setDeferredPrompt(null);
      setOpened(false);
    } finally {
      setInstallLoading(false);
    }
  };

  const showIosGuide = mode === "ios" && isIosGuideOpen;
  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      centered
      withCloseButton={false}
      overlayProps={{ blur: 7, opacity: 0.68, color: "#040b1a" }}
      classNames={{ content: classes.content, body: classes.body }}
      radius="xl"
      size="sm"
    >
      <Stack gap={22}>
        <Box className={classes.visual} aria-hidden="true">
          {showIosGuide ? (
            <Box className={classes.iosPhone}>
              <Box className={classes.iosScreen}>
                <Box className={classes.shareSheet}>
                  <Box className={classes.shareHandle} />

                  <Group gap={8} px={8} justify="space-between">
                    <IconChevronRightFilled color="gray" />
                    <IconShare2 color="var(--mantine-color-spotBlue-5)" />
                    <IconBook color="gray" />
                  </Group>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box className={classes.appBadge}>
              <IconDeviceMobile size={48} stroke={1.7} />
              <Box className={classes.downloadBadge}>
                <IconDownload size={20} stroke={2.5} />
              </Box>
            </Box>
          )}
        </Box>

        <Stack gap={8} ta="center">
          <Title order={2} className={classes.title}>
            {showIosGuide
              ? "Как установить SPOT"
              : "Установите SPOT на телефон"}
          </Title>
          <Text className={classes.description}>
            {showIosGuide
              ? "Откройте меню Safari и добавьте приложение на главный экран."
              : "Так приложение будет открываться быстрее и выглядеть как обычное приложение."}
          </Text>
        </Stack>

        {showIosGuide ? (
          <Stack gap={10} className={classes.steps}>
            <Group gap={12} wrap="nowrap">
              <Box className={classes.stepNumber}>1</Box>
              <Text>Нажмите кнопку «Поделиться» в нижней панели Safari.</Text>
            </Group>
            <Group gap={12} wrap="nowrap">
              <Box className={classes.stepNumber}>2</Box>
              <Text>Выберите пункт «На экран Домой».</Text>
            </Group>
            <Group gap={12} wrap="nowrap">
              <Box className={classes.stepNumber}>3</Box>
              <Text>Нажмите «Добавить».</Text>
            </Group>
          </Stack>
        ) : null}

        <Group gap={10} grow className={classes.actions}>
          {mode === "native" ? (
            <SpotButton
              radius="lg"
              size="md"
              onClick={handleInstall}
              loading={installLoading}
              leftSection={<IconDownload size={18} stroke={2.3} />}
            >
              Установить
            </SpotButton>
          ) : (
            <SpotButton
              radius="lg"
              size="md"
              onClick={() =>
                showIosGuide ? handleClose() : setIsIosGuideOpen(true)
              }
            >
              {showIosGuide ? "Понятно" : "Как установить"}
            </SpotButton>
          )}

          <SpotButton kind="glass" radius="lg" size="md" onClick={handleClose}>
            Позже
          </SpotButton>
        </Group>

        <button
          type="button"
          className={classes.neverButton}
          onClick={handleNeverRemind}
        >
          Больше не напоминать
        </button>
      </Stack>
    </Modal>
  );
}
