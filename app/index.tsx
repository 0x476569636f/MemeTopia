import { View } from 'react-native';
import React from 'react';
import Loading from '~/components/Loading';
import { useColorScheme } from '~/lib/useColorScheme';

const Index = () => {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <View className="flex flex-1 items-center justify-center">
      <Loading color={isDarkColorScheme ? '#FFFFFF' : '#000000'} size={50} />
    </View>
  );
};

export default Index;
