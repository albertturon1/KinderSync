import React, { useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RootStackProps } from '@/types/INavigation';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { SafeScreen } from '@/components/ui/safe-screen';
import { ScreenPadding } from '@/components/ui/screen-padding';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/root/auth-provider';

// TODO: add forms library to simplify state
export const SignInScreen = ({ navigation }: RootStackProps<'SignIn'>) => {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = !!email && !!password && password.length >= 6;
  const handleSignIn = async () => {
    if (!isFormValid) {
      setError(t('auth.signIn.errors.fillAllFields'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn(email, password);
      if (!result.success) {
        setError(result.error.userMessage);
        return;
      }
    } catch {
      setError(t('auth.signIn.errors.signInFailed'));
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <SafeScreen header={{ title: t('auth.signIn.title') }}>
      <ScreenPadding>
        <ScrollView
          bounces={false}
          contentContainerClassName="grow justify-center"
          showsVerticalScrollIndicator={false}>
          <View className="gap-6">
            <Text size="body" className="text-muted-foreground">
              {t('auth.signIn.subtitle')}
            </Text>

            <View className="gap-2">
              <Text size="label" weight="semibold">
                {t('auth.signIn.email')}
              </Text>
              <Input
                className="border rounded-lg p-4"
                placeholder={t('auth.signIn.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View className="gap-2">
              <Text size="label" weight="semibold">
                {t('auth.signIn.password')}
              </Text>
              <View className="flex-row items-center relative">
                <Input
                  className="border rounded-lg p-4 flex-1"
                  placeholder={t('auth.signIn.passwordPlaceholder')}
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
                  {t('auth.signIn.errors.passwordTooShort')}
                </Text>
              )}
            </View>

            <Button
              title={isLoading ? t('auth.signIn.signingIn') : t('auth.signIn.signIn')}
              loading={isLoading}
              disabled={!isFormValid}
              onPress={handleSignIn}
            />

            <View className="flex-row justify-center items-center">
              <Text size="caption" className="text-muted-foreground">
                {t('auth.signIn.noAccount')}&nbsp;
              </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate('SignUp');
                }}>
                <Text size="caption" weight="semibold" className="text-primary">
                  {t('auth.signIn.createAccount')}
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
