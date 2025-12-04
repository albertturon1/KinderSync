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
import { FIREBASE_ERROR_CODES, toFirebaseError } from '@/lib/firebase/errors';

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
      setError(
        `${operationName} ${t('databaseStagingPanel.errors.operationFailed')}: ${firebaseError.getUserMessage()}`
      );
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
