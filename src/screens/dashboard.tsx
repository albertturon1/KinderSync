import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/root/auth-provider';
import { Button } from '@/components/ui/button';
import { SafeScreen } from '@/components/ui/safe-screen';
import { ScreenPadding } from '@/components/ui/screen-padding';
import { Text } from '@/components/ui/text';

export const DashboardScreen = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  return (
    <SafeScreen>
      <ScreenPadding>
        <Text>{t('dashboard.title')}</Text>
        <Button title={t('dashboard.logOut')} onPress={logout} />
      </ScreenPadding>
    </SafeScreen>
  );
};
