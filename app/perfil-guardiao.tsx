import React, { useState } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

// BASE
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;

// SCALE
const scale = (size:number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size:number) => (height / guidelineBaseHeight) * size;

export default function PerfilGuardiao() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* TOPO AZUL */}
      <View style={styles.topSection}>
        {/* LOCAL */}
        <View style={styles.locationContainer}>
          <Image
            source={require('../assets/images/local.png')}
            style={styles.smallIcon}
          />
          <View>
            <Text style={styles.locationText}>Recife - PE</Text>
            <Text style={styles.neighborhoodText}>Cordeiro</Text>
          </View>
        </View>

        {/* MENU */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(!menuVisible)}
        >
          <Image
            source={require('../assets/images/menu.png')}
            style={styles.menuIcon}
          />
        </TouchableOpacity>

        {/* MENU DROPDOWN */}
        {menuVisible && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={styles.dropdownItem}>
              <Image
                source={require('../assets/images/conta.png')}
                style={styles.dropdownIcon}
              />
              <Text style={styles.dropdownText}>Conta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdownItem}>
              <Image
                source={require('../assets/images/privacidade.png')}
                style={styles.dropdownIcon}
              />
              <Text style={styles.dropdownText}>Privacidade</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdownItem}>
              <Image
                source={require('../assets/images/config.png')}
                style={styles.dropdownIcon}
              />
              <Text style={styles.dropdownText}>Configurações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdownItem}>
              <Image
                source={require('../assets/images/ajuda.png')}
                style={styles.dropdownIcon}
              />
              <Text style={styles.dropdownText}>Ajuda</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dropdownItem}>
              <Image
                source={require('../assets/images/verificado.png')}
                style={styles.dropdownIcon}
              />
              <Text style={styles.dropdownText}>Seja verificado</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* FOTO */}
        <View style={styles.profileCenter}>
          <Image
            source={require('../assets/images/gabriel.png')}
            style={styles.profileImage}
          />

          <TouchableOpacity style={styles.cameraButton}>
            <Image
              source={require('../assets/images/guardiao.png')}
              style={styles.cameraIcon}
            />
          </TouchableOpacity>

          <Text style={styles.profileName}>Gabriel Soares</Text>
          <Text style={styles.profileRole}>Guardião de Órbita</Text>
        </View>
      </View>

      {/* CARD PRINCIPAL */}
      <View style={styles.card}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* ITEM 1 */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.itemLeft}>
              <Image
                source={require('../assets/images/registro.png')}
                style={styles.itemIcon}
              />
              <View>
                <Text style={styles.itemTitle}>Registros de bordo</Text>
                <Text style={styles.itemSubtitle}>
                  Guardião realizou cuidados diários com o animal, incluindo
                  alimentação, higiene e acompanhamento do comportamento ao
                  longo do dia.
                </Text>
              </View>
            </View>

            <Image
              source={require('../assets/images/editar.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* ITEM 2 */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.itemLeft}>
              <Image
                source={require('../assets/images/explorador.png')}
                style={styles.itemIcon}
              />
              <Text style={styles.itemTitle}>Exploradores em aproximação</Text>
            </View>

            <Image
              source={require('../assets/images/setas.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>

          <View style={styles.avatarRow}>
            <Image
              source={require('../assets/images/gabriela.png')}
              style={styles.smallAvatar}
            />
            <Image
              source={require('../assets/images/bianca.png')}
              style={styles.smallAvatar}
            />
            <Image
              source={require('../assets/images/juliano.png')}
              style={styles.smallAvatar}
            />
          </View>

          <View style={styles.divider} />

          {/* ITEM 3 */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.itemLeft}>
              <Image
                source={require('../assets/images/astro.png')}
                style={styles.itemIcon}
              />
              <Text style={styles.itemTitle}>Astros registrados</Text>
            </View>

            <Image
              source={require('../assets/images/setas.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>

          <View style={styles.avatarRow}>
            <Image
              source={require('../assets/images/bibinho.png')}
              style={styles.smallAvatar}
            />
            <Image
              source={require('../assets/images/cenoura.png')}
              style={styles.smallAvatar}
            />
          </View>

          <View style={styles.divider} />

          {/* ITEM 4 */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/criar-astro')}
          >
            <View style={styles.itemLeft}>
              <Image
                source={require('../assets/images/add.png')}
                style={styles.itemIcon}
              />
              <Text style={styles.itemTitle}>Registrar novo Astro</Text>
            </View>

            <Image
              source={require('../assets/images/setas.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* ITEM 5 */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.itemLeft}>
              <Image
                source={require('../assets/images/check.png')}
                style={styles.itemIcon}
              />
              <Text style={styles.itemTitle}>Missões concluídas</Text>
            </View>

            <Image
              source={require('../assets/images/setas.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity>
          <Image
            source={require('../assets/images/info.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image
            source={require('../assets/images/pata.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/criar-astro')}
        >
          <Image
            source={require('../assets/images/add.png')}
            style={styles.addIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/chat-guardiao')}
        >
          <Image
            source={require('../assets/images/chat.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity>
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
    backgroundColor: '#ECECEC',
  },

  topSection: {
    backgroundColor: '#12006D',
    borderBottomLeftRadius: scale(25),
    borderBottomRightRadius: scale(25),
    paddingTop: scale(40),
    paddingHorizontal: scale(20),
    paddingBottom: scale(30),
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationText: {
    color: '#FFF',
    fontSize: scale(12),
    fontFamily: 'IstokWeb-Regular',
  },

  neighborhoodText: {
    color: '#FFF',
    fontSize: scale(11),
    fontFamily: 'IstokWeb-Regular',
  },

  menuButton: {
    position: 'absolute',
    top: scale(40),
    right: scale(20),
    zIndex: 1000,
  },

  menuIcon: {
    width: scale(24),
    height: scale(24),
    resizeMode: 'contain',
  },

  dropdownMenu: {
    position: 'absolute',
    top: scale(70),
    right: scale(20),
    backgroundColor: '#FFF',
    borderRadius: scale(12),
    paddingVertical: scale(8),
    paddingHorizontal: scale(10),
    width: scale(180),
    zIndex: 999,
    elevation: 8,
  },

  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },

  dropdownIcon: {
    width: scale(18),
    height: scale(18),
    resizeMode: 'contain',
    marginRight: scale(10),
  },

  dropdownText: {
    fontSize: scale(12),
    fontFamily: 'IstokWeb-Regular',
  },

  profileCenter: {
    alignItems: 'center',
    marginTop: scale(15),
  },

  profileImage: {
    width: scale(90),
    height: scale(90),
    borderRadius: scale(45),
  },

  cameraButton: {
    position: 'absolute',
    right: scale(110),
    top: scale(5),
  },

  cameraIcon: {
    width: scale(28),
    height: scale(28),
    resizeMode: 'contain',
  },

  profileName: {
    color: '#FFF',
    fontSize: scale(18),
    marginTop: scale(10),
    fontFamily: 'IstokWeb-Regular',
  },

  profileRole: {
    color: '#FFF',
    fontSize: scale(12),
    fontFamily: 'IstokWeb-Regular',
  },

  card: {
    backgroundColor: '#FFF',
    marginHorizontal: scale(20),
    marginTop: scale(-10),
    borderRadius: scale(15),
    padding: scale(15),
    flex: 1,
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: scale(8),
  },

  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: scale(8),
  },

  itemTitle: {
    fontSize: scale(13),
    fontFamily: 'IstokWeb-Regular',
  },

  itemSubtitle: {
    fontSize: scale(10),
    color: '#555',
    marginTop: scale(3),
    width: scale(220),
    fontFamily: 'IstokWeb-Regular',
  },

  itemIcon: {
    width: scale(18),
    height: scale(18),
    resizeMode: 'contain',
  },

  arrowIcon: {
    width: scale(14),
    height: scale(14),
    resizeMode: 'contain',
  },

  divider: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: scale(10),
  },

  avatarRow: {
    flexDirection: 'row',
    marginTop: scale(8),
    gap: scale(8),
  },

  smallAvatar: {
    width: scale(35),
    height: scale(35),
    borderRadius: scale(18),
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

  addIcon: {
    width: scale(40),
    height: scale(40),
    resizeMode: 'contain',
  },

  smallIcon: {
    width: scale(18),
    height: scale(18),
    marginRight: scale(5),
  },
});