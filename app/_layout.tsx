import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';

export default function Layout() {

  const [fontsLoaded] = useFonts({
    'IstokWeb-Regular': require('../assets/fonts/IstokWeb-Regular.ttf'),
    'ComicNeue-Regular': require('../assets/fonts/ComicNeue-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}