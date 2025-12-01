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

type HeaderProps = {
  title?: string;
  rightElement?: ReactNode;
  children?: ReactNode;
};

type SafeScreenProps = {
  children: ReactNode;
  header?: HeaderProps;
};

export const SafeScreen = ({ children, header }: SafeScreenProps) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {header && (
          <Header title={header.title} rightElement={header.rightElement}>
            {header.children}
          </Header>
        )}
        <View style={styles.flex}>{children}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
