import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
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
import Loading from '~/components/Loading';
import { supabase } from '~/lib/supabase';
import Alert from '~/components/Alert';
import { type AuthError } from '@supabase/supabase-js';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('* Nama harus di isi')
    .min(3, 'Nama minimal 3 karakter')
    .max(20, 'Nama maksimal 20 karakter'),
  email: yup.string().required('* Email harus di isi').email('Invalid email'),
  password: yup.string().required('* Password harus di isi').min(8, 'Password minimal 8 karakter'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], '* Password tidak sama'),
});

const SignUp = () => {
  const { isDarkColorScheme } = useColorScheme();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [errorState, setErrorState] = React.useState(false);
  const [errorObj, setErrorObj] = React.useState<AuthError | null>(null);

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

  const onPressSend = async (formData: FormData) => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password.trim();

    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    setLoading(false);
    if (error) {
      setErrorState(true);
      setErrorObj(error);
      return;
    }
  };

  if (errorState) {
    return (
      <Alert
        visible={errorState}
        onClose={
          errorObj?.status === 422
            ? () => {
                setErrorState(false);
                setErrorObj(null);
                router.replace('/sign-in');
              }
            : () => setErrorState(false)
        }
        title="Gagal Mendaftar"
        message={errorObj?.message || 'Terjadi kesalahan saat mendaftar'}
        actionText={errorObj?.status === 422 ? 'Masuk' : 'Tutup'}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScreenWrapper>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16 }}>
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

              <Button onPress={handleSubmit(onPressSend)} disabled={loading}>
                {loading ? <Loading /> : <Text>Daftar Sekarang</Text>}
              </Button>
            </View>
          </View>
        </ScrollView>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
