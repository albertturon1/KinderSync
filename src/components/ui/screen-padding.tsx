import { View, ViewStyle } from 'react-native';
import { useTheme } from './useTheme';
import { ReactNode } from 'react';

type ScreenPaddingProps = {
  children: ReactNode;
  horizontal?: boolean;
  vertical?: boolean;
};

export const ScreenPadding = ({
  children,
  horizontal = true,
  vertical = true,
}: ScreenPaddingProps) => {
  const { spacing } = useTheme();

  const paddingStyle: ViewStyle = {
    paddingHorizontal: horizontal ? spacing.screen.horizontal : 0,
    paddingVertical: vertical ? spacing.screen.vertical : 0,
  };

  return <View style={paddingStyle}>{children}</View>;
};
