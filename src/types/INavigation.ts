import { NativeStackScreenProps } from '@react-navigation/native-stack';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  DatabaseStagingPanel: undefined;
};

export type RootStackProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
