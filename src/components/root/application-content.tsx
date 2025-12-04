import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import { RootStackNavigator } from './root-stack-navigator';

export const ApplicationContent = () => {
  return (
    <NavigationContainer>
      <View className="w-full flex-1">
        <RootStackNavigator />
      </View>
    </NavigationContainer>
  );
};
