import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import React, { useEffect } from 'react';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { Text } from '~/components/nativewindui/Text';
import { BackButton } from '~/components/BackButton';
import { useRouter } from 'expo-router';
import { useAuth } from '~/context/auth';
import Avatar from '~/components/Avatar';
import { hp } from '~/lib/common';
import { AntDesign, EvilIcons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '~/components/Input';
import { Button } from '~/components/nativewindui/Button';
import Loading from '~/components/Loading';
import { updateUser } from '~/functions/user';
import * as ImagePicker from 'expo-image-picker';
import { uploadFile } from '~/functions/storage';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('* Nama harus di isi')
    .min(3, 'Nama minimal 3 karakter')
    .max(20, 'Nama maksimal 20 karakter'),
  bio: yup.string().max(100, 'Bio maksimal 100 karakter'),
});

const EditProfile = () => {
  const { setUserData }: any = useAuth();
  const [image, setImage] = React.useState<any>(null);
  const { isDarkColorScheme } = useColorScheme();
  const [loading, setLoading] = React.useState(false);
  const { user: currentUser }: any = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: currentUser?.name,
      bio: currentUser?.bio,
    },
  });

  type FormData = yup.InferType<typeof schema>;

  const onPressSend = async (formData: FormData) => {
    let userDataImage = null;

    setLoading(true);

    if (image) {
      let imageRes = await uploadFile('profiles', image, true);
      if (imageRes.success) {
        userDataImage = imageRes.data;
      } else {
        userDataImage = null;
      }
      const res = await updateUser(currentUser?.id, { ...formData, image: userDataImage });
      if (!res.success) {
        Alert.alert('Error', res.msg);
        return;
      }
      setUserData({ ...currentUser, ...formData, image: userDataImage });
    } else {
      const res = await updateUser(currentUser?.id, { ...formData });
      if (!res.success) {
        Alert.alert('Error', res.msg);
        return;
      }
      setUserData({ ...currentUser, ...formData });
    }

    setLoading(false);
    setImage(null);
    router.replace('/profile');
  };

  const onImagePick = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!res.canceled) {
      setImage(res.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScreenWrapper routeName="Update Profile">
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View className="flex flex-col">
            <View className="p-3">
              <BackButton onPress={() => router.push('/profile')} />
            </View>
            <View className="items-center justify-center">
              <Avatar
                uri={currentUser.image}
                source={image}
                size={hp(14)}
                className=" border-primary"
              />
              <Pressable
                style={{
                  position: 'absolute',
                  right: 100,
                  bottom: -6,
                  backgroundColor: isDarkColorScheme ? '#000000' : '#FFFFFF',
                  borderRadius: 50,
                  padding: 4,
                }}
                onPress={onImagePick}>
                <EvilIcons
                  name="camera"
                  size={28}
                  color={isDarkColorScheme ? '#FFFFFF' : '#000000'}
                />
              </Pressable>
            </View>
            <Text variant={'caption1'} className="mx-4 mt-4 text-muted-foreground">
              Silahkan lengkapi detail profil anda
            </Text>
            <View className="mx-4 mt-4 gap-2">
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    icon={
                      <AntDesign
                        name="user"
                        size={24}
                        color={isDarkColorScheme ? 'white' : 'black'}
                      />
                    }
                    placeholder="Masukan Nama Anda"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
                name="name"
              />
              {errors.name && (
                <Text variant={'footnote'} className="text-red-500">
                  {errors.name.message}
                </Text>
              )}
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    icon={
                      <AntDesign
                        name="pushpino"
                        size={24}
                        color={isDarkColorScheme ? 'white' : 'black'}
                      />
                    }
                    placeholder="Masukan Bio Anda"
                    value={value}
                    onChangeText={onChange}
                    multiline={true}
                  />
                )}
                name="bio"
              />
              {errors.bio && (
                <Text variant={'footnote'} className="text-red-500">
                  {errors.bio.message}
                </Text>
              )}
              <View className="mt-4">
                <Button onPress={handleSubmit(onPressSend)} disabled={loading}>
                  {loading ? <Loading /> : <Text>Update Profile</Text>}
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
