import { useEffect, useState } from 'react';

import { useIsFocused, useNavigationState } from '@react-navigation/native';

export const useCanGoBack = () => {
  const canGoBack = useNavigationState(state => state.index) !== 0;

  const [showArrow, setShowArrow] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setShowArrow(canGoBack);
    }
  }, [canGoBack, isFocused]);

  return showArrow;
};