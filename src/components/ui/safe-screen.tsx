import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useTheme } from './useTheme';
import { ReactNode } from 'react';
import { Header } from '../root/header';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
  },
});

interface SafeScreenProps {
  children: ReactNode;
  header?: {
    title?: string;
    showBack?: boolean; // default: true
    right?: ReactNode;
  };
}

export const SafeScreen = ({ children, header }: SafeScreenProps) => {
  const { colors } = useTheme();

  const shouldShowHeader = !!header;
  const showBack = header?.showBack !== false;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {shouldShowHeader && (
          <Header title={header?.title} rightElement={header?.right} hideArrow={!showBack} />
        )}
        <View style={styles.flex}>{children}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
