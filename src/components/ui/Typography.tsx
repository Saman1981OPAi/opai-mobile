import type { ReactNode } from "react";
import {
  Text as NativeText,
  TextInput as NativeTextInput,
  type TextInputProps,
  type TextProps
} from "react-native";
import {
  fontScaling,
  getScriptAwareTextStyle,
  typographyStyles
} from "@/theme/typography";

function extractText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractText).join("");
  return "";
}

export function AppText({ allowFontScaling, children, style, ...props }: TextProps) {
  const text = extractText(children);
  return (
    <NativeText
      {...props}
      allowFontScaling={allowFontScaling ?? fontScaling.allowFontScaling}
      style={[getScriptAwareTextStyle(text), style]}
    >
      {children}
    </NativeText>
  );
}

export function AppHeading({ children, style, ...props }: TextProps) {
  return (
    <AppText {...props} style={[typographyStyles.screenTitle, style]}>
      {children}
    </AppText>
  );
}

export function AppButtonText({ children, style, ...props }: TextProps) {
  return (
    <AppText
      {...props}
      maxFontSizeMultiplier={
        props.maxFontSizeMultiplier ?? fontScaling.compactControlMaxFontSizeMultiplier
      }
      style={[typographyStyles.button, style]}
    >
      {children}
    </AppText>
  );
}

export function AppInputText({
  allowFontScaling,
  defaultValue,
  placeholder,
  style,
  value,
  ...props
}: TextInputProps) {
  const sample = value ?? defaultValue ?? placeholder ?? "";
  return (
    <NativeTextInput
      {...props}
      allowFontScaling={allowFontScaling ?? fontScaling.allowFontScaling}
      defaultValue={defaultValue}
      placeholder={placeholder}
      style={[typographyStyles.input, getScriptAwareTextStyle(sample), style]}
      value={value}
    />
  );
}
