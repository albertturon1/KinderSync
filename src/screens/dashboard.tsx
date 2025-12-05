import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/root/auth-provider';
import { Button } from '@/components/ui/button';
import { SafeScreen } from '@/components/ui/safe-screen';
import { ScreenPadding } from '@/components/ui/screen-padding';
import { Text } from '@/components/ui/text';

export const DashboardScreen = () => {
  const { t } = useTranslation();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    const result = await signOut();
    if (!result.success) {
      // eslint-disable-next-line no-console
      console.error('Logout failed:', result.error);
    }
  };

  return (
    <SafeScreen>
      <ScreenPadding>
        <Text>{t('dashboard.title')}</Text>
        <Button title={t('dashboard.logOut')} onPress={handleLogout} />
      </ScreenPadding>
    </SafeScreen>
  );
};
