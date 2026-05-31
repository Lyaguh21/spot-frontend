import { Link, useLocation } from "react-router-dom";
import {
  IconFileText,
  IconUser,
  IconMap2,
  IconMapPinFilled,
} from "@tabler/icons-react";
import styles from "./TabBar.module.css";
import { selectUser } from "@/entities/user/model/userSelectors";
import { useAppSelector } from "@/shared/lib";

export default function TabBar() {
  const user = useAppSelector(selectUser);
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
      to: user.id ? `/profile/${user?.username}` : "/",
      icon: IconUser,
    },
  ];

  return (
    <nav className={styles.wrapper}>
      <div className={styles.glass}>
        {tabs.map((tab) => {
          const isActive =
            tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
          const Icon = tab.icon;

          return (
            <Link
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
  );
}
