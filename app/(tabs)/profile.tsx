import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Avatar from '~/components/Avatar';
import Loading from '~/components/Loading';
import { Button } from '~/components/nativewindui/Button';
import { Text } from '~/components/nativewindui/Text';
import PostCard from '~/components/PostCard';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { useAuth } from '~/context/auth';
import { fetchPostById } from '~/functions/post';
import { getSupabaseFileUrl } from '~/functions/storage';
import { getUserData } from '~/functions/user';
import { hp, wp } from '~/lib/common';
import { supabase } from '~/lib/supabase';
import { useColorScheme } from '~/lib/useColorScheme';

let limit = 0;

const Profile = () => {
  const { user, setAuth }: any = useAuth();
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [posts, setPosts] = useState<any[] | undefined>([]);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isDarkColorScheme } = useColorScheme();

  const handleLogout = async () => {
    Alert.alert('Logout', 'Apakah kamu yakin ingin keluar?', [
      {
        text: 'Batal',
        style: 'cancel',
      },
      {
        text: 'Keluar',
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

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setHasMore(true);

    try {
      const res = await fetchPostById(undefined, user.id);
      if (res.success) {
        setPosts(res.data);
      }
    } catch (error) {
      console.error('Refresh error:', error);
      Alert.alert('Error', 'Failed to refresh posts');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const getPost = async () => {
    if (!hasMore) return null;
    limit = limit + 6;
    let res = await fetchPostById(limit, user.id);

    if (res.success) {
      if (posts?.length == res?.data?.length) setHasMore(false);
      setPosts(res.data);
    }
  };

  const UserHeader = ({
    user,
    router,
    handleLogout,
  }: {
    user: any;
    router: any;
    handleLogout: () => void;
  }) => {
    return (
      <>
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
              <Text>Perbarui Profil</Text>
            </Button>
            <Button variant="plain" onPress={handleLogout}>
              <Text>Keluar</Text>
            </Button>
          </View>
        </View>

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
            <ImageViewer
              imageUrls={[{ url: getSupabaseFileUrl(user?.image)?.uri as string }] as any}
              enableSwipeDown
              onSwipeDown={() => setShowFullScreen(false)}
              backgroundColor="rgba(0,0,0,0.9)"
              renderIndicator={() => <></>}
            />
          </View>
        </Modal>
      </>
    );
  };

  return (
    <ScreenWrapper routeName="Profil Saya">
      <FlatList
        data={posts}
        ListHeaderComponent={<UserHeader user={user} router={router} handleLogout={handleLogout} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostCard item={item} currentUser={user} router={router} />}
        scrollEventThrottle={16}
        ListFooterComponent={
          hasMore ? (
            <View style={{ marginVertical: posts?.length == 0 ? 200 : 30 }}>
              <Loading />
            </View>
          ) : (
            <View style={{ marginVertical: 30 }}>
              <Text variant="body" className="text-center">
                Tidak ada lagi post
              </Text>
            </View>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['rgb(0, 123, 254)']}
            tintColor={isDarkColorScheme ? 'rgb(0, 123, 254)' : '#000000'}
          />
        }
        onEndReached={() => {
          getPost();
        }}
        onEndReachedThreshold={0.5}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
});

export default Profile;
