import React from 'react';
import { Pressable, ActivityIndicator, View, PressableProps } from 'react-native';
import { tv } from 'tailwind-variants';
import { Text } from './text';
import { cn } from '@/lib/utils';

type ButtonMode = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'default' | 'lg' | 'icon';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  mode?: ButtonMode;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  activeOpacity?: number;
}

const button = tv({
  base: 'flex-row items-center justify-center rounded-lg overflow-hidden select-none',
  variants: {
    mode: {
      default: 'bg-primary',
      destructive: 'bg-destructive',
      outline: 'bg-background border border-border',
      secondary: 'bg-secondary',
      ghost: 'bg-transparent',
      link: 'bg-transparent',
    },
    size: {
      sm: 'min-h-11 py-xs px-sm',
      default: 'min-h-12 py-sm px-md',
      lg: 'min-h-14 py-md px-lg',
      icon: 'min-h-12 py-md px-md',
    },
    disabled: {
      true: 'bg-muted',
      false: '',
    },
  },
  compoundVariants: [
    {
      disabled: true,
      mode: ['outline', 'destructive'],
      class: 'border border-border',
    },
  ],
  defaultVariants: {
    mode: 'default',
    size: 'default',
    disabled: false,
  },
});

const buttonText = tv({
  base: '',
  variants: {
    mode: {
      default: 'text-primary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground',
      secondary: 'text-secondary-foreground',
      ghost: 'text-foreground',
      link: 'text-primary',
    },
    disabled: {
      true: 'text-muted-foreground',
    },
    hidden: {
      true: 'opacity-0',
    },
  },
});

const TEXT_SIZES = {
  sm: 'caption',
  default: 'body',
  lg: 'subtitle',
  icon: 'label',
} as const;

const Button_ = ({
  title,
  mode = 'default',
  size = 'default',
  loading = false,
  disabled = false,
  className,
  activeOpacity = 0.7,
  ...pressableProps
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      className={cn(button({ mode, size, disabled: isDisabled }), className)}
      style={({ pressed }) => pressed && { opacity: activeOpacity }}
      {...pressableProps}>
      {loading && (
        <View className="absolute inset-0 flex-1 items-center justify-center">
          <ActivityIndicator className={buttonText({ mode, disabled: isDisabled })} />
        </View>
      )}

      <Text
        size={TEXT_SIZES[size]}
        weight="semibold"
        numberOfLines={1}
        className={buttonText({ mode, disabled: isDisabled, hidden: loading })}>
        {title}
      </Text>
    </Pressable>
  );
};

export const Button = React.memo(Button_);
