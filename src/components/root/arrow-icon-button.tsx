import React from 'react';
import { Pressable } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

interface ArrowIconButtonProps {
  onPress: () => void;
}

export const ArrowIconButton = ({ onPress }: ArrowIconButtonProps) => {
  return (
    <Pressable className="px-md min-h-11 justify-center items-center" onPress={onPress}>
      <AntDesign name="arrow-left" size={18} className="text-foreground" />
    </Pressable>
  );
};
