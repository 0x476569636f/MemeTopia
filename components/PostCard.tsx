import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal, Animated, ActivityIndicator } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import Avatar from './Avatar';
import { hp } from '~/lib/common';
import { formatDate } from '~/functions/Date';
import { Text } from './nativewindui/Text';
import { Image } from 'expo-image';
import { downloadFile, getSupabaseFileUrl } from '~/functions/storage';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useIsFocused } from '@react-navigation/native';
import { createPostLike, removePost, removePostLike } from '~/functions/post';
import * as Sharing from 'expo-sharing';
import CommentModal from './CommentModal';
import { useActionSheet } from '@expo/react-native-action-sheet';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Alert } from 'react-native';

let currentPlayingVideo: Video | null = null;

interface PostCardProps {
  item: any;
  currentUser: any;
  router?: any;
  hasShadow?: boolean;
  isVisible?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  isVisible,
}) => {
  const isFocused = useIsFocused();
  const { isDarkColorScheme, colorScheme, colors } = useColorScheme();
  const formattedDate = formatDate(item?.created_at);
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isLoadingShare, setIsLoadingShare] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    const handleVideoPlayback = async () => {
      if (!videoRef.current || !isVideoLoaded) return;

      try {
        if (isVisible && isFocused) {
          if (currentPlayingVideo && currentPlayingVideo !== videoRef.current) {
            await currentPlayingVideo.pauseAsync();
          }
          currentPlayingVideo = videoRef.current;
          await videoRef.current.playAsync();
          setIsPlaying(true);
        } else {
          await videoRef.current.pauseAsync();
          setIsPlaying(false);
          if (currentPlayingVideo === videoRef.current) {
            currentPlayingVideo = null;
          }
        }
      } catch (error) {
        console.error('Error handling video playback:', error);
      }
    };

    handleVideoPlayback();
  }, [isVisible, isFocused, isVideoLoaded]);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pauseAsync();
        if (currentPlayingVideo === videoRef.current) {
          currentPlayingVideo = null;
        }
      }
    };
  }, []);

  useEffect(() => {
    setLikeCount(item?.postLikes?.length || 0);
    setCommentCount(
      Array.isArray(item.comments)
        ? item.comments.reduce(
            (total: number, comment: { count: number }) => total + comment.count,
            0
          )
        : 0
    );
    setIsLiked(item?.postLikes?.some((like: any) => like.userId === currentUser?.id));
  }, [item, currentUser]);

  const animateHeart = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLike = async () => {
    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);
    setLikeCount((prev) => prev + (newLikeStatus ? 1 : -1));
    animateHeart();
    if (isLiked) {
      const res = await removePostLike(item?.id, currentUser?.id);
      if (!res.success) {
        console.error('Error:', res.msg);
      }
      return;
    }
    const data = {
      userId: currentUser?.id,
      postId: item?.id,
    };

    const res = await createPostLike(data);
    if (!res.success) {
      console.error('Error:', res.msg);
    }
  };

  const handleShare = async () => {
    setIsLoadingShare(true);
    let content: { message: string; url?: string } = { message: item?.body };

    if (item?.file) {
      const fileUri = getSupabaseFileUrl(item?.file)?.uri as string;
      const localUri = await downloadFile(fileUri);

      if (typeof localUri === 'string') {
        console.log('Downloaded file:', localUri);
        content = { message: item?.body, url: localUri };
      }
    }

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(content.url || '', {
        dialogTitle: 'Share Post',
        UTI: 'public.image | public.movie',
        mimeType: 'image/png | image/jpeg | image/jpg | image/gif | video/mp4',
      });
    } else {
      alert('Sharing is not available on this device.');
    }
    setIsLoadingShare(false);
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    setIsVideoLoaded(true);

    if (status.isPlaying) {
      if (currentPlayingVideo && currentPlayingVideo !== videoRef.current) {
        currentPlayingVideo.pauseAsync();
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

  const handleOptions = () => {
    let options = ['Edit', 'Hapus', 'Batal'];
    let destructiveButtonIndex = 1;
    let cancelButtonIndex = 2;

    if (currentUser?.id === process.env.EXPO_PUBLIC_ADMIN_ID && currentUser?.id !== item?.userId) {
      options = options.filter((option) => option !== 'Edit');
      destructiveButtonIndex = 0;
      cancelButtonIndex = 1;
    }
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        containerStyle: {
          backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
        },
        textStyle: {
          color: colors.foreground,
        },
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            if (options[0] === 'Edit') {
              router.push({ pathname: 'new-post', params: { ...item } });
              break;
            } else {
              Alert.alert('Hapus', 'Apakah kamu yakin ingin menghapus postingan ini?', [
                {
                  text: 'Batal',
                  style: 'cancel',
                },
                {
                  text: 'Hapus',
                  onPress: () => onDeletePost(item?.id),
                  style: 'destructive',
                },
              ]);
              break;
            }

          case destructiveButtonIndex:
            // Delete
            Alert.alert('Hapus', 'Apakah kamu yakin ingin  menghapus postingan ini?', [
              {
                text: 'Batal',
                style: 'cancel',
              },
              {
                text: 'Hapus',
                onPress: () => onDeletePost(item?.id),
                style: 'destructive',
              },
            ]);
            break;

          case cancelButtonIndex:
            // Canceled
            break;
        }
      }
    );
  };

  const onDeletePost = async (postId: number) => {
    let res = await removePost(postId);
    if (!res.success) {
      Alert.alert('Post', res.msg);
    }
  };

  return (
    <>
      <View
        className={` mt-4 rounded-2xl border-b border-border bg-card p-4 ${hasShadow ? 'shadow-sm' : ''}`}>
        <View className="mb-2 flex-row items-center">
          <Avatar size={hp(6)} uri={item?.user?.image} />
          <View className="ml-2 flex-1">
            <Text className="text-[17px] font-semibold leading-6">{item?.user?.name}</Text>
            <Text className="text-[13px] leading-5">{formattedDate}</Text>
          </View>
          {(currentUser?.id === item?.userId ||
            currentUser?.id == process.env.EXPO_PUBLIC_ADMIN_ID) && (
            <TouchableOpacity onPress={handleOptions}>
              <Feather
                name="more-horizontal"
                size={16}
                color={colorScheme === 'dark' ? 'rgb(0, 123, 254)' : 'black'}
              />
            </TouchableOpacity>
          )}
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
          <View className="relative">
            {!isVideoLoaded && <VideoLoadingOverlay isDarkColorScheme={isDarkColorScheme} />}
            <Video
              ref={videoRef}
              source={getSupabaseFileUrl(item?.file) || undefined}
              style={{ width: '100%', height: 200 }}
              resizeMode={ResizeMode.CONTAIN}
              useNativeControls
              onLoad={() => setIsVideoLoaded(true)}
              onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
              shouldPlay={false}
              isLooping
            />
          </View>
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
            <Text className="ml-2 text-xs">{likeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setShowCommentModal(true)}>
            <Feather
              name="message-circle"
              size={16}
              color={isDarkColorScheme ? 'rgb(0, 123, 254)' : 'black'}
            />
            <Text className="ml-1 text-xs">{commentCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center" onPress={handleShare}>
            {isLoadingShare ? (
              <ActivityIndicator
                size="small"
                color={isDarkColorScheme ? 'rgb(0, 123, 254)' : 'black'}
              />
            ) : (
              <Feather
                name="share"
                size={16}
                color={isDarkColorScheme ? 'rgb(0, 123, 254)' : 'black'}
              />
            )}
          </TouchableOpacity>
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
            imageUrls={[{ url: getSupabaseFileUrl(item?.file)?.uri as string }] as any}
            enableSwipeDown
            onSwipeDown={() => setShowFullScreen(false)}
            backgroundColor="rgba(0,0,0,0.9)"
            renderIndicator={() => <></>}
          />
        </View>
      </Modal>
      <CommentModal
        isVisible={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        post={item}
        currentUser={currentUser}
      />
    </>
  );
};

const VideoLoadingOverlay = ({ isDarkColorScheme }: { isDarkColorScheme: boolean }) => (
  <View
    className="bg-card/80 absolute left-0 right-0 top-0 z-10 items-center justify-center"
    style={{ height: 200 }}>
    <ActivityIndicator size="large" color={isDarkColorScheme ? 'rgb(0, 123, 254)' : 'black'} />
    <Text className="mt-2 text-sm text-muted-foreground">Loading video...</Text>
  </View>
);
export default PostCard;
