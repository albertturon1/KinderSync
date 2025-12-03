import { useAuth } from '@/components/root/auth-provider';
import { Button } from '@/components/ui/button';
import { SafeScreen } from '@/components/ui/safe-screen';
import { ScreenPadding } from '@/components/ui/screen-padding';
import { Text } from '@/components/ui/text';

export const DashboardScreen = () => {
  const { logout } = useAuth();
  return (
    <SafeScreen>
      <ScreenPadding>
        <Text>Dashboard</Text>
        <Button title="Log out" onPress={logout} />
      </ScreenPadding>
    </SafeScreen>
  );
};
