import { useNavigation } from '@react-navigation/native';
import { RootStackParamList, RootStackProps } from '@/types/INavigation';

export const useRootNavigation = <T extends keyof RootStackParamList>() => {
  return useNavigation<RootStackProps<T>>();
};
