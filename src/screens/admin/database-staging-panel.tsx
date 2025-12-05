import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeScreen } from '@/components/ui/safe-screen';
import { ScreenPadding } from '@/components/ui/screen-padding';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';

import { TEST_DATABASE, TEST_USERS } from '@/config/test-credentials';
import { getDatabase, ref, set, onValue } from '@react-native-firebase/database';
import { createUserWithEmailAndPassword, getAuth } from '@react-native-firebase/auth';
import { z } from 'zod';
import { normalizeFirebaseAuthError } from '@/errors/normalizeFirebaseAuthError';
import { SIGNUP_ERRORS } from '@/lib/firebase/auth/auth.errors';

type DatabaseStatus = 'empty' | 'populated' | 'unknown';

export const DatabaseStagingPanelScreen = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus>('unknown');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onValue(ref(getDatabase(), '/'), (snapshot) => {
      try {
        const value = snapshot.val() as unknown;

        const databaseSchema = z.record(z.string(), z.any());

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
          const error = normalizeFirebaseAuthError(e, SIGNUP_ERRORS);
          if (error.type === 'auth/email-already-in-use') {
            // ignore because test account already exists
          }
        }
      }),
      set(ref(getDatabase(), '/'), TEST_DATABASE),
    ]);
  };

  const handlePopulate = async () => {
    setLoading('populate');
    setError(null);

    try {
      await populateDatabase();
    } catch (err) {
      const error = normalizeFirebaseAuthError(err, SIGNUP_ERRORS);
      const message = error.type === 'unknown' ? error.message : error.type;
      setError(`${t('databaseStagingPanel.errors.operationFailed')}: ${message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <SafeScreen header={{ title: t('databaseStagingPanel.title') }}>
      <ScrollView>
        <ScreenPadding>
          <View className="gap-md">
            <View className="bg-card rounded-xl p-md">
              <Text size="subtitle" weight="semibold" className="mb-md">
                {t('databaseStagingPanel.databaseStatus')}
              </Text>
              <View className="flex-row items-center mb-md">
                <Text size="body" className="text-muted-foreground">
                  {t('databaseStagingPanel.status')}:
                </Text>
                <Text
                  size="body"
                  weight="semibold"
                  className={
                    dbStatus === 'populated'
                      ? 'text-primary'
                      : dbStatus === 'empty'
                        ? 'text-destructive'
                        : 'text-muted-foreground'
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
            <View className="bg-card rounded-xl p-md">
              <Text size="subtitle" weight="semibold" className="mb-md">
                {t('databaseStagingPanel.databaseOperations')}
              </Text>

              <View className="gap-md">
                {dbStatus !== 'populated' && (
                  <Button
                    title={t('databaseStagingPanel.populateDatabase')}
                    loading={loading === 'populate'}
                    disabled={!!loading}
                    onPress={handlePopulate}
                  />
                )}
              </View>
            </View>

            {/* Test Credentials - Only show when database is populated */}
            {dbStatus === 'populated' && (
              <View className="bg-card rounded-xl p-md">
                <Text size="subtitle" weight="semibold" className="mb-md">
                  {t('databaseStagingPanel.testCredentials')}
                </Text>
                <Text size="caption" className="text-muted-foreground mb-md">
                  {t('databaseStagingPanel.credentialsNote')}
                </Text>

                <View className="gap-md">
                  {TEST_USERS.map((user) => (
                    <View
                      key={user.email}
                      className="bg-muted p-md rounded-md border-l-3 border-l-primary">
                      <Text size="label" weight="semibold" className="text-primary">
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
              <View className="mb-lg p-md rounded-md bg-destructive/20">
                <Text size="body" className="text-destructive">
                  {error}
                </Text>
              </View>
            )}

            {/* Instructions */}
            <View className="bg-card rounded-xl p-md">
              <Text size="subtitle" weight="semibold" className="mb-md">
                {t('databaseStagingPanel.instructions')}
              </Text>
              <View className="gap-sm">
                <Text size="body" className="text-muted-foreground">
                  {'• ' + t('databaseStagingPanel.populateInstruction')}
                </Text>
                <Text size="body" className="text-muted-foreground">
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
