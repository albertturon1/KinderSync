import React, { useState } from 'react';
import { View, Pressable, StyleSheet, ScrollView } from 'react-native';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
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
    <SafeScreen header={{ title: 'Welcome Back' }}>
      <ScreenPadding>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <Text size="body" color="mutedForeground" style={styles.subtitle}>
              Sign in to your KinderSync account
            </Text>

            <View style={styles.fieldContainer}>
              <Text size="label" weight="semibold">
                Email
              </Text>
              <Input
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text size="label" weight="semibold">
                Password
              </Text>
              <View style={styles.passwordContainer}>
                <Input
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Enter your password"
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

            <View style={styles.errorContainer}>
              {error && (
                <Text size="caption" color="destructive" style={styles.errorText}>
                  {error}
                </Text>
              )}

              {password && password.length < 6 && (
                <Text size="caption" color="destructive" style={styles.errorText}>
                  Password must be at least 6 characters
                </Text>
              )}
            </View>

            <Button
              title={isLoading ? 'Signing In...' : 'Sign In'}
              loading={isLoading}
              disabled={!isFormValid}
              onPress={handleLogin}
            />

            <View style={styles.registerContainer}>
              <Text size="caption" color="mutedForeground">
                {"Don't have an account? "}
              </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate('Register');
                }}>
                <Text size="caption" color="primary" weight="semibold">
                  Create one
                </Text>
              </Pressable>
            </View>

            <View style={styles.adminContainer}>
              <Pressable
                onPress={() => {
                  navigation.navigate('DatabaseStagingPanel');
                }}>
                <Text size="caption" color="mutedForeground" weight="semibold">
                  Database Staging Panel
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  adminContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
});
