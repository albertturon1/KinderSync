import { LoginScreen } from '@/screens/auth/login';
import { RegisterScreen } from '@/screens/auth/register';
import { DashboardScreen } from '@/screens/dashboard';
import { DatabaseStagingPanelScreen } from '@/screens/admin/database-staging-panel';
import { RootStackParamList } from '@/types/INavigation';
import { useAuth } from './auth-provider';
import { createStackNavigator } from '@react-navigation/stack';

const RootStack = createStackNavigator<RootStackParamList>();

export const RootStackNavigator = () => {
  const { state } = useAuth();

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!state.user ? (
        <>
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <RootStack.Screen name="Dashboard" component={DashboardScreen} />
        </>
      )}
      <RootStack.Screen name="DatabaseStagingPanel" component={DatabaseStagingPanelScreen} />
    </RootStack.Navigator>
  );
};
