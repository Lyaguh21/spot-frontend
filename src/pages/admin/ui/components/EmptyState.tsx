import styles from "../Admin.module.css";

export default function EmptyState({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.empty}>{children}</div>;
}
