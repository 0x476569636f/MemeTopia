import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal, Dimensions, Animated } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import Avatar from './Avatar';
import { hp } from '~/lib/common';
import { formatDate } from '~/functions/Date';
import { Text } from './nativewindui/Text';
import { Image } from 'expo-image';
import { getSupabaseFileUrl } from '~/functions/storage';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

let currentPlayingVideo: any = null;

interface PostCardProps {
  item: any;
  currentUser: any;
  router: any;
  hasShadow?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ item, currentUser, router, hasShadow = true }) => {
  const { isDarkColorScheme } = useColorScheme();
  const formattedDate = formatDate(item?.created_at);
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateHeart = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        useNativeDriver: true,
        speed: 50,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
      }),
    ]).start();
  };

  const handleLike = () => {
    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);
    setLikeCount((prev: number) => prev + (newLikeStatus ? 1 : -1));
    animateHeart();
  };

  const handlePlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    if (status.isPlaying) {
      if (currentPlayingVideo && currentPlayingVideo !== videoRef.current) {
        await currentPlayingVideo.pauseAsync();
      }

      currentPlayingVideo = videoRef.current;
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      if (currentPlayingVideo === videoRef.current) {
        currentPlayingVideo = null;
      }
    }
  };

  useEffect(() => {
    return () => {
      if (currentPlayingVideo === videoRef.current) {
        currentPlayingVideo = null;
      }
    };
  }, []);

  return (
    <>
      <View
        className={`mt-4 rounded-2xl border-b border-border bg-card p-4 ${hasShadow ? 'shadow-sm' : ''}`}>
        <View className="mb-2 flex-row items-center">
          <Avatar size={hp(6)} uri={item?.user?.image} />
          <View className="ml-2 flex-1">
            <Text className="text-[17px] font-semibold leading-6">{item?.user?.name}</Text>
            <Text className="text-[13px] leading-5">{formattedDate}</Text>
          </View>
          <Feather
            name="more-horizontal"
            size={16}
            color={isDarkColorScheme ? 'rgb(0, 123, 254)' : 'black'}
          />
        </View>
        {item?.body && (
          <Text className="mb-2 text-base leading-5 text-card-foreground">{item?.body}</Text>
        )}

        {item?.file && item.file.includes('postImage') && (
          <TouchableOpacity onPress={() => setShowFullScreen(true)}>
            <Image
              source={getSupabaseFileUrl(item?.file)?.uri}
              style={{ width: '100%', height: 200 }}
              transition={100}
              contentFit="cover"
            />
            <View
              style={{
                position: 'absolute',
                right: 10,
                top: 10,
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 20,
                padding: 5,
              }}>
              <Feather name="maximize" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}
        {item?.file && item.file.includes('postVideo') && (
          <Video
            ref={videoRef}
            source={getSupabaseFileUrl(item?.file) || undefined}
            style={{ width: '100%', height: 200 }}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            shouldPlay={false}
            isLooping
          />
        )}
        <View className="mx-4 mt-4 flex-row justify-between ">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={handleLike}
            activeOpacity={0.7}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              {isLiked ? (
                <FontAwesome name="heart" size={16} color="rgb(239, 68, 68)" />
              ) : (
                <Feather
                  name="heart"
                  size={16}
                  color={isDarkColorScheme ? 'rgb(0, 123, 254)' : 'black'}
                />
              )}
            </Animated.View>
            <Text className="ml-2 text-xs text-muted-foreground">{likeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center">
            <Feather
              name="message-circle"
              size={16}
              color={isDarkColorScheme ? 'rgb(0, 123, 254)' : 'black'}
            />
            <Text className="ml-1 text-xs text-muted-foreground">{item.commentCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center">
            <Feather
              name="share"
              size={16}
              color={isDarkColorScheme ? 'rgb(0, 123, 254)' : 'black'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Full Screen Modal */}
      <Modal visible={showFullScreen} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 40, right: 20, zIndex: 1 }}
            onPress={() => setShowFullScreen(false)}>
            <Feather name="x" size={30} color="white" />
          </TouchableOpacity>
          <Image
            source={getSupabaseFileUrl(item?.file)?.uri}
            style={{
              width: screenWidth,
              height: screenHeight,
              flex: 1,
            }}
            contentFit="contain"
          />
        </View>
      </Modal>
    </>
  );
};

export default PostCard;
