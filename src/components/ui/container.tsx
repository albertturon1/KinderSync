import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { View } from 'react-native';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
  return <View className={cn("w-full container mx-auto", className)}>{children}</View>;
};
