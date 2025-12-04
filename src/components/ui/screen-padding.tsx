import { View } from 'react-native';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ScreenPaddingProps {
  children: ReactNode;
  horizontal?: boolean;
  vertical?: boolean;
  className?: string;
}

export const ScreenPadding = ({
  children,
  horizontal = true,
  vertical = true,
  className,
}: ScreenPaddingProps) => {
  return (
    <View className={cn(horizontal && 'px-md', vertical && 'py-sm', className)}>{children}</View>
  );
};
