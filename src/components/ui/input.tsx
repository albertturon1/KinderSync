import * as React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { tv } from 'tailwind-variants';
import { cn } from '@/lib/utils';

interface InputProps extends TextInputProps {
  error?: boolean;
  className?: string;
}

const input = tv({
  base: 'text-base min-h-[44px] px-sm rounded-md border text-foreground placeholder:text-muted-foreground',
  variants: {
    state: {
      default: 'border-input bg-transparent dark:bg-input',
      focused: 'border-ring bg-transparent dark:bg-input',
      error: 'border-destructive bg-transparent dark:bg-input',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

export const Input = ({ className, error, ...props }: InputProps) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const state = error ? 'error' : isFocused ? 'focused' : 'default';

  return (
    <TextInput
      {...props}
      className={cn(input({ state }), className)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
};
