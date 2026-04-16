import { useRouter } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// BASE
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;

// SCALE
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;

export default function EscolherTipo() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <Text style={styles.title}>O que você faz aqui?</Text>

      {/* EXPLORADOR */}
      <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push('/cadastro-explorador')}
        >
        <Image
          source={require('../assets/images/explorador.png')}
          style={styles.icon}
        />

        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>Explorador</Text>
          <Text style={styles.cardSubtitle}>
            Quero encontrar um pet próximo
          </Text>
        </View>
      </TouchableOpacity>

      {/* ESTAÇÃO */}
      <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push('/estacao')}
        >
        <Image
          source={require('../assets/images/estacao.png')} // adiciona esse ícone
          style={styles.icon}
        />

        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>Estação de apoio</Text>
          <Text style={styles.cardSubtitle}>
            Quero cadastrar pets para adoção
          </Text>
        </View>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCFD',
    padding: scale(20),
    justifyContent: 'center',
  },

  title: {
  fontSize: scale(25),
  marginBottom: scale(50),
  textAlign: 'center',
  fontFamily: 'IstokWeb-Regular',
  },

  card: {
    backgroundColor: '#0D0062',
    padding: scale(20),
    borderRadius: scale(20),
    marginBottom: scale(30),

    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: scale(50),
    height: scale(50),
    marginRight: scale(15),
  },

  textContainer: {
    flex: 1,
  },

  cardTitle: {
    color: '#fff',
    fontSize: scale(16),
    fontFamily: 'IstokWeb-Regular',
  },

  cardSubtitle: {
    color: '#D1D1D1',
    marginTop: verticalScale(5),
    fontSize: scale(13),
    fontFamily: 'IstokWeb-Regular',
  },
});