import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useTheme, spacing } from '@/components/ui/useTheme';
import AntDesign from '@expo/vector-icons/AntDesign';

interface ArrowIconButtonProps {
  onPress: () => void;
}

export const ArrowIconButton = ({ onPress }: ArrowIconButtonProps) => {
  const { colors } = useTheme();

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <AntDesign name="arrow-left" size={18} color={colors.foreground} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.screen.horizontal,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
