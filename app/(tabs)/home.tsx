import {
  View,
  Alert,
  Pressable,
  FlatList,
  StyleSheet,
  RefreshControl,
  ViewabilityConfig,
  ViewToken,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '~/context/auth';
import { supabase } from '~/lib/supabase';
import { Button } from '~/components/nativewindui/Button';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { Text } from '~/components/nativewindui/Text';
import { ScrollView } from 'react-native-gesture-handler';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useColorScheme } from '~/lib/useColorScheme';
import { useRouter } from 'expo-router';
import { fetchPost } from '~/functions/post';
import PostCard from '~/components/PostCard';
import { wp } from '~/lib/common';
import Loading from '~/components/Loading';
import { getUserData } from '~/functions/user';

let limit = 0;

const Home = () => {
  const { user, setAuth }: any = useAuth();
  const { isDarkColorScheme } = useColorScheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

  const [visibleItems, setVisibleItems] = useState<string[]>([]);

  const viewabilityConfig: ViewabilityConfig = {
    itemVisiblePercentThreshold: 100,
  };

  const onViewableItemsChanged = React.useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const visibleItemIds = viewableItems.map((item) => item.key);
      setVisibleItems(visibleItemIds);
    },
    []
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    limit = 0;
    try {
      const res = await fetchPost(10);
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

  const [posts, setPosts] = React.useState<any[] | undefined>([]);

  const handlePostEvent = async (payload: any) => {
    console.log(payload);
    if (payload.eventType == 'INSERT') {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);
      newPost.user = res.success ? res.data : {};
      setPosts((prevPost = []) => [newPost, ...prevPost]);
    }
  };

  useEffect(() => {
    let postChannel = supabase
      .channel('posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, handlePostEvent)
      .subscribe();
    getPost();

    return () => {
      postChannel.unsubscribe();
    };
  }, []);

  const getPost = async () => {
    limit = limit + 10;
    let res = await fetchPost(limit);
    if (res.success) {
      setPosts(res.data);
    }
  };

  return (
    <ScreenWrapper routeName="Home">
      <View style={{ flex: 1 }}>
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostCard
              item={item}
              isVisible={visibleItems.includes(item.id.toString())}
              currentUser={user}
              router={router}
            />
          )}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          scrollEventThrottle={16}
          ListFooterComponent={
            <View style={{ marginVertical: posts?.length == 0 ? 200 : 30 }}>
              <Loading />
            </View>
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
            if (!refreshing) {
              getPost();
            }
          }}
          onEndReachedThreshold={0.5}
        />

        <Pressable
          onPress={() => router.push('/new-post')}
          style={{
            position: 'absolute',
            bottom: 10,
            right: 18,
            backgroundColor: isDarkColorScheme ? 'rgb(0, 123, 254)' : '#FFFFFF',
            borderRadius: 50,
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}>
          <FontAwesome6 name="add" size={24} color={isDarkColorScheme ? '#FFFFFF' : '#000000'} />
        </Pressable>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
});

export default Home;
