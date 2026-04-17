import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const guidelineBaseWidth = 360;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

export default function ChatBianca() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require('../assets/images/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Image
          source={require('../assets/images/bianca.png')}
          style={styles.avatarHeader}
        />

        <Text style={styles.headerName}>Bianca</Text>
      </View>

      {/* LINHA DIVISÓRIA */}
      <View style={styles.divider} />

      {/* MESSAGES */}
      <View style={styles.chatArea}>
        <View style={styles.leftBubble}>
          <Text style={styles.messageText}>Olá Gabriel</Text>
        </View>

        <View style={styles.leftBubble}>
          <Text style={styles.messageText}>
            Eu me interessei em adotar a Cenourinha, mas gostaria de tirar umas
            dúvidas
          </Text>
        </View>

        <View style={styles.rightBubble}>
          <Text style={styles.messageText}>
            Oi Bianca, boa tarde! Pode perguntar sem problema
          </Text>
        </View>

        <View style={styles.leftBubbleLarge}>
          <Text style={styles.messageText}>
            Não tenho telas em casa mas se eu colocar será que se eu conseguir
            colocar na minha casa essa semana você pode dar o Match da
            Cenourinha comigo? Aí podemos marcar quando posso buscá-la
          </Text>
        </View>
      </View>

      {/* INPUT */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Digite aqui..."
          placeholderTextColor="#E08AA0"
          style={styles.input}
        />

        <TouchableOpacity>
          <Image
            source={require('../assets/images/enviar.png')}
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: scale(40),
    paddingHorizontal: scale(15),
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(12),
  },

  backIcon: {
    width: scale(30),
    height: scale(30),
    resizeMode: 'contain',
    marginRight: scale(10),
  },

  avatarHeader: {
    width: scale(35),
    height: scale(35),
    borderRadius: scale(20),
    marginRight: scale(10),
  },

  headerName: {
    fontSize: scale(15),
    fontFamily: 'IstokWeb-Regular',
  },

  divider: {
    height: 1,
    backgroundColor: '#D9D9D9',
    marginBottom: scale(20),
  },

  chatArea: {
    flex: 1,
  },

  leftBubble: {
    backgroundColor: '#B9A6E6',
    padding: scale(12),
    borderRadius: scale(18),
    alignSelf: 'flex-start',
    maxWidth: '70%',
    marginBottom: scale(12),
  },

  leftBubbleLarge: {
    backgroundColor: '#B9A6E6',
    padding: scale(12),
    borderRadius: scale(18),
    alignSelf: 'flex-start',
    maxWidth: '85%',
    marginBottom: scale(12),
  },

  rightBubble: {
    backgroundColor: '#F6B6C8',
    padding: scale(12),
    borderRadius: scale(18),
    alignSelf: 'flex-end',
    maxWidth: '70%',
    marginBottom: scale(12),
  },

  messageText: {
    fontSize: scale(12),
    color: '#222',
    fontFamily: 'IstokWeb-Regular',
    lineHeight: scale(18),
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0D0062',
    borderRadius: scale(25),
    paddingHorizontal: scale(15),
    paddingVertical: scale(8),
    marginBottom: scale(20),
    backgroundColor: '#FFF',
  },

  input: {
    flex: 1,
    fontFamily: 'IstokWeb-Regular',
    fontSize: scale(12),
  },

  sendIcon: {
    width: scale(20),
    height: scale(20),
    resizeMode: 'contain',
  },
});