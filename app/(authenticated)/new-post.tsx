import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { Text } from '~/components/nativewindui/Text';
import { BackButton } from '~/components/BackButton';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Avatar from '~/components/Avatar';
import { useAuth } from '~/context/auth';
import { hp } from '~/lib/common';
import TextEditor from '~/components/TextEditor';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useColorScheme } from '~/lib/useColorScheme';
import * as ImagePicker from 'expo-image-picker';
import { getSupabaseFileUrl } from '~/functions/storage';
import { Button } from '~/components/nativewindui/Button';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ResizeMode, Video } from 'expo-av';
import { createOrUpdatePost } from '~/functions/post';
import Loading from '~/components/Loading';
import { Feather } from '@expo/vector-icons';
import ImageViewer from 'react-native-image-zoom-viewer';

const NewPost = () => {
  const router = useRouter();
  const { user }: any = useAuth();

  const editorRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<any>(null);
  const [postContent, setPostContent] = useState('');
  const { isDarkColorScheme } = useColorScheme();
  const [showFullScreen, setShowFullScreen] = useState(false);
  const post = useLocalSearchParams();

  useEffect(() => {
    if (post && post.id) {
      setFile(post.file);
      setPostContent(Array.isArray(post.body) ? post.body.join(' ') : post.body);
    }
  }, []);

  const onPick = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!res.canceled) {
      setFile(res.assets[0]);
    }
  };

  const isLocalFile = (file: any) => {
    if (!file) return false;
    if (typeof file == 'object') return true;
    return false;
  };

  const getFileType = (file: any) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.type;
    }

    if (file.includes('postImage')) {
      return 'image';
    }
    return 'video';
  };

  const getFileUri = (file: any) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.uri;
    } else {
      return getSupabaseFileUrl(file)?.uri;
    }
  };

  const onSubmit = async () => {
    if (!file) {
      Alert.alert('Error', 'Dibutuhkan gambar atau video meme');
      return;
    }

    let data: { file: any; body: string; userId: any; id?: string } = {
      file,
      body: postContent,
      userId: user?.id,
    };

    if (post && post.id) data.id = post.id as string;

    setLoading(true);
    let res = await createOrUpdatePost(data);
    setLoading(false);

    if (res?.success) {
      setFile(null);
      setPostContent('');
      editorRef.current.clear();
      router.back();
    } else {
      Alert.alert('Error', 'Gagal membuat post');
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScreenWrapper routeName="Unggah Meme">
          <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
            <BackButton onPress={() => router.back()} />
            <View className="mt-4 flex flex-row">
              <Avatar uri={user.image} size={hp(7)} />
              <View className="ml-2">
                <Text variant={'heading'}>{user.name}</Text>
                <Text variant={'footnote'} className="text-muted-foreground">
                  Publik
                </Text>
              </View>
            </View>
            <TextEditor
              ref={editorRef}
              value={postContent}
              onChangeText={setPostContent}
              placeholder="Meme apa yang bikin kamu tertawa hari ini?"
              style={{ marginTop: 16, minHeight: 100 }}
            />

            {file && (
              <View style={styles.file}>
                {getFileType(file) === 'video' ? (
                  <Video
                    style={{ flex: 1 }}
                    source={{ uri: getFileUri(file) }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping></Video>
                ) : (
                  <TouchableOpacity onPress={() => setShowFullScreen(true)}>
                    <Image
                      source={{ uri: getFileUri(file) }}
                      style={{ width: '100%', height: 200 }}
                      contentFit="cover"
                    />
                    <View
                      style={{
                        position: 'absolute',
                        right: 10,
                        bottom: 10,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        borderRadius: 20,
                        padding: 5,
                      }}>
                      <Feather name="maximize" size={24} color="white" />
                    </View>
                  </TouchableOpacity>
                )}
                <Pressable style={styles.closeIcon} onPress={() => setFile(null)}>
                  <AntDesign name="delete" size={24} color="white" />
                </Pressable>
              </View>
            )}

            <View style={styles.media}>
              {file ? (
                <Text variant={'caption1'}>Ganti Lampiran</Text>
              ) : (
                <Text variant={'caption1'}>Lampirkan meme yang ingin kamu bagikan.</Text>
              )}

              <View style={styles.mediaIcons}>
                <TouchableOpacity onPress={onPick}>
                  <FontAwesome5
                    name="images"
                    size={24}
                    color={isDarkColorScheme ? 'white' : 'black'}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginTop: 16 }}>
              <Button onPress={onSubmit} disabled={loading}>
                {loading ? <Loading /> : <Text>{post && post.id ? 'Update' : 'Posting'}</Text>}
              </Button>
            </View>
          </ScrollView>
        </ScreenWrapper>
      </KeyboardAvoidingView>
      {/* Full Screen Modal */}
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
            imageUrls={[{ url: getFileUri(file) as string }] as any}
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

const styles = StyleSheet.create({
  media: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderCurve: 'continuous',
    borderColor: 'rgb(0, 123, 254)',
    marginTop: 16,
  },
  mediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  file: {
    height: hp(30),
    width: '100%',
    borderRadius: 10,
    marginTop: 16,
    overflow: 'hidden',
    borderCurve: 'continuous',
  },

  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    padding: 5,
  },
});

export default NewPost;
