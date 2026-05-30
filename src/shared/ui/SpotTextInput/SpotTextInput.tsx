import { TextInput } from "@mantine/core";
import styles from "./SpotTextInput.module.css";

export default function SpotInput(
  props: React.ComponentProps<typeof TextInput>,
) {
  return (
    <TextInput
      {...props}
      classNames={{
        root: styles.root,
        input: styles.input,
        section: styles.section,
      }}
    ></TextInput>
  );
}
