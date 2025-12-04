import React, { useState } from 'react';
import { View, Pressable, ScrollView, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RootStackProps } from '@/types/INavigation';
import { UserProfileRole } from '@/components/root/auth-provider';
import { UserProfile, UserProfileSchema } from '@/lib/validation/schemas';
import { toFirebaseError } from '@/lib/firebase/errors';
import {
  createUserWithEmailAndPassword,
  FirebaseAuthTypes,
  getAuth,
} from '@react-native-firebase/auth';
import { getDatabase, ref, set } from '@react-native-firebase/database';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { SafeScreen } from '@/components/ui/safe-screen';
import { ScreenPadding } from '@/components/ui/screen-padding';
import { Input } from '@/components/ui/input';

// TODO: add forms library to simplify state
export const RegisterScreen = ({ navigation }: RootStackProps<'Register'>) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [accountType, setAccountType] = useState<UserProfileRole>('teacher');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !fullName) {
      setError(t('auth.register.errors.fillAllFields'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.register.errors.passwordsDoNotMatch'));
      return;
    }

    setIsLoading(true);
    setError(null);

    let credential: FirebaseAuthTypes.UserCredential | null = null;

    try {
      credential = await createUserWithEmailAndPassword(getAuth(), email, password);

      const uid = credential.user.uid;
      const now = new Date().toISOString();
      const baseProfile = {
        id: uid,
        email: credential.user.email!,
        displayName: fullName.trim(),
        createdAt: now,
        updatedAt: now,
        facilityId: '1',
        preferences: {
          theme: 'system' as const,
          notificationsEnabled: true,
          language: 'en',
        },
      };

      let profilePayload: UserProfile;

      // TODO: fix type handling - migrate it to a separate module
      if (accountType === 'teacher') {
        const teacherProfile: UserProfile = {
          ...baseProfile,
          role: 'teacher',
          assignedGroupIds: {}, // Empty record for teacher groups
          title: 'Nauczyciel',
        };

        const result = UserProfileSchema.safeParse(teacherProfile);
        if (!result.success) {
          setError(`Invalid profile data: ${result.error.message}`);
          return;
        }
        profilePayload = result.data;
      } else {
        const parentProfile: UserProfile = {
          ...baseProfile,
          role: 'parent',
          childrenIds: {}, // Empty record for children
          isPayer: false,
        };

        const result = UserProfileSchema.safeParse(parentProfile);
        if (!result.success) {
          setError(`Invalid profile data: ${result.error.message}`);
          return;
        }
        profilePayload = result.data;
      }

      const userRef = ref(getDatabase(), `/users/${uid}`);
      await set(userRef, profilePayload);

      navigation.navigate('Dashboard');
    } catch (err) {
      const firebaseError = toFirebaseError(err, 'auth/unknown');

      if (firebaseError.code === 'auth/email-already-in-use') {
        setError(t('auth.register.errors.emailAlreadyInUse'));
      } else if (firebaseError.code === 'auth/weak-password') {
        setError(t('auth.register.errors.weakPassword'));
      } else if (firebaseError.code === 'auth/invalid-email') {
        setError(t('auth.register.errors.invalidEmail'));
      } else {
        setError(t('auth.register.errors.registrationFailed'));
      }

      if (credential?.user) {
        await credential.user.delete().catch(() => {
          // sentry error or just use Cloud Functions
        });
      }
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
    <SafeScreen header={{ title: t('auth.register.title') }}>
      <ScreenPadding>
        <ScrollView
          bounces={false}
          contentContainerClassName="grow justify-center"
          showsVerticalScrollIndicator={false}>
          <View className="gap-6">
            <Text size="body" className="text-muted-foreground">
              {t('auth.register.subtitle')}
            </Text>

            <View className="gap-2">
              <Text size="label" weight="semibold">
                {t('auth.register.fullName')}
              </Text>
              <Input
                className="border rounded-lg p-4"
                placeholder={t('auth.register.fullNamePlaceholder')}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View className="gap-2">
              <Text size="label" weight="semibold">
                {t('auth.register.email')}
              </Text>
              <Input
                className="border rounded-lg p-4"
                placeholder={t('auth.register.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View className="gap-2">
              <Text size="label" weight="semibold">
                {t('auth.register.password')}
              </Text>
              <View className="flex-row items-center relative">
                <Input
                  className="border rounded-lg p-4 flex-1"
                  placeholder={t('auth.register.passwordPlaceholder')}
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
                {t('auth.register.confirmPassword')}
              </Text>
              <View className="flex-row items-center relative">
                <Input
                  className="border rounded-lg p-4 flex-1"
                  placeholder={t('auth.register.confirmPasswordPlaceholder')}
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
                {t('auth.register.accountType')}
              </Text>
              <View className="flex-row items-center justify-between">
                <Text size="body">{t('auth.register.teacher')}</Text>
                <Switch
                  value={accountType === 'parent'}
                  onValueChange={(value) => setAccountType(value ? 'parent' : 'teacher')}
                />
                <Text size="body">{t('auth.register.parent')}</Text>
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
                  {t('auth.register.errors.passwordTooShort')}
                </Text>
              )}

              {confirmPassword && password !== confirmPassword && (
                <Text size="caption" className="text-destructive text-center">
                  {t('auth.register.errors.passwordsDoNotMatch')}
                </Text>
              )}
            </View>

            <Button
              title={
                isLoading ? t('auth.register.creatingAccount') : t('auth.register.createAccount')
              }
              loading={isLoading}
              disabled={!isFormValid}
              onPress={handleRegister}
            />

            <View className="flex-row justify-center items-center">
              <Text size="caption" className="text-muted-foreground">
                {t('auth.register.alreadyHaveAccount')}&nbsp;
              </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate('Login');
                }}>
                <Text size="caption" weight="semibold" className="text-primary">
                  {t('auth.register.signIn')}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ScreenPadding>
    </SafeScreen>
  );
};
