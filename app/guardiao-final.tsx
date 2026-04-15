import { useRouter } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;

const scale = (size: number) => (width / guidelineBaseWidth) * size;

export default function GuardiaoFinal() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* VOLTAR */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Image
          source={require('../assets/images/back.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <Text style={styles.title}>
        Relatório e identidade
      </Text>

      <Text style={styles.description}>
        Conte sobre sua atuação como guardião e adicione uma foto ou identificação para que você seja reconhecido na rede de proteção.
      </Text>

      {/* IMAGEM */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/camera.png')}
          style={styles.cameraIcon}
        />
      </View>

      {/* TEXTO */}
      <TextInput
        style={styles.textArea}
        placeholder="Fale sobre você"
        placeholderTextColor="#888"
        multiline
      />

      {/* BOTÃO */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.replace('/homeguard')}
        >
        <Text style={styles.buttonText}>Finalizar</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(20),
  },

  backIcon: {
    width: scale(30),
    height: scale(30),
    resizeMode: 'contain',
  },

  title: {
    fontSize: scale(22),
    marginBottom: scale(10),
    fontFamily: 'IstokWeb-Regular',
  },

  description: {
    fontSize: scale(12),
    color: '#555',
    marginBottom: scale(30),
    fontFamily: 'IstokWeb-Regular',
  },

  imageContainer: {
    width: scale(180),
    height: scale(180),
    borderRadius: scale(100),
    backgroundColor: '#D9D9D9',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(30),
  },

  cameraIcon: {
    width: scale(100),
    height: scale(100),
    resizeMode: 'contain',
  },

  textArea: {
    backgroundColor: '#E5E5E5',
    borderRadius: scale(20),
    padding: scale(15),
    height: scale(120),
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#CFCFCF',
    fontFamily: 'IstokWeb-Regular',
    marginBottom: scale(30),
  },

  button: {
    backgroundColor: '#0D0062',
    padding: scale(15),
    borderRadius: scale(20),
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: scale(16),
    fontFamily: 'IstokWeb-Regular',
  },
});