import { View, Text, StyleSheet } from 'react-native';
import { useTheme, spacing } from '@/components/ui/useTheme';
import { ReactNode } from 'react';

type HeaderProps = {
  title?: string;
  rightElement?: ReactNode;
  children?: ReactNode;
};

const styles = StyleSheet.create({
  header: {
    zIndex: 10000,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginVertical: spacing.sm,
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerContent: {
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export const Header = ({ title, rightElement, children }: HeaderProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        {title && <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>}
        {rightElement}
      </View>
      {children && <View style={styles.headerContent}>{children}</View>}
    </View>
  );
};
