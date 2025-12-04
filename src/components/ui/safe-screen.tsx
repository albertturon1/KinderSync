import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { ReactNode } from 'react';
import { Header } from '../root/header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCSSVariable } from 'uniwind';

const styles = StyleSheet.create({
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
  const shouldShowHeader = !!header;
  const showBack = header?.showBack !== false;
  const backgroundColor = useCSSVariable('--color-background') as string;

  // SafeAreaView requires using style instead of className
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {shouldShowHeader && (
          <Header title={header?.title} rightElement={header?.right} hideArrow={!showBack} />
        )}
        <View className="flex-1">{children}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
