import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { Button } from '~/components/nativewindui/Button';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { Text } from '~/components/nativewindui/Text';
import { useRouter } from 'expo-router';

const Welcome = () => {
  const router = useRouter();
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
          <Text className="text-center" variant={'footnote'}>
            Tertawa adalah hak semua orang. MemeTopia adalah tempatnya.
          </Text>
        </View>
        <View className="w-full gap-7">
          <Button onPress={() => router.push('/sign-up')}>
            <Text>Mulai Sekarang</Text>
          </Button>
        </View>
        <View className="mb-6 flex flex-row items-center gap-1">
          <Text variant={'footnote'}>Sudah punya akun?</Text>
          <Pressable onPress={() => router.push('/sign-in')}>
            <Text variant={'footnote'} className="font-semibold text-primary">
              Masuk
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;
