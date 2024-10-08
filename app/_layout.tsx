import '../global.css';
import 'expo-dev-client';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Icon } from '@roninoss/icons';
import { Link, Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeToggle } from '~/components/ThemeToggle';
import { cn } from '~/lib/cn';
import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '~/context/auth';
import { supabase } from '~/lib/supabase';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  useInitialAndroidBarSync();
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />
      {/* WRAP YOUR APP WITH ANY ADDITIONAL PROVIDERS HERE */}
      {/* <ExampleProvider> */}
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <ActionSheetProvider>
              <NavThemeProvider value={NAV_THEME[colorScheme]}>
                <_layout />
              </NavThemeProvider>
            </ActionSheetProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </AuthProvider>

      {/* </ExampleProvider> */}
    </>
  );
}

// const SCREEN_OPTIONS = {
//   animation: 'ios', // for android
//   headerShown: false,
// } as const;

// const INDEX_OPTIONS = {
//   headerLargeTitle: true,
//   title: 'MemeTopia',
//   headerRight: () => <ThemeToggle />,
// } as const;

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth }: any = useAuth();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session?.user);
        router.replace('/home');
      } else {
        setAuth(null);
        router.replace('/welcome');
      }
    });
  }, []);
  return (
    <Stack
      screenOptions={{
        animation: 'ios',
        headerShown: false,
      }}
    />
  );
};
