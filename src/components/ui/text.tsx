import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
  StyleProp,
  StyleSheet,
} from 'react-native';
import { useTheme, ThemeColors } from './useTheme';

export type TextSize = keyof typeof textStyles;
export type TextWeight = keyof typeof textStyles;

export interface TextProps extends RNTextProps {
  size?: TextSize;
  weight?: TextWeight;
  italic?: boolean;
  underline?: boolean;
  color?: keyof ThemeColors;
}

const textStyles = StyleSheet.create({
  // Font sizes
  h1: { fontSize: 32, lineHeight: 40 },
  h2: { fontSize: 24, lineHeight: 32 },
  h3: { fontSize: 20, lineHeight: 28 },
  body: { fontSize: 16, lineHeight: 24 },
  label: { fontSize: 14, lineHeight: 20 },
  caption: { fontSize: 12, lineHeight: 16 },
  subtitle: { fontSize: 18, lineHeight: 26 },

  // Font weights
  light: { fontWeight: '300' },
  regular: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  semibold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
});

export const Text = ({
  children,
  size = 'body',
  weight = 'regular',
  italic = false,
  underline = false,
  style,
  color,
  ...textProps
}: TextProps) => {
  const { colors } = useTheme();

  const textStyle: StyleProp<TextStyle> = [
    textStyles[size],
    textStyles[weight],
    italic && { fontStyle: 'italic' },
    underline && { textDecorationLine: 'underline' },
    color && { color: colors[color] },
    style,
  ];

  return (
    <RNText {...textProps} style={textStyle}>
      {children}
    </RNText>
  );
};
