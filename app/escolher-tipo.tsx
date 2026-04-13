import { useRouter } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// BASE
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;

// SCALE
const scale = (size:number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size:number) => (height / guidelineBaseHeight) * size;

export default function EscolherTipo() {
    const router = useRouter();

    return(
        <View style={styles.container}>

            <Text style={styles.title}>O que você faz aqui?</Text>
            
            {/* EXPLORADOR */}
            <TouchableOpacity style={styles.card}>
              <Image
                source={require('../assets/images/explorador.png')}
                style={styles.icon}
              />

                <Text style={styles.cardTitle}>Explorador</Text>
                <Text style={styles.cardSubtitle}>
                Quero encontrar um pet próximo
                </Text>
            </TouchableOpacity>

            {/* ESTAÇÃO */}
            <TouchableOpacity style={styles.card}>
                <Text style={styles.cardTitle}>Estação de apoio</Text>
                <Text style={styles.cardSubtitle}>
                Quero cadastrar pets para adoção
                </Text>
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
    fontSize: scale(20),
    marginBottom: scale(30),
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#0D0062',
    padding: scale(20),
    borderRadius: scale(15),
    marginBottom: scale(20),

    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(15),
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
    fontWeight: 'bold',
    fontSize: scale(16),
  },

  cardSubtitle: {
    color: '#ccc',
    marginTop: verticalScale(5),
    flexWrap: 'wrap',
  },
});