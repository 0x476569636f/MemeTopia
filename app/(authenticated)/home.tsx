import { View, Alert } from 'react-native';
import React from 'react';
import { useAuth } from '~/context/auth';
import { supabase } from '~/lib/supabase';
import { Button } from '~/components/nativewindui/Button';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { Text } from '~/components/nativewindui/Text';

const Home = () => {
  const { user, setAuth }: any = useAuth();

  const logout = async () => {
    setAuth(null);
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScreenWrapper>
      <Text>Home</Text>
      {user && <Text>Welcome, {JSON.stringify(user.email)}</Text>}
      <Button onPress={logout}>
        <Text>Logout</Text>
      </Button>
    </ScreenWrapper>
  );
};

export default Home;
