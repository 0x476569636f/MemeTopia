import React from 'react';
import { View, Image } from 'react-native';
import { Button } from '~/components/nativewindui/Button';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { Text } from '~/components/nativewindui/Text';

const Welcome = () => {
  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-around px-4">
        <View className="flex items-center">
          <Image className="h-80 w-80" source={require('~/assets/bg.png')} resizeMode="contain" />
        </View>
        <View className="gap-2">
          <Text className="text-center" variant={'largeTitle'}>
            MemeTopia
          </Text>
          <Text className="text-center" variant={'caption1'}>
            Tertawa adalah hak semua orang. MemeTopia adalah tempatnya.
          </Text>
        </View>
        <View className="w-full gap-7">
          <Button>
            <Text>Login</Text>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;
