import { View, Text } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeToggle } from './ThemeToggle';

type ScreenWrapperProps = {
  children: React.ReactNode;
};

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children }) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;
  return (
    <View style={{ flex: 1, paddingTop }}>
      <View className="flex w-full flex-row items-center justify-between bg-background p-4">
        <Text className="text-xl text-foreground"></Text>
        <ThemeToggle />
      </View>
      {children}
    </View>
  );
};

export default ScreenWrapper;
