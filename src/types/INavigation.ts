import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

export type RootStackParamList = {
  Dashboard: undefined;
};

export type RootStackProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export const useRootNavigation = <T extends keyof RootStackParamList>() => {
  return useNavigation<RootStackProps<T>>();
};
