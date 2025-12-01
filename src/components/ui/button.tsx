import React from 'react';
import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
  View,
  ViewStyle,
  PressableProps,
} from 'react-native';
import { useTheme, ThemeColors, spacing, borderRadius } from './useTheme';
import { Text, TextSize } from './text';

export type ButtonMode = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'default' | 'lg' | 'icon';

export type AllowedLayoutStyle = Pick<
  ViewStyle,
  | 'margin'
  | 'marginTop'
  | 'marginBottom'
  | 'marginLeft'
  | 'marginRight'
  | 'marginHorizontal'
  | 'marginVertical'
>;

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  mode?: ButtonMode;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: AllowedLayoutStyle;
  activeOpacity?: number;
}

const TEXT_SIZES: Record<
  ButtonSize,
  Extract<TextSize, 'caption' | 'label' | 'body' | 'subtitle'>
> = {
  sm: 'caption',
  default: 'body',
  lg: 'subtitle',
  icon: 'label',
};

const TEXT_COLORS: Record<ButtonMode, keyof ThemeColors> = {
  default: 'primaryForeground',
  destructive: 'destructiveForeground',
  outline: 'foreground',
  secondary: 'secondaryForeground',
  ghost: 'foreground',
  link: 'primary',
};

function getModeStyles(mode: ButtonMode, colors: ThemeColors): ViewStyle {
  switch (mode) {
    case 'default':
      return { backgroundColor: colors.primary };
    case 'destructive':
      return { backgroundColor: colors.destructive };
    case 'outline':
      return {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
      };
    case 'secondary':
      return { backgroundColor: colors.secondary };
    case 'ghost':
      return { backgroundColor: 'transparent' };
    case 'link':
      return { backgroundColor: 'transparent' };
    default:
      return { backgroundColor: colors.primary };
  }
}

function getDisabledStyles(mode: ButtonMode, colors: ThemeColors): ViewStyle {
  const baseDisabled = { backgroundColor: colors.muted };

  if (mode === 'outline' || mode === 'destructive') {
    return {
      ...baseDisabled,
      borderWidth: 1,
      borderColor: colors.border,
    };
  }

  return baseDisabled;
}

const Button_ = ({
  title,
  mode = 'default',
  size = 'default',
  loading = false,
  disabled = false,
  style,
  activeOpacity = 0.7,
  ...pressableProps
}: ButtonProps) => {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  // Simple style composition
  const containerStyle = [
    styles.container,
    styles[size],
    isDisabled ? getDisabledStyles(mode, colors) : getModeStyles(mode, colors),
    style,
  ];

  const textColor = isDisabled ? 'mutedForeground' : TEXT_COLORS[mode];
  const spinnerColor = isDisabled ? colors.mutedForeground : colors[textColor];

  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [...containerStyle, pressed && { opacity: activeOpacity }]}
      {...pressableProps}>
      {loading && (
        <View style={StyleSheet.absoluteFillObject}>
          <View style={styles.center}>
            <ActivityIndicator color={spinnerColor} />
          </View>
        </View>
      )}

      <Text
        size={TEXT_SIZES[size]}
        weight="semibold"
        color={textColor}
        numberOfLines={1}
        style={loading && styles.hidden}>
        {title}
      </Text>
    </Pressable>
  );
};

export const Button = React.memo(Button_);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },

  /* eslint-disable react-native/no-unused-styles */
  sm: { minHeight: 44, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
  default: { minHeight: 48, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  lg: { minHeight: 56, paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  icon: { minHeight: 48, paddingVertical: spacing.md, paddingHorizontal: spacing.md },
  /* eslint-enable react-native/no-unused-styles */

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hidden: {
    opacity: 0,
  },
});
