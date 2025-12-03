import React, { useState } from 'react';
import { View, Pressable, StyleSheet, ScrollView, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RootStackProps } from '@/types/INavigation';
import { UserProfileRole } from '@/components/root/auth-provider';
import { UserProfile, UserProfileSchema } from 'lib/validation/schemas';
import { toFirebaseError } from 'lib/firebase/errors';
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
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <Text size="body" color="mutedForeground" style={styles.subtitle}>
              {t('auth.register.subtitle')}
            </Text>

            <View style={styles.fieldContainer}>
              <Text size="label" weight="semibold">
                {t('auth.register.fullName')}
              </Text>
              <Input
                style={styles.input}
                placeholder={t('auth.register.fullNamePlaceholder')}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text size="label" weight="semibold">
                {t('auth.register.email')}
              </Text>
              <Input
                style={styles.input}
                placeholder={t('auth.register.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text size="label" weight="semibold">
                {t('auth.register.password')}
              </Text>
              <View style={styles.passwordContainer}>
                <Input
                  style={[styles.input, styles.passwordInput]}
                  placeholder={t('auth.register.passwordPlaceholder')}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.eyeText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text size="label" weight="semibold">
                {t('auth.register.confirmPassword')}
              </Text>
              <View style={styles.passwordContainer}>
                <Input
                  style={[styles.input, styles.passwordInput]}
                  placeholder={t('auth.register.confirmPasswordPlaceholder')}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.eyeText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text size="label" weight="semibold">
                {t('auth.register.accountType')}
              </Text>
              <View style={styles.switchContainer}>
                <Text size="body" style={styles.switchLabel}>
                  {t('auth.register.teacher')}
                </Text>
                <Switch
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(value) => {
                    if (value) {
                      setAccountType('parent');
                    } else {
                      setAccountType('teacher');
                    }
                  }}
                  value={accountType === 'parent'}
                />
                <Text size="body" style={styles.switchLabel}>
                  {t('auth.register.parent')}
                </Text>
              </View>
            </View>

            <View style={styles.errorContainer}>
              {error && (
                <Text size="caption" color="destructive" style={styles.errorText}>
                  {error}
                </Text>
              )}

              {password && password.length < 6 && (
                <Text size="caption" color="destructive" style={styles.errorText}>
                  {t('auth.register.errors.passwordTooShort')}
                </Text>
              )}

              {fullName && fullName.trim().length < 2 && (
                <Text size="caption" color="destructive" style={styles.errorText}>
                  {t('auth.register.errors.nameTooShort')}
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

            <View style={styles.loginContainer}>
              <Text size="caption" color="mutedForeground">
                {t('auth.register.alreadyHaveAccount')}{' '}
              </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate('Login');
                }}>
                <Text size="caption" color="primary" weight="semibold">
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

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    borderRadius: 20,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  subtitle: {
    marginBottom: 32,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  errorContainer: {
    marginBottom: 8,
    minHeight: 8,
  },
  errorText: {
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    flex: 1,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  eyeText: {
    fontSize: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
});
