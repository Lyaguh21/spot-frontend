import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconFileText, IconUser, IconMapPinFilled } from "@tabler/icons-react";
import styles from "./TabBar.module.css";
import { selectUser } from "@/entities/user";
import { useAppSelector } from "@/shared/lib";
import { SpotConfirmActionModal } from "@/shared/ui";
import { useDisclosure } from "@mantine/hooks";
import { getAuthRedirectPath } from "@/shared/utils";

export default function TabBar() {
  const [opened, { open, close }] = useDisclosure();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  const isAuth = Boolean(user.id);
  const location = useLocation();
  const pathname = location.pathname;

  const tabs = [
    { key: "feed", label: "Лента", to: "/", icon: IconFileText },
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
        question="Войдите в аккаунт что бы продолжить"
        confirmText="Войти"
      />
      <nav className={styles.wrapper}>
        <div className={styles.glass}>
          {tabs.map((tab) => {
            const isActive =
              tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
            const Icon = tab.icon;

            return (
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
          })}
        </div>
      </nav>
    </>
  );
}
