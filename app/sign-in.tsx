import { useRouter } from 'expo-router';
import React from 'react';
import { BackButton } from '~/components/BackButton';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';

const SignIn = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <BackButton onPress={() => router.back()} />
    </ScreenWrapper>
  );
};

export default SignIn;
