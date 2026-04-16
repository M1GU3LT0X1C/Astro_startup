import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const guidelineBaseWidth = 360;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

export default function HomeBase() {
  const router = useRouter();
  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Image source={require('../assets/images/local.png')} style={styles.iconSmall} />
          <View>
            <Text style={styles.location}>Recife - PE</Text>
            <Text style={styles.neighborhood}>Cordeiro</Text>
          </View>
        </View>

        <Image source={require('../assets/images/not.png')} style={styles.iconSmall} />
      </View>

      {/* POST INPUT */}
      <View style={styles.postBox}>
        <Image source={require('../assets/images/pawpet.png')} style={styles.avatar} />
        <Text style={styles.postPlaceholder}>Poste algo...</Text>
        <TouchableOpacity onPress={() => router.push('/criar-astro')}>
          <Image
            source={require('../assets/images/galeria.png')}
            style={styles.iconMedium}
          />
        </TouchableOpacity>
      </View>

      {/* FEED */}
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* POST 1 */}
        <View style={styles.post}>
          <View style={styles.postHeader}>
            <Image source={require('../assets/images/gabriela.png')} style={styles.avatar} />
            <View>
              <Text style={styles.name}>Gabriela Silva</Text>
              <Text style={styles.role}>Guardiã de Astros</Text>
            </View>
          </View>

          <Image source={require('../assets/images/imggato.png')} style={styles.postImage} />

          <View style={styles.actions}>
            <Image source={require('../assets/images/altloc.png')} style={styles.iconMedium} />
            <Image source={require('../assets/images/altchat.png')} style={styles.iconMedium} />
          </View>

          <Text style={styles.caption}>
            <Text style={{ fontWeight: 'bold' }}>GABRIELA SILVA </Text>
            Encontrei esse gatinho no bairro da Boa Vista, ele fica dormindo perto da entrada do Varejão do Estudante, dei comida para ele pq ele estava miando com fome, mas infelizmente não tenho condições de adotar
          </Text>
        </View>

        {/* POST 2 */}
        <View style={styles.post}>
          <View style={styles.postHeader}>
            <Image source={require('../assets/images/juliano.png')} style={styles.avatar} />
            <View>
              <Text style={styles.name}>Juliano</Text>
              <Text style={styles.role}>Explorador</Text>
            </View>
          </View>

          <Image source={require('../assets/images/imgcao.png')} style={styles.postImage} />
        </View>

      </ScrollView>

      {/* BOTTOM NAV */}
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

        <TouchableOpacity onPress={() => router.push('/chat-base')}>
          <Image source={require('../assets/images/chat.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/perfil-base')}>
          <Image
            source={require('../assets/images/perfil.png')}
            style={styles.navIcon}
          />
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
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    marginBottom: scale(15),
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },

  location: {
    fontSize: scale(14),
    fontFamily: 'IstokWeb-Regular',
  },

  neighborhood: {
    fontSize: scale(12),
    color: '#777',
    fontFamily: 'IstokWeb-Regular',
  },

  postBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDEDED',
    marginHorizontal: scale(20),
    borderRadius: scale(20),
    padding: scale(10),
    marginBottom: scale(15),
  },

  postPlaceholder: {
    flex: 1,
    marginLeft: scale(10),
    color: '#777',
    fontFamily: 'IstokWeb-Regular',
  },

  post: {
    marginBottom: scale(20),
  },

  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    marginBottom: scale(10),
    gap: scale(10),
  },

  name: {
    fontSize: scale(13),
    fontFamily: 'IstokWeb-Regular',
  },

  role: {
    fontSize: scale(11),
    color: '#777',
    fontFamily: 'IstokWeb-Regular',
  },

  postImage: {
    width: '100%',
    height: scale(200),
  },

  actions: {
    flexDirection: 'row',
    gap: scale(15),
    padding: scale(10),
  },

  caption: {
    fontSize: scale(12),
    paddingHorizontal: scale(20),
    fontFamily: 'IstokWeb-Regular',
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

  iconSmall: {
    width: scale(20),
    height: scale(20),
  },

  iconMedium: {
    width: scale(25),
    height: scale(25),
  },

  avatar: {
    width: scale(35),
    height: scale(35),
    borderRadius: scale(20),
  },
});