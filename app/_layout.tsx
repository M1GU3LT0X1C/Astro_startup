import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import { Stack, useRootNavigationState, useRouter } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { supabase } from '../lib/supabase';

const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#0D0062',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        marginTop: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontFamily: 'IstokWeb-Regular',
        color: '#000000',
      }}
      text2Style={{
        fontSize: 13,
        fontFamily: 'IstokWeb-Regular',
        color: '#1e1c1c',
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#FF4444',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        marginTop: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontFamily: 'IstokWeb-Regular',
        color: '#000000',
      }}
      text2Style={{
        fontSize: 13,
        fontFamily: 'IstokWeb-Regular',
        color: '#D1D1D1',
      }}
    />
  ),
};

export default function RootLayout() {
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const [fontsLoaded] = useFonts({
    'IstokWeb-Regular': require('../assets/fonts/IstokWeb-Regular.ttf'),
    'ComicNeue-Regular': require('../assets/fonts/ComicNeue-Bold.ttf'),
  });

  useEffect(() => {
    console.log('[LAYOUT] useEffect rodou. navigationState.key:', navigationState?.key);
    if (!navigationState?.key ||!fontsLoaded) return;

    const processUrl = async (url: string | null) => {
      if (!url) return;
      console.log('[LAYOUT] URL recebida:', url);

      if (!url.includes('redefinir-senha')) return;

      const fragment = url.split('#')[1];
      if (!fragment) {
        console.log('[LAYOUT] Sem fragment, navegando direto');
        Toast.show({ type: 'error', text1: 'Link sem token' });
        router.replace('/redefinir-senha');
        return;
      }

      const params = new URLSearchParams(fragment);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      const type = params.get('type');

      console.log('[LAYOUT] Type:', type);
      console.log('[LAYOUT] Access token existe:',!!access_token);
      console.log('[LAYOUT] Refresh token existe:',!!refresh_token);

      if (type === 'recovery' && access_token && refresh_token) {
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        console.log('[LAYOUT] setSession error:', error);
        console.log('[LAYOUT] Sessão criada:',!!data.session);

        Toast.show({ type: 'success', text1: 'Layout navegou!' });
      }

      router.replace('/redefinir-senha');
    };

    Linking.getInitialURL().then(processUrl);
    const sub = Linking.addEventListener('url', (e) => processUrl(e.url));

    return () => sub.remove();
  }, [navigationState?.key, fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ActionSheetProvider>
      <>
        <Stack initialRouteName="index" screenOptions={{ headerShown: false }} />
        <Toast config={toastConfig} />
      </>
    </ActionSheetProvider>
  );
}