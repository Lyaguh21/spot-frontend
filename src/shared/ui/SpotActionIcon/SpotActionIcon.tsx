import { ActionIcon } from "@mantine/core";
import type { ActionIconProps } from "@mantine/core";
import type { ComponentPropsWithoutRef } from "react";
import styles from "./SpotActionIcon.module.css";

type SpotActionIconProps = ActionIconProps & ComponentPropsWithoutRef<"button">;

export default function SpotActionIcon(props: SpotActionIconProps) {
  const { className, radius, variant, size = 44, classNames, ...rest } = props;

  return (
    <ActionIcon
      {...rest}
      size={size}
      radius={radius ?? "xl"}
      variant={variant ?? "transparent"}
      className={[styles.root, className].filter(Boolean).join(" ")}
      classNames={classNames}
    />
  );
}
