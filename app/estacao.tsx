import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

// BASE
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;

// SCALE
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;

export default function Estacao() {
    const router = useRouter();
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Que tipo de Estação de apoio você é?
      </Text>

      {/* BASE ESTELAR */}
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push('/cadastro-base')}
        >
        <View style={styles.iconWrapper}>
          <Image
            source={require('../assets/images/base.png')}
            style={styles.icon}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>Base Estelar</Text>
          <Text style={styles.cardSubtitle}>
            Organização estruturada
          </Text>
        </View>
      </TouchableOpacity>

      {/* GUARDIÃO */}
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push('/cadastro-guardiao')}
        >
        <View style={styles.iconWrapper}>
          <Image
            source={require('../assets/images/guardiao.png')}
            style={styles.icon}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>Guardião de Órbita</Text>
          <Text style={styles.cardSubtitle}>
            Protetor autônomo
          </Text>
        </View>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAEAEA',
    padding: scale(20),
    justifyContent: 'center',
  },

  title: {
    fontSize: scale(25),
    marginBottom: scale(40),
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

  iconWrapper: {
    backgroundColor: '#DE4067',
    padding: scale(10),
    borderRadius: scale(50),
    marginRight: scale(15),
  },

  icon: {
    width: scale(30),
    height: scale(30),
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