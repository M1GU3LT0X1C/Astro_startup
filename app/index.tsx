import { useRouter } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// BASE
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;

// SCALE
const scale = (size:number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size:number) => (height / guidelineBaseHeight) * size;

export default function HomeScreen() {

  const router = useRouter(); 

  return (
    <View style={styles.container}>
      
      {/* Texto */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Astro</Text>
        <Text style={styles.subtitle}>
          Encontre seu pet{"\n"}em sua órbita
        </Text>
      </View>

      {/* Gato */}
      <Image
        source={require('../assets/images/cat_astro.png')}
        style={styles.mainImage}
        resizeMode="contain"
      />

      {/* Cachorro */}
      <Image
        source={require('../assets/images/dog_astro.png')}
        style={styles.Imagedog}
        resizeMode="contain"
      />

      {/* Botão */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/login')}
      >
        <Text style={styles.buttonText}>Mapear órbita</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCFD',
    padding: scale(20),
  },

  textContainer: {
    width: scale(185),
    height: verticalScale(118),
    position: 'absolute',
    top: verticalScale(167),
    left: scale(42),
  },

  title: {
    fontSize: scale(50),
    fontFamily: 'ComicNeue-Bold',
  },

  subtitle: {
    fontSize: scale(20),
    marginTop: verticalScale(5),
    fontFamily: 'IstokWeb-Regular',
    color: '#000000',
  },

  mainImage: {
    width: scale(600),
    height: verticalScale(400),
    position: 'absolute',
    right: scale(-290),
    top: verticalScale(120),
  },

  Imagedog: {
    width: scale(700),
    height: verticalScale(400),
    position: 'absolute',
    left: scale(-150),
    top: verticalScale(290),
  },

  button: {
    position: 'absolute',
    bottom: verticalScale(60),
    alignSelf: 'center',
    backgroundColor: '#0D0062',
    paddingVertical: verticalScale(25),
    paddingHorizontal: scale(50),
    borderRadius: scale(20),
  },

  buttonText: {
    color: '#FFFCFD',
    fontWeight: 'bold',
    fontSize: scale(18),
    fontFamily: 'IstokWeb-Regular',
  },
});