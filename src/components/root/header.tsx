import { View, Text } from 'react-native';
import { ReactNode } from 'react';
import { useCanGoBack } from '@/hooks/useCanGoBack';
import { useRootNavigation } from '@/hooks/useRootNavigation';
import { ArrowIconButton } from './arrow-icon-button';

interface HeaderProps {
  title?: string;
  rightElement?: ReactNode;
  children?: ReactNode;
  hideArrow?: boolean;
}

export const Header = ({ title, rightElement, children, hideArrow }: HeaderProps) => {
  const navigation = useRootNavigation();
  const canGoBack = useCanGoBack();
  const showArrow = canGoBack && !hideArrow;

  return (
    <View className="relative flex-row items-center h-11 px-md z-10000 bg-background">
      <View className="absolute h-full justify-center min-w-11">
        {showArrow && (
          <ArrowIconButton
            onPress={() => {
              navigation.goBack();
            }}
          />
        )}
      </View>

      <View className="absolute left-0 right-0 h-full justify-center items-center px-[60px]">
        {title && (
          <Text className="text-lg font-semibold text-center text-foreground" numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>
      <View className="absolute right-md h-full justify-center min-w-11">
        {rightElement}
      </View>
      {children && <View className="px-md">{children}</View>}
    </View>
  );
};
