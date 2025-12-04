import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/utils';

export type TextProps = RNTextProps &
  VariantProps<typeof text> & {
    className?: string;
  };

const text = tv({
  variants: {
    size: {
      h1: 'text-2xl leading-10',
      h2: 'text-xl leading-8',
      h3: 'text-lg leading-7',
      body: 'text-base leading-6',
      label: 'text-sm leading-5',
      caption: 'text-xs leading-4',
      subtitle: 'text-lg leading-[26px]',
    },
    weight: {
      light: 'font-light',
      regular: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    size: 'body',
    weight: 'regular',
  },
});

export const Text = ({ children, className, ...textProps }: TextProps) => {
  return (
    <RNText {...textProps} className={cn(text(textProps), className)}>
      {children}
    </RNText>
  );
};
