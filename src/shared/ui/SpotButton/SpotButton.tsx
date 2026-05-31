import { Button } from "@mantine/core";
import type { ButtonProps } from "@mantine/core";
import type { ComponentPropsWithoutRef } from "react";
import styles from "./SpotButton.module.css";

type SpotButtonProps = ButtonProps &
  ComponentPropsWithoutRef<"button"> & {
    component?: any;
    to?: string;
    kind?: "default" | "glass";
  };

export default function SpotButton({
  kind = "default",
  className,
  ...props
}: SpotButtonProps) {
  const rootClassName = [
    styles.root,
    kind === "glass" ? styles.glass : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Button className={rootClassName} {...props}>
      {props.children}
    </Button>
  );
}
