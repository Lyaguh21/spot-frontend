import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconNotes, IconUser, IconMapPinFilled } from "@tabler/icons-react";
import styles from "./TabBar.module.css";
import { selectUser } from "@/entities/user";
import { useAppSelector } from "@/shared/lib";
import { SpotConfirmActionModal } from "@/shared/ui";
import { useDisclosure } from "@mantine/hooks";
import { getAuthRedirectPath } from "@/shared/utils";
import { OnboardingTour } from "@gfazioli/mantine-onboarding-tour";

const tabOnboardingFocusRevealProps = {
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
} as const;

export default function TabBar() {
  const [opened, { open, close }] = useDisclosure();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  const isAuth = Boolean(user.id);
  const location = useLocation();
  const pathname = location.pathname;

  const tabs = [
    { key: "feed", label: "Лента", to: "/", icon: IconNotes },
    {
      key: "map",
      label: "Карта",
      to: "/map",
      icon: IconMapPinFilled,
      center: true,
    },
    {
      key: "profile",
      label: "Профиль",
      to: `/profile/${user?.username}`,
      icon: IconUser,
    },
  ];

  return (
    <>
      <SpotConfirmActionModal
        opened={opened}
        onClose={close}
        onConfirm={() => {
          close();
          navigate(getAuthRedirectPath());
        }}
        title="Войдите в аккаунт что бы продолжить"
        question="Что бы получить доступ к этой странице, вам необходимо войти в аккаунт"
        confirmText="Войти"
      />
      <nav className={styles.wrapper}>
        <div className={styles.glass}>
          {tabs.map((tab) => {
            const isActive =
              tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
            const Icon = tab.icon;
            const onboardingTargetId = {
              feed: "app-tour-tab-feed",
              map: "app-tour-tab-map",
              profile: "app-tour-tab-profile",
            }[tab.key];

            const tabLink = (
              <Link
                onClick={(event) => {
                  if (!isAuth) {
                    event.preventDefault();
                    open();
                  }
                }}
                key={tab.key}
                to={tab.to}
                className={styles.item}
                data-active={isActive || undefined}
                data-center={tab.center || undefined}
              >
                {tab.center ? (
                  <span className={styles.iconWrap}>
                    <Icon className={styles.icon} stroke={1.6} />
                  </span>
                ) : (
                  <Icon className={styles.icon} stroke={1.6} />
                )}
                <span className={styles.label}>{tab.label}</span>
              </Link>
            );

            if (!onboardingTargetId) {
              return tabLink;
            }

            return (
              <OnboardingTour.Target
                key={tab.key}
                id={onboardingTargetId}
                focusRevealProps={tabOnboardingFocusRevealProps}
              >
                <span className={styles.onboardingTarget}>{tabLink}</span>
              </OnboardingTour.Target>
            );
          })}
        </div>
      </nav>
    </>
  );
}
