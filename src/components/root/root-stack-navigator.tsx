import { SignInScreen } from '@/screens/auth/signin-screen';
import { SignUpScreen } from '@/screens/auth/signup-screen';
import { DashboardScreen } from '@/screens/dashboard';
import { DatabaseStagingPanelScreen } from '@/screens/admin/database-staging-panel';
import { RootStackParamList } from '@/types/INavigation';
import { useAuth } from './auth-provider';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import { SafeScreen } from '@/components/ui/safe-screen';

const RootStack = createStackNavigator<RootStackParamList>();

export const RootStackNavigator = () => {
  const { user, loading } = useAuth();

  // TODO: show Bootsplash until loading is finished
  if (loading) {
    return (
      <SafeScreen>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <RootStack.Screen name="Dashboard" component={DashboardScreen} />
          <RootStack.Screen name="DatabaseStagingPanel" component={DatabaseStagingPanelScreen} />
        </>
      ) : (
        <>
          <RootStack.Screen name="SignIn" component={SignInScreen} />
          <RootStack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </RootStack.Navigator>
  );
};
