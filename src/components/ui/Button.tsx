import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors } from "../../theme/colors";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const isPrimary = variant === "primary";
  const isDisabled = disabled || loading;

  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    isDisabled && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
    isDisabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? colors.text.inverse : colors.accent.gold}
          size="small"
        />
      ) : (
        <Text style={buttonTextStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
    primary: {
    backgroundColor: colors.button.primary.background,
  },
  secondary: {
    backgroundColor: colors.button.secondary.background,
    borderWidth: 1.5,
    borderColor: colors.button.secondary.border,
  },
  size_sm: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  size_md: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 44,
  },
  size_lg: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 52,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  text_primary: {
    color: colors.button.primary.text,
  },
  text_secondary: {
    color: colors.button.secondary.text,
  },
  textSize_sm: {
    fontSize: 14,
  },
  textSize_md: {
    fontSize: 16,
  },
  textSize_lg: {
    fontSize: 18,
  },
  disabled: {
    opacity: 0.5,
  },
  textDisabled: {
    opacity: 0.7,
  },
});

