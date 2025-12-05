import { Platform, View } from 'react-native';
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
  const isMobile = Platform.OS  !== 'web'
  return (
    <View className={cn(horizontal && isMobile && 'px-md', vertical && isMobile && 'py-sm', className)}>{children}</View>
  );
};
