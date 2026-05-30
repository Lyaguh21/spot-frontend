import { Button } from "@mantine/core";
import type { ButtonProps } from "@mantine/core";
import type { ComponentPropsWithoutRef } from "react";
import styles from "./SpotButton.module.css";

type SpotButtonProps = ButtonProps & ComponentPropsWithoutRef<"button">;

export default function SpotButton(props: SpotButtonProps) {
  return (
    <Button classNames={{ root: styles.root }} {...props}>
      {props.children}
    </Button>
  );
}
