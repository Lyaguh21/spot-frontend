import { PinInput, Box, BoxProps } from "@mantine/core";
import classes from "./CoupleCodeInput.module.css";

interface CoupleCodeInputProps extends BoxProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function CoupleCodeInput({
  value,
  onChange,
  ...boxProps
}: CoupleCodeInputProps) {
  return (
    <Box {...boxProps}>
      <div className={classes.wrapper}>
        <PinInput
          size="lg"
          length={5}
          placeholder="—"
          value={value}
          onChange={onChange}
          classNames={{
            root: classes.root,
            input: classes.input,
          }}
          styles={{
            input: {
              fontFamily: "monospace",
              fontWeight: 600,
              letterSpacing: "0.05em",
            },
          }}
        />
      </div>
    </Box>
  );
}
