import { View, Text, StyleSheet } from 'react-native';
import { useTheme, spacing } from '@/components/ui/useTheme';
import { ReactNode } from 'react';
import { useCanGoBack } from '@/hooks/useCanGoBack';
import { useRootNavigation } from '@/hooks/useRootNavigation';
import { ArrowIconButton } from './arrow-icon-button';

type HeaderProps = {
  title?: string;
  rightElement?: ReactNode;
  children?: ReactNode;
  hideArrow?: boolean;
};

export const Header = ({ title, rightElement, children, hideArrow }: HeaderProps) => {
  const navigation = useRootNavigation();
  const { colors } = useTheme();
  const canGoBack = useCanGoBack();
  const showArrow = canGoBack && !hideArrow;

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <View style={styles.leftSection}>
        {showArrow && (
          <ArrowIconButton
            onPress={() => {
              navigation.goBack();
            }}
          />
        )}
      </View>

      <View style={styles.centerSection}>
        {title && (
          <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>
      <View style={styles.rightSection}>{rightElement}</View>
      {children && <View style={styles.headerContent}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: spacing.md,
    zIndex: 10000,
  },
  leftSection: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    zIndex: 1,
    minWidth: 44,
  },
  centerSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 60, // Space for left and right sections
  },
  rightSection: {
    position: 'absolute',
    right: spacing.md,
    height: '100%',
    justifyContent: 'center',
    zIndex: 1,
    minWidth: 44,
  },
  headerContent: {
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
