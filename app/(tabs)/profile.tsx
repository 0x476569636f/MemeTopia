import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import Avatar from '~/components/Avatar';
import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { useAuth } from '~/context/auth';
import { hp } from '~/lib/common';
import { supabase } from '~/lib/supabase';

const Profile = () => {
  const { user, setAuth }: any = useAuth();
  const [showFullScreen, setShowFullScreen] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          setAuth(null);
          const { error } = await supabase.auth.signOut();

          if (error) {
            Alert.alert('Error', error.message);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScreenWrapper routeName="Profile">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="rounded-3xl bg-card">
          <View className="flex items-center justify-center">
            <TouchableOpacity onPress={() => setShowFullScreen(true)}>
              <View className="m-3">
                <Avatar
                  uri={user?.image}
                  size={hp(15)}
                  style={{
                    borderWidth: 1,
                  }}
                />
              </View>
            </TouchableOpacity>
            <Text variant={'body'} className="font-bold">
              {user?.name.toUpperCase()}
            </Text>
            <Text variant={'footnote'}>{user?.email}</Text>
            <Text variant={'footnote'} className="mt-3">
              About me:
            </Text>
            <Text variant={'footnote'} className="mx-6">
              {user?.bio}
            </Text>
          </View>
          <View className="mx-2 mt-6 flex flex-row items-center justify-between p-2">
            <Button
              variant="plain"
              onPress={() => {
                router.push('/edit-profile');
              }}>
              <Text>Ubah Profil</Text>
            </Button>
            <Button variant="plain" onPress={handleLogout}>
              <Text>Keluar</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={showFullScreen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFullScreen(false)}>
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 40,
              right: 20,
              zIndex: 1,
              padding: 10,
              borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
            onPress={() => setShowFullScreen(false)}>
            <Feather name="x" size={30} color="white" />
          </TouchableOpacity>
          <Avatar
            uri={user?.image}
            style={{
              width: screenWidth,
              height: screenHeight,
              flex: 1,
              resizeMode: 'contain',
            }}
          />
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

export default Profile;
