import { Select } from "@mantine/core";
import styles from "./SpotSelect.module.css";

export default function SpotSelect(props: React.ComponentProps<typeof Select>) {
  return (
    <Select
      {...props}
      classNames={{
        root: styles.root,
        label: styles.label,
        input: styles.input,
        section: styles.section,
      }}
    ></Select>
  );
}
