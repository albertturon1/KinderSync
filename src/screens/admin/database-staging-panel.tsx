/* eslint-disable react-native/no-unused-styles */
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeScreen } from '@/components/ui/safe-screen';
import { ScreenPadding } from '@/components/ui/screen-padding';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useTheme, spacing, borderRadius, ThemeColors } from '@/components/ui/useTheme';
import { TEST_DATABASE, TEST_USERS } from '@/config/test-credentials';
import { getDatabase, ref, set, onValue } from '@react-native-firebase/database';
import { createUserWithEmailAndPassword, getAuth } from '@react-native-firebase/auth';
import { z } from 'zod';
import { FIREBASE_ERROR_CODES, toFirebaseError } from 'lib/firebase/errors';

type DatabaseStatus = 'empty' | 'populated' | 'unknown';

export const DatabaseStagingPanelScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [loading, setLoading] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus>('unknown');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onValue(ref(getDatabase(), '/'), (snapshot) => {
      try {
        const value = snapshot.val();

        const databaseSchema = z
          .record(z.string(), z.any());

        const result = databaseSchema.safeParse(value);
        if (result.success && Object.keys(result.data).length > 0) {
          setDbStatus('populated');
        } else if (value === null) {
          setDbStatus('empty');
        } else {
          setDbStatus('unknown');
        }
      } catch {
        setDbStatus('unknown');
      }
    });

    return () => unsubscribe();
  }, []);

  const populateDatabase = async () => {
    const users = Object.values(TEST_USERS);

    await Promise.all([
      ...users.map(async (user) => {
        try {
          await createUserWithEmailAndPassword(getAuth(), user.email, user.password);
        } catch (e) {
          const firebaseError = toFirebaseError(e, 'createUser');
          if (firebaseError.code === FIREBASE_ERROR_CODES.EMAIL_ALREADY_IN_USE) {
            // ignore because test account already exists
            // eslint-disable-next-line no-console
            console.log(`User ${user.email} already exists — OK`);
          }
        }
      }),
      set(ref(getDatabase(), '/'), TEST_DATABASE),
    ]);
  };

  const clearDatabase = async () => {
    await set(ref(getDatabase(), '/'), null);
  };

  const handleOperation = async (operation: () => Promise<void>, operationName: string) => {
    setLoading(operationName);
    setError(null);

    try {
      await operation();
    } catch (err) {
      const firebaseError = toFirebaseError(err, operationName);
      setError(`${operationName} failed: ${firebaseError.getUserMessage()}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <SafeScreen header={{ title: t('databaseStagingPanel.title') }}>
      <ScrollView>
        <ScreenPadding>
          <View style={styles.contentContainerStyle}>
            <View style={styles.section}>
              <Text size="subtitle" weight="semibold" style={styles.sectionTitle}>
                {t('databaseStagingPanel.databaseStatus')}
              </Text>
              <View style={styles.statusContainer}>
                <Text size="body" color="mutedForeground">
                  {t('databaseStagingPanel.status')}:
                </Text>
                <Text
                  size="body"
                  weight="semibold"
                  color={
                    dbStatus === 'populated'
                      ? 'primary'
                      : dbStatus === 'empty'
                        ? 'destructive'
                        : 'mutedForeground'
                  }>
                  {dbStatus === 'populated'
                    ? t('databaseStagingPanel.populated')
                    : dbStatus === 'empty'
                      ? t('databaseStagingPanel.empty')
                      : t('databaseStagingPanel.unknown')}
                </Text>
              </View>
            </View>

            {/* Database Operations */}
            <View style={styles.section}>
              <Text size="subtitle" weight="semibold" style={styles.sectionTitle}>
                {t('databaseStagingPanel.databaseOperations')}
              </Text>

              <View style={styles.buttonGrid}>
                <Button
                  title={t('databaseStagingPanel.populateDatabase')}
                  loading={loading === 'populateDatabase'}
                  disabled={!!loading}
                  onPress={() => handleOperation(populateDatabase, 'populateDatabase')}
                />

                <Button
                  title={t('databaseStagingPanel.clearDatabase')}
                  mode="destructive"
                  loading={loading === 'clearDatabase'}
                  disabled={!!loading}
                  onPress={() => handleOperation(clearDatabase, 'clearDatabase')}
                />
              </View>
            </View>

            {/* Test Credentials - Only show when database is populated */}
            {dbStatus === 'populated' && (
              <View style={styles.section}>
                <Text size="subtitle" weight="semibold" style={styles.sectionTitle}>
                  {t('databaseStagingPanel.testCredentials')}
                </Text>
                <Text size="caption" color="mutedForeground" style={styles.credentialsNote}>
                  {t('databaseStagingPanel.credentialsNote')}
                </Text>

                <View style={styles.credentialsContainer}>
                  {TEST_USERS.map((user) => (
                    <View key={user.email} style={styles.credentialItem}>
                      <Text size="label" weight="semibold" color="primary">
                        {t(`databaseStagingPanel.roles.${user.role}`)}:
                      </Text>
                      <Text size="body">
                        {user.email} / {user.password}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {error && (
              <View style={[styles.messageContainer, styles.errorMessage]}>
                <Text size="body" color="destructive">
                  {error}
                </Text>
              </View>
            )}

            {/* Instructions */}
            <View style={styles.section}>
              <Text size="subtitle" weight="semibold" style={styles.sectionTitle}>
                {t('databaseStagingPanel.instructions')}
              </Text>
              <View style={styles.instructions}>
                <Text size="body" color="mutedForeground" style={styles.instructionItem}>
                  {'• ' + t('databaseStagingPanel.populateInstruction')}
                </Text>
                <Text size="body" color="mutedForeground" style={styles.instructionItem}>
                  {'• ' + t('databaseStagingPanel.clearInstruction')}
                </Text>
              </View>
            </View>
          </View>
        </ScreenPadding>
      </ScrollView>
    </SafeScreen>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    contentContainerStyle: {
      gap: spacing.md,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: borderRadius.xl,
    },
    sectionTitle: {
      marginBottom: spacing.md,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    buttonGrid: {
      gap: spacing.md,
    },
    credentialsContainer: {
      gap: spacing.md,
    },
    credentialItem: {
      backgroundColor: colors.muted,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
    },
    credentialsNote: {
      marginBottom: spacing.md,
    },
    messageContainer: {
      marginBottom: spacing.lg,
      padding: spacing.md,
      borderRadius: borderRadius.md,
    },
    errorMessage: {
      backgroundColor: colors.destructive + '20',
    },
    successMessage: {
      backgroundColor: colors.primary + '20',
    },
    instructions: {
      gap: spacing.sm,
    },
    instructionItem: {
      paddingLeft: spacing.sm,
    },
  });
