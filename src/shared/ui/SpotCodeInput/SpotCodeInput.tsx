import { Box, PinInput, type BoxProps } from "@mantine/core";
import type { ComponentProps } from "react";

import classes from "./SpotCodeInput.module.css";

type PinInputPublicProps = Pick<
  ComponentProps<typeof PinInput>,
  | "autoFocus"
  | "disabled"
  | "error"
  | "inputMode"
  | "inputType"
  | "length"
  | "manageFocus"
  | "onChange"
  | "onComplete"
  | "oneTimeCode"
  | "placeholder"
  | "readOnly"
  | "type"
  | "value"
>;

type SpotCodeInputProps = BoxProps & PinInputPublicProps;

export default function SpotCodeInput({
  value,
  onChange,
  length = 5,
  type = "alphanumeric",
  autoFocus,
  disabled,
  error,
  inputMode,
  inputType,
  manageFocus,
  onComplete,
  oneTimeCode,
  placeholder = "-",
  readOnly,
  ...boxProps
}: SpotCodeInputProps) {
  return (
    <Box {...boxProps}>
      <div className={classes.wrapper}>
        <PinInput
          size="lg"
          length={length}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={onChange}
          onComplete={onComplete}
          autoFocus={autoFocus}
          disabled={disabled}
          error={error}
          inputMode={inputMode}
          inputType={inputType}
          manageFocus={manageFocus}
          oneTimeCode={oneTimeCode}
          readOnly={readOnly}
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
