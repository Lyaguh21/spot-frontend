import { ActionIcon } from "@mantine/core";
import type { ActionIconProps } from "@mantine/core";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import styles from "./SpotActionIcon.module.css";

type SpotActionIconProps = ActionIconProps & ComponentPropsWithoutRef<"button">;

const SpotActionIcon = forwardRef<HTMLButtonElement, SpotActionIconProps>(
  function SpotActionIcon(props, ref) {
    const { className, radius, variant, size = 44, classNames, ...rest } =
      props;

    return (
      <ActionIcon
        {...rest}
        ref={ref}
        size={size}
        radius={radius ?? "xl"}
        variant={variant ?? "transparent"}
        className={[styles.root, className].filter(Boolean).join(" ")}
        classNames={classNames}
      />
    );
  },
);

export default SpotActionIcon;
