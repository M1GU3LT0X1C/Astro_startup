import 'react-native-gesture-handler'; // 👈 IMPORTANTE (tem que ser o primeiro)
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {

  const [fontsLoaded] = useFonts({
    'IstokWeb-Regular': require('../assets/fonts/IstokWeb-Regular.ttf'),
    'ComicNeue-Regular': require('../assets/fonts/ComicNeue-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
        }}
      />
    </GestureHandlerRootView>
  );
}