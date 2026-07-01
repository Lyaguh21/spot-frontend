import { selectUser } from "@/entities/user";
import { useAppSelector } from "@/shared/lib";
import { onboardingTourNavigationProps } from "@/shared/ui";
import {
  completeFeaturesOnboarding,
  isFeaturesOnboardingCompleted,
} from "@/shared/utils";
import {
  OnboardingTour,
  type OnboardingTourStep,
} from "@gfazioli/mantine-onboarding-tour";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./AppOnboardingTour.module.css";

type FeatureTourStep = OnboardingTourStep & { route: string };

const getFeatureTourSteps = (profileRoute: string): FeatureTourStep[] => [
  {
    id: "app-tour-tab-feed",
    route: "/",
    title: "Лента",
    content:
      "На этой странице показываются обновления пользователей на которых вы подписаны.",
    cutoutPadding: 10,
    cutoutRadius: 18,
    focusRevealProps: {
      focusedZIndex: 320,
      popoverProps: {
        position: { base: "top", sm: "top" },
        offset: { base: 12, sm: 12 },
        width: { base: 320, sm: 360 },
        zIndex: 330,
        withArrow: true,
        shadow: "xl",
        radius: "lg",
      },
    },
  },
  {
    id: "app-tour-search",
    route: "/",
    title: "Поиск",
    content: "Здесь вы можете находить пользователей.",
    cutoutPadding: 6,
    cutoutRadius: 9999,
  },
  {
    id: "app-tour-tab-map",
    route: "/map",
    title: "Карта",
    content: "Здесь отображаются метки оставленные на карте",
    cutoutPadding: 10,
    cutoutRadius: 18,
    focusRevealProps: {
      popoverProps: {
        position: { base: "top", sm: "top" },
        offset: { base: -300, sm: -300 },
        width: { base: 320, sm: 360 },
        withArrow: true,
        shadow: "xl",
        radius: "lg",
      },
    },
  },
  {
    id: "app-tour-map-modes",
    route: "/map",
    title: "Режимы карты",
    content:
      "Вы можете менять режим отображения меток выбирая между своими метками, метками вашей пары или метками друзей.",
    cutoutPadding: 8,
    cutoutRadius: 18,
    focusRevealProps: {
      popoverProps: {
        position: { base: "bottom", sm: "bottom" },
        offset: { base: 12, sm: 12 },
        width: { base: 320, sm: 360 },
        withArrow: true,
        shadow: "xl",
        radius: "lg",
      },
    },
  },
  {
    id: "app-tour-tab-profile",
    route: profileRoute,
    title: "Профиль",
    content: "Это ваш профиль, здесь отображается основная информация о вас",
    cutoutPadding: 12,
    cutoutRadius: 18,
    focusRevealProps: {
      focusedZIndex: 320,
      popoverProps: {
        position: { base: "top", sm: "top" },
        offset: { base: 18, sm: 18 },
        width: { base: 320, sm: 360 },
        zIndex: 330,
        withArrow: true,
        shadow: "xl",
        radius: "lg",
      },
    },
  },
  {
    id: "app-tour-profile-follows",
    route: profileRoute,
    title: "Подписки и подписчики",
    content:
      "Здесь можно посмотреть, кто подписан на вас, и на кого подписаны вы.",
    cutoutPadding: 10,
    cutoutRadius: 18,
    focusRevealProps: {
      popoverProps: {
        position: { base: "bottom", sm: "bottom" },
        offset: { base: 12, sm: 12 },
        width: { base: 320, sm: 360 },
        withArrow: true,
        shadow: "xl",
        radius: "lg",
      },
    },
  },
  {
    id: "app-tour-pair-card",
    route: profileRoute,
    title: "Пара",
    content: "Добавьте пару, что бы создавать метки вместе",
    popoverProps: {
      position: { base: "bottom", sm: "bottom" },
    },
    cutoutPadding: 5,
    cutoutRadius: 18,
  },
];

export default function AppOnboardingTour({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAppSelector(selectUser);
  const location = useLocation();
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const isCompleted = isFeaturesOnboardingCompleted();
  const canRun = Boolean(user.id) && !isCompleted;
  const featureTourSteps = useMemo(
    () =>
      getFeatureTourSteps(user.username ? `/profile/${user.username}` : "/"),
    [user.username],
  );

  const shouldStart = canRun && location.pathname === "/";

  useEffect(() => {
    if (!shouldStart || started) {
      return;
    }

    const timeoutId = window.setTimeout(() => setStarted(true), 450);

    return () => window.clearTimeout(timeoutId);
  }, [shouldStart, started]);

  useEffect(() => {
    if (!canRun && started) {
      setStarted(false);
    }
  }, [canRun, started]);

  useEffect(() => {
    if (!started) {
      return;
    }

    const scrollY = window.scrollY;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [started]);

  const finishFeaturesOnboarding = () => {
    completeFeaturesOnboarding();
    setStarted(false);
  };

  return (
    <OnboardingTour
      tour={featureTourSteps}
      started={started}
      onOnboardingTourChange={(tourStep) => {
        const nextStep = featureTourSteps.find(
          (step) => step.id === tourStep.id,
        );

        if (nextStep?.route && nextStep.route !== location.pathname) {
          navigate(nextStep.route);
        }
      }}
      onOnboardingTourComplete={finishFeaturesOnboarding}
      onOnboardingTourSkip={finishFeaturesOnboarding}
      {...onboardingTourNavigationProps}
      classNames={{
        popoverContent: styles.popoverContent,
      }}
      focusRevealProps={{
        withReveal: false,
        disableTargetInteraction: true,
        revealProps: {
          duration: 0,
          cancelable: false,
          offset: 0,
        },
        transitionProps: {
          duration: 0,
          exitDuration: 0,
        },
        overlayProps: {
          color: "#061225",
          backgroundOpacity: 0.68,
          blur: 4,
          zIndex: 240,
        },
        popoverProps: {
          position: { base: "top", sm: "left" },
          offset: { base: 12, sm: 14 },
          width: { base: 320, sm: 360 },
          classNames: {
            dropdown: styles.popoverDropdown,
            arrow: styles.popoverArrow,
          },
          zIndex: 330,
          withArrow: true,
          shadow: "xl",
          radius: "lg",
        },
      }}
    >
      {children}
    </OnboardingTour>
  );
}
