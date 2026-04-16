import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message'; // ← importa ToastConfig

// Tipa o config
const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#0D0062',
        backgroundColor: '#1A1A1A',
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
  const [fontsLoaded] = useFonts({
    'IstokWeb-Regular': require('../assets/fonts/IstokWeb-Regular.ttf'),
    'ComicNeue-Regular': require('../assets/fonts/ComicNeue-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ActionSheetProvider>
      <>
        <Stack
          initialRouteName="index"
          screenOptions={{
            headerShown: false,
          }}
        />
        <Toast config={toastConfig} />
      </>
    </ActionSheetProvider>
  );
}