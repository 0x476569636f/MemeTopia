import { Text, View } from 'react-native';
import React from 'react';
import ScreenWrapper from '~/components/ScreenWrapper';
import { ThemeToggle } from '~/components/ThemeToggle';

const index = () => {
  return (
    <ScreenWrapper>
      <View className="flex w-full flex-row items-center justify-between bg-background p-4">
        <Text className="text-xl text-foreground">Tes tailwind</Text>
        <ThemeToggle />
      </View>
      <View className="m-auto flex items-center justify-center">
        <Text className="text-4xl text-foreground">Hallo, Dunia!</Text>
      </View>
    </ScreenWrapper>
  );
};

export default index;
