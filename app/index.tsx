import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      
      {/* Texto */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Astro</Text>
        <Text style={styles.subtitle}>
          Encontre seu pet{"\n"}em sua órbita
        </Text>
      </View>

      {/* Imagem Do gato */}
      <Image
        source={require('../assets/images/cat_astro.png')}
        style={styles.mainImage}
      />

      {/* Imagem Do cachorro */}
      <View>
        <Image
          source={require('../assets/images/dog_astro.png')}
          style={styles.Imagedog}
          resizeMode="contain"
        />
      </View>

      {/* Botão */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Mapear órbita</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAEAEA',
    padding: 20,
  },

  textContainer: {
    width: 185,
    height: 118,
    top: 127,
    left: 42,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'ComicNeue',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 5,
    color: '#555',
  },

  mainImage: {
    width: '115%',
    height: 450,
    position: 'absolute',
    right: -200,
    top: 120,
  },

  Imagedog: {
    width: 700,
    height: 400,
    position: 'absolute',
    left: -150,
    top: 250,
  },

  button: {
    position: 'absolute',
    bottom: 70,
    alignSelf: 'center',
    backgroundColor: '#1E1B4B',
    paddingVertical: 25,
    paddingHorizontal: 50,
    borderRadius: 20,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})