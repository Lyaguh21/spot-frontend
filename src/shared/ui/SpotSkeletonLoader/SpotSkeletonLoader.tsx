import { Skeleton, SkeletonProps } from "@mantine/core";
import styles from "./SpotSkeletonLoader.module.css";

export default function SpotSkeletonLoader(props: SkeletonProps) {
  return <Skeleton classNames={{ root: styles.root }} {...props} />;
}
