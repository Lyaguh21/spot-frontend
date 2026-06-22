import { useState, useRef, useEffect } from "react";
import {
  Box,
  FloatingIndicator,
  UnstyledButton,
  Group,
  Text,
  Stack,
} from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import classes from "./SpotFloatingIndicator.module.css";

interface Item {
  value: string;
  label: string;
  disabled?: boolean;
}

export default function SpotFloatingIndicator({
  items,
  value,
  setValue,
  size = "md",
  label,
}: {
  items: Item[];
  value: string;
  setValue: (value: any) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [activeRef, setActiveRef] = useState<HTMLButtonElement | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const controlsRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    setActiveRef(controlsRefs.current[value] || null);
  }, [value]);

  return (
    <Stack gap="0">
      {label && (
        <Text size="xs" fw={700} fz={12} c="#8ea2d4" mb={4}>
          {label}
        </Text>
      )}
      <Box
        className={classes.root}
        ref={parentRef}
        data-size={size}
        style={{ transition: "all 0.1s ease-in-out" }}
      >
        {items.map((item) => (
          <UnstyledButton
            key={item.value}
            ref={(node) => {
              controlsRefs.current[item.value] = node;
            }}
            className={classes.control}
            data-active={value === item.value || undefined}
            data-disabled={item.disabled || undefined}
            onClick={() => {
              if (!item.disabled) {
                setValue(item.value);
              }
            }}
          >
            <Group gap={4} justify="center" wrap="nowrap">
              <Text inherit>{item.label}</Text>

              {item.disabled && (
                <IconLock size={14} stroke={1.8} className={classes.lock} />
              )}
            </Group>
          </UnstyledButton>
        ))}

        <FloatingIndicator
          target={activeRef}
          parent={parentRef.current}
          className={classes.indicator}
        />
      </Box>
    </Stack>
  );
}
