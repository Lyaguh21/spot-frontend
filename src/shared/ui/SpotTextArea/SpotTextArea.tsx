import { Textarea } from "@mantine/core";
import styles from "./SpotTextArea.module.css";

export default function SpotTextArea(
  props: React.ComponentProps<typeof Textarea>,
) {
  return (
    <Textarea
      {...props}
      classNames={{
        root: styles.root,
        label: styles.label,
        input: styles.input,
        section: styles.section,
      }}
    ></Textarea>
  );
}
