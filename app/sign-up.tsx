import { View } from 'react-native';
import React from 'react';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { BackButton } from '~/components/BackButton';
import { useRouter } from 'expo-router';
import { Text } from '~/components/nativewindui/Text';
import Input from '~/components/Input';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useColorScheme } from '~/lib/useColorScheme';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '~/components/nativewindui/Button';

const schema = yup.object().shape({
  name: yup.string().required('* Nama harus di isi').min(3, 'Nama minimal 3 karakter'),
  email: yup.string().required('* Email harus di isi').email('Invalid email'),
  password: yup.string().required('* Password harus di isi').min(8, 'Password minimal 8 karakter'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], '* Password tidak sama'),
});

const SignUp = () => {
  const { isDarkColorScheme } = useColorScheme();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  type FormData = yup.InferType<typeof schema>;

  const onPressSend = (formData: FormData) => {
    console.log('formData', formData.email);
  };

  return (
    <ScreenWrapper>
      <View className="flex flex-1 gap-11 px-3">
        <BackButton onPress={() => router.back()} />

        <View className="gap-y-1">
          <Text className="text-3xl font-bold">MemeTopia Menantimu!</Text>
          <Text className="text-lg font-normal tracking-wide">
            Bergabunglah dan Bagikan Tawa Bersama Kami!
          </Text>
        </View>
        <View className="gap-8 rounded-xl border border-border bg-card p-4 pb-6">
          <View className="mt-4 gap-2">
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
                      name="mail"
                      size={24}
                      color={isDarkColorScheme ? 'white' : 'black'}
                    />
                  }
                  placeholder="Masukan Email Anda"
                  value={value}
                  onChangeText={onChange}
                />
              )}
              name="email"
            />
            {errors.email && (
              <Text variant={'footnote'} className="text-red-500">
                {errors.email.message}
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
                      name="lock"
                      size={24}
                      color={isDarkColorScheme ? 'white' : 'black'}
                    />
                  }
                  placeholder="Masukan Password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                />
              )}
              name="password"
            />
            {errors.password && (
              <Text variant={'footnote'} className="text-red-500">
                {errors.password.message}
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
                      name="lock"
                      size={24}
                      color={isDarkColorScheme ? 'white' : 'black'}
                    />
                  }
                  placeholder="Masukan Konfirmasi Password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                />
              )}
              name="confirmPassword"
            />
            {errors.confirmPassword && (
              <Text variant={'footnote'} className="text-red-500">
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>

          <Button onPress={handleSubmit(onPressSend)}>
            <Text>Daftar Sekarang</Text>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignUp;
