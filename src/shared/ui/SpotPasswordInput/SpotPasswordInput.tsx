import { PasswordInput } from "@mantine/core";
import styles from "./SpotPasswordInput.module.css";

export default function SpotPasswordInput(
  props: React.ComponentProps<typeof PasswordInput>,
) {
  return (
    <PasswordInput
      {...props}
      classNames={{
        root: styles.root,
        label: styles.label,
        input: styles.input,
        innerInput: styles.innerInput,
        section: styles.section,
      }}
    ></PasswordInput>
  );
}
