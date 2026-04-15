import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const guidelineBaseWidth = 360;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

const topUsers = [
  {
    id: '1',
    name: 'Gabriela',
    image: require('../assets/images/gabriela.png'),
  },
  {
    id: '2',
    name: 'Juliano',
    image: require('../assets/images/juliano.png'),
  },
  {
    id: '3',
    name: 'Bianca',
    image: require('../assets/images/bianca.png'),
  },
];

const messages = [
  {
    id: '1',
    name: 'Juliano',
    text: 'Gostaria de saber se Manteiguinha se adapta à...',
    image: require('../assets/images/juliano.png'),
  },
  {
    id: '2',
    name: 'Gabriela',
    text: 'Floquinho se adaptou bem no meu apartamen...',
    image: require('../assets/images/gabriela.png'),
  },
  {
    id: '3',
    name: 'Bianca',
    text: 'Não tenho telas em casa mas se eu colocar será que...',
    image: require('../assets/images/bianca.png'),
    notify: true,
  },
];

export default function ChatGuardiao() {
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

        <Text style={styles.title}>Explore à órbita</Text>

        {/* Espaço para centralizar */}
        <View style={{ width: scale(22) }} />
      </View>

      {/* TOP USERS */}
      <View style={styles.topUsers}>
        {topUsers.map((user) => (
          <View key={user.id} style={styles.userItem}>
            <Image source={user.image} style={styles.avatarTop} />
            <Text style={styles.userName}>{user.name}</Text>
          </View>
        ))}
      </View>

      {/* SEARCH */}
      <TextInput
        placeholder="Procure"
        placeholderTextColor="#777"
        style={styles.search}
      />

      {/* DIVIDER */}
      <View style={styles.divider} />

      {/* LISTA */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.messageItem}>
            <Image source={item.image} style={styles.avatar} />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>

            {item.notify && (
              <Image
                source={require('../assets/images/mensagem.png')}
                style={styles.messageIcon}
              />
            )}
          </TouchableOpacity>
        )}
      />

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity>
          <Image source={require('../assets/images/info.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image source={require('../assets/images/pata.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/criar-astro')}
        >
            <Image source={require('../assets/images/add.png')} style={styles.addIcon} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image source={require('../assets/images/chat.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image source={require('../assets/images/perfil.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCFD',
    paddingTop: scale(40),
    paddingHorizontal: scale(20),
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(15),
  },

  backIcon: {
    width: scale(30),
    height: scale(30),
    resizeMode: 'contain',
  },

  title: {
    fontSize: scale(16),
    fontFamily: 'IstokWeb-Regular',
  },

  topUsers: {
    flexDirection: 'row',
    marginBottom: scale(15),
  },

  userItem: {
    alignItems: 'center',
    marginRight: scale(15),
  },

  avatarTop: {
    width: scale(55),
    height: scale(55),
    borderRadius: scale(30),
  },

  userName: {
    fontSize: scale(12),
    marginTop: scale(5),
    fontFamily: 'IstokWeb-Regular',
  },

  search: {
    backgroundColor: '#EDEDED',
    borderRadius: scale(20),
    padding: scale(12),
    marginBottom: scale(15),
    fontFamily: 'IstokWeb-Regular',
  },

  divider: {
    height: 1,
    backgroundColor: '#CFCFCF',
    marginBottom: scale(15),
  },

  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(18),
  },

  avatar: {
    width: scale(55),
    height: scale(55),
    borderRadius: scale(30),
    marginRight: scale(10),
  },

  name: {
    fontSize: scale(14),
    fontFamily: 'IstokWeb-Regular',
  },

  messageText: {
    fontSize: scale(12),
    color: '#666',
    fontFamily: 'IstokWeb-Regular',
  },

  messageIcon: {
    width: scale(20),
    height: scale(20),
    resizeMode: 'contain',
  },

  bottomBar: {
    position: 'absolute',
    bottom: scale(20),
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: scale(10),
    borderRadius: scale(30),
    alignItems: 'center',
    gap: scale(20),
  },

  navIcon: {
    width: scale(25),
    height: scale(25),
    resizeMode: 'contain',
  },

  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  addIcon: {
    width: scale(40),
    height: scale(40),
    resizeMode: 'contain',
  },
});