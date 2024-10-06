import { useRouter } from 'expo-router';
import React from 'react';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';

const Index = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <Text variant={'title1'}>Hallo, Dunia!</Text>
      <Button onPress={() => router.push('/welcome')}>
        <Text>Hallo, Dunia!</Text>
      </Button>
    </ScreenWrapper>
  );
};

export default Index;
