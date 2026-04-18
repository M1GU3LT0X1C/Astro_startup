import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

// BASE
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;

// SCALE
const scale = (size:number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size:number) => (height / guidelineBaseHeight) * size;

export default function Compatibilidade1() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* BACK */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Image
          source={require('../assets/images/back.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      {/* HEADER */}
      <Text style={styles.subtitle}>
        Dados de compatibilidade
      </Text>

      <Text style={styles.title}>
        Perfil do ambiente
      </Text>

      <Text style={styles.description}>
        Sincere suas experiências. Estes dados ajudam a estação de apoio a confirmar se seu estilo e o destino ideal para o Astro que você quer adotar.
      </Text>

      {/* INPUTS */}
      <TextInput 
        placeholder="Você mora em:" 
        style={styles.input} 
        placeholderTextColor="#777" 
      />

      <TextInput 
        placeholder="Quanto tempo você passa em casa?" 
        style={styles.input} 
        placeholderTextColor="#777" 
      />

      <TextInput 
        placeholder="Você tem/teve outros pets?" 
        style={styles.input} 
        placeholderTextColor="#777" 
      />

      {/* BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/compatibilidade-2')}
      >
        <Text style={styles.buttonText}>Avançar</Text>
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

  backButton: {
    width: scale(50),
    height: scale(50),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(20),
  },

  backIcon: {
    width: scale(30),
    height: scale(30),
    resizeMode: 'contain',
  },

  title: {
    fontSize: scale(30),
    marginBottom: scale(20),
    fontFamily: 'IstokWeb-Regular',
  },

  subtitle: {
    fontSize: scale(20),
    marginBottom: scale(5),
    fontFamily: 'IstokWeb-Regular',
  },

  description: {
    fontSize: scale(12),
    color: '#555',
    marginBottom: scale(20),
    fontFamily: 'IstokWeb-Regular',
  },

  input: {
    backgroundColor: '#D9D9D9',
    padding: scale(15),
    borderRadius: scale(15),
    marginBottom: scale(15),
    fontFamily: 'IstokWeb-Regular',
  },

  button: {
    backgroundColor: '#0D0062',
    padding: scale(15),
    borderRadius: scale(15),
    alignItems: 'center',
    marginTop: scale(30),
  },

  buttonText: {
    color: '#fff',
    fontSize: scale(16),
    fontFamily: 'IstokWeb-Regular',
  },
});