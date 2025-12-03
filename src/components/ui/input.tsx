import * as React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { textStyles } from './text';
import { spacing, borderRadius, useTheme } from './useTheme';

interface InputProps extends TextInputProps {
  error?: boolean;
}

export const Input = ({ style, error, ...props }: InputProps) => {
  const { colors, mode } = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);

  const inputStyle = [
    styles.input,
    {
      borderColor: error ? colors.destructive : isFocused ? colors.ring : colors.input,
      backgroundColor: mode === 'dark' ? colors.input : 'transparent',
      color: colors.foreground,
    },
    style,
  ];

  return (
    <TextInput
      {...props}
      style={inputStyle}
      placeholderTextColor={colors.mutedForeground}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: textStyles.body.fontSize,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
});
