import React, { useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RootStackProps } from '@/types/INavigation';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { SafeScreen } from '@/components/ui/safe-screen';
import { ScreenPadding } from '@/components/ui/screen-padding';
import { Input } from '@/components/ui/input';
import { toFirebaseError } from '@/lib/firebase/errors';

// TODO: add forms library to simplify state
export const LoginScreen = ({ navigation }: RootStackProps<'Login'>) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError(t('auth.login.errors.fillAllFields'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const firebaseError = toFirebaseError(error, 'login');
      setError(firebaseError.getUserMessage());
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = !!email && !!password && password.length >= 6;

  return (
    <SafeScreen header={{ title: t('auth.login.title') }}>
      <ScreenPadding>
        <ScrollView
          bounces={false}
          contentContainerClassName="grow justify-center"
          showsVerticalScrollIndicator={false}>
          <View className="gap-6">
            <Text size="body" className="text-muted-foreground">
              {t('auth.login.subtitle')}
            </Text>

            <View className="gap-2">
              <Text size="label" weight="semibold">
                {t('auth.login.email')}
              </Text>
              <Input
                className="border rounded-lg p-4"
                placeholder={t('auth.login.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View className="gap-2">
              <Text size="label" weight="semibold">
                {t('auth.login.password')}
              </Text>
              <View className="flex-row items-center relative">
                <Input
                  className="border rounded-lg p-4 flex-1"
                  placeholder={t('auth.login.passwordPlaceholder')}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable
                  className="absolute right-[15px] p-[5px]"
                  onPress={() => setShowPassword(!showPassword)}>
                  <Text className="text-xl">{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </Pressable>
              </View>
            </View>

            <View className="min-h-[8px]">
              {error && (
                <Text size="caption" className="text-destructive text-center">
                  {error}
                </Text>
              )}

              {password && password.length < 6 && (
                <Text size="caption" className="text-destructive text-center">
                  {t('auth.login.errors.passwordTooShort')}
                </Text>
              )}
            </View>

            <Button
              title={isLoading ? t('auth.login.signingIn') : t('auth.login.signIn')}
              loading={isLoading}
              disabled={!isFormValid}
              onPress={handleLogin}
            />

            <View className="flex-row justify-center items-center">
              <Text size="caption" className="text-muted-foreground">
                {t('auth.login.noAccount')}&nbsp;
              </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate('Register');
                }}>
                <Text size="caption" weight="semibold" className="text-primary">
                  {t('auth.login.createAccount')}
                </Text>
              </Pressable>
            </View>

            <View className="flex-row justify-center items-center mt-4">
              <Pressable
                onPress={() => {
                  navigation.navigate('DatabaseStagingPanel');
                }}>
                <Text size="caption" weight="semibold" className="text-muted-foreground">
                  {t('databaseStagingPanel.title')}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ScreenPadding>
    </SafeScreen>
  );
};
