import { useRouter } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;

export default function CadastroGuardiao() {
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
        Registrando perfil de navegação...
      </Text>

      <Text style={styles.subtitle}>
        Dados de identificação
      </Text>

      <Text style={styles.description}>
        Ative seu sinal: Informe seus dados de identificação e coordenadas para colocar os Astros sob sua guarda na órbita de novos exploradores.
      </Text>

      {/* INPUTS */}
      <TextInput 
        style={styles.input} 
        placeholder="Nome"
        placeholderTextColor="#888"
      />

      <TextInput 
        style={styles.input} 
        placeholder="E-mail"
        placeholderTextColor="#888"
      />

      <View style={styles.row}>
        <TextInput 
          style={[styles.input, styles.half]} 
          placeholder="CEP"
          placeholderTextColor="#888"
        />
        <TextInput 
          style={[styles.input, styles.half]} 
          placeholder="Número"
          placeholderTextColor="#888"
        />
      </View>

      <TextInput 
        style={styles.input} 
        placeholder="CPF"
        placeholderTextColor="#888"
      />

      <TextInput 
        style={styles.input} 
        placeholder="Rede social"
        placeholderTextColor="#888"
      />

      {/* BOTÃO */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/guardiao-final')}
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
    fontSize: scale(18),
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
    backgroundColor: '#E5E5E5',
    padding: scale(15),
    borderRadius: scale(18),
    marginBottom: scale(15),
    fontFamily: 'IstokWeb-Regular',
    borderWidth: 1,
    borderColor: '#CFCFCF',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  half: {
    width: '48%',
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