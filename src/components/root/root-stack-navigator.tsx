import { DashboardScreen } from '@/screens/dashboard';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/INavigation';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootStackNavigator = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Dashboard" component={DashboardScreen} />
    </RootStack.Navigator>
  );
};
