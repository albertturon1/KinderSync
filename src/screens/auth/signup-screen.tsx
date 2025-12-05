import React, { useState } from 'react';
import { View, Pressable, ScrollView, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RootStackProps } from '@/types/INavigation';
import { useAuth } from '@/components/root/auth-provider';
import { UserProfileSchema } from '@/lib/validation/schemas';
import type { UserProfile } from '@/lib/validation/schemas';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { SafeScreen } from '@/components/ui/safe-screen';
import { ScreenPadding } from '@/components/ui/screen-padding';
import { Input } from '@/components/ui/input';

// TODO: add forms library to simplify state
export const SignUpScreen = ({ navigation }: RootStackProps<'SignUp'>) => {
  const { t } = useTranslation();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [accountType, setAccountType] = useState<'teacher' | 'parent'>('teacher');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !fullName) {
      setError(t('auth.signUp.errors.fillAllFields'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.signUp.errors.passwordsDoNotMatch'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Inline profile creation functions
      const createBaseProfile = (email: string, fullName: string) => ({
        id: 'temp', // Will be replaced with actual UID in signUp function
        email: email.trim(),
        displayName: fullName.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        facilityId: '1',
        preferences: {
          theme: 'system' as const,
          notificationsEnabled: true,
          language: 'en',
        },
      });

      const createTeacherProfile = (base: ReturnType<typeof createBaseProfile>): UserProfile => ({
        ...base,
        role: 'teacher' as const,
        assignedGroupIds: {}, // Empty record for teacher groups
        title: 'Teacher',
      });

      const createParentProfile = (base: ReturnType<typeof createBaseProfile>) => ({
        ...base,
        role: 'parent' as const,
        childrenIds: {}, // Empty record for children
        isPayer: false,
      });

      const baseProfile = createBaseProfile(email, fullName);
      const profilePayload =
        accountType === 'teacher'
          ? createTeacherProfile(baseProfile)
          : createParentProfile(baseProfile);

      const validationResult = UserProfileSchema.safeParse(profilePayload);
      if (!validationResult.success) {
        setError(`Invalid profile data: ${validationResult.error.message}`);
        return;
      }

      const result = await signUp(email, password, validationResult.data);
      if (!result.success) {
        setError(result.error.userMessage);
        return;
      }
    } catch {
      setError(t('auth.signUp.errors.registrationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    !!email &&
    !!password &&
    !!confirmPassword &&
    !!fullName &&
    fullName.trim().length >= 2 &&
    password.length >= 6 &&
    password === confirmPassword;

  return (
    <SafeScreen header={{ title: t('auth.signUp.title') }}>
      <ScreenPadding>
        <ScrollView
          bounces={false}
          contentContainerClassName="grow justify-center"
          showsVerticalScrollIndicator={false}>
          <View className="gap-6">
            <Text size="body" className="text-muted-foreground">
              {t('auth.signUp.subtitle')}
            </Text>

            <View className="gap-2">
              <Text size="label" weight="semibold">
                {t('auth.signUp.fullName')}
              </Text>
              <Input
                className="border rounded-lg p-4"
                placeholder={t('auth.signUp.fullNamePlaceholder')}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View className="gap-2">
              <Text size="label" weight="semibold">
                {t('auth.signUp.email')}
              </Text>
              <Input
                className="border rounded-lg p-4"
                placeholder={t('auth.signUp.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View className="gap-2">
              <Text size="label" weight="semibold">
                {t('auth.signUp.password')}
              </Text>
              <View className="flex-row items-center relative">
                <Input
                  className="border rounded-lg p-4 flex-1"
                  placeholder={t('auth.signUp.passwordPlaceholder')}
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

            <View className="gap-2">
              <Text size="label" weight="semibold">
                {t('auth.signUp.confirmPassword')}
              </Text>
              <View className="flex-row items-center relative">
                <Input
                  className="border rounded-lg p-4 flex-1"
                  placeholder={t('auth.signUp.confirmPasswordPlaceholder')}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
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

            <View className="gap-2">
              <Text size="label" weight="semibold">
                {t('auth.signUp.accountType')}
              </Text>
              <View className="flex-row items-center justify-between">
                <Text size="body">{t('auth.signUp.teacher')}</Text>
                <Switch
                  value={accountType === 'parent'}
                  onValueChange={(value) => setAccountType(value ? 'parent' : 'teacher')}
                />
                <Text size="body">{t('auth.signUp.parent')}</Text>
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
                  {t('auth.signUp.errors.passwordTooShort')}
                </Text>
              )}

              {confirmPassword && password !== confirmPassword && (
                <Text size="caption" className="text-destructive text-center">
                  {t('auth.signUp.errors.passwordsDoNotMatch')}
                </Text>
              )}
            </View>

            <Button
              title={isLoading ? t('auth.signUp.creatingAccount') : t('auth.signUp.createAccount')}
              loading={isLoading}
              disabled={!isFormValid}
              onPress={handleSignUp}
            />

            <View className="flex-row justify-center items-center">
              <Text size="caption" className="text-muted-foreground">
                {t('auth.signUp.alreadyHaveAccount')}&nbsp;
              </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate('SignIn');
                }}>
                <Text size="caption" weight="semibold" className="text-primary">
                  {t('auth.signUp.signIn')}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ScreenPadding>
    </SafeScreen>
  );
};
