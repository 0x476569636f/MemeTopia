import { View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ScreenWrapperProps = {
  children: React.ReactNode;
  bg?: string;
};

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children }) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;
  return <View style={{ flex: 1, paddingTop }}>{children}</View>;
};

export default ScreenWrapper;
