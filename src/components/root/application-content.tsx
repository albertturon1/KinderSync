import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { RootStackNavigator } from './root-stack-navigator';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
});

export const ApplicationContent = () => {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <RootStackNavigator />
      </View>
    </NavigationContainer>
  );
};
