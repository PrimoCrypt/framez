import React from "react";
import { TextInput, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { colors } from "../../theme/colors";

interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  autoCapitalize = "sentences",
  multiline = false,
  style,
  textStyle,
}: InputProps) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={colors.text.muted}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      multiline={multiline}
      style={[styles.input, style, textStyle]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: 8,
    padding: 12,
    color: colors.text.primary,
    fontSize: 16,
    minHeight: 44,
  },
});

