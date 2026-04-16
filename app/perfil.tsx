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

const { width } = Dimensions.get('window');

const guidelineBaseWidth = 360;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

export default function Perfil() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* TOPO */}
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

        {/* MENU FLUTUANTE */}
        {menuVisible && (
          <View style={styles.popupMenu}>
            <TouchableOpacity style={styles.popupItem}>
              <Image
                source={require('../assets/images/conta.png')}
                style={styles.popupIcon}
              />
              <Text style={styles.popupText}>Conta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.popupItem}>
              <Image
                source={require('../assets/images/privacidade.png')}
                style={styles.securityIcon}
                />
              <Text style={styles.popupText}>Privacidade</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.popupItem}>
              <Image
                source={require('../assets/images/config.png')}
                style={styles.popupIcon}
              />
              <Text style={styles.popupText}>Configurações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.popupItem}>
              <Image
                source={require('../assets/images/ajuda.png')}
                style={styles.popupIcon}
              />
              <Text style={styles.popupText}>Ajuda</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.popupItem}>
              <Image
                source={require('../assets/images/verificado.png')}
                style={styles.popupIcon}
              />
              <Text style={styles.popupText}>Seja verificado</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* FOTO */}
        <View style={styles.profileCenter}>
          <Image
            source={require('../assets/images/gabriela.png')}
            style={styles.profileImage}
          />

          <TouchableOpacity style={styles.cameraButton}>
            <Image
              source={require('../assets/images/explorador.png')}
              style={styles.cameraIcon}
            />
          </TouchableOpacity>

          <Text style={styles.profileName}>Gabriela</Text>
          <Text style={styles.profileRole}>Explorador (a)</Text>
        </View>
      </View>

      {/* CARD */}
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
                  Estou à procura de um pet para fazer companhia ao meu
                  cachorrinho
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
              <Text style={styles.itemTitle}>
                Estações de Apoio vistas
              </Text>
            </View>

            <Image
              source={require('../assets/images/setas.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>

          <View style={styles.avatarRow}>
            <Image
              source={require('../assets/images/pawpet.png')}
              style={styles.smallAvatar}
            />
            <Image
              source={require('../assets/images/gabriel.png')}
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
              <Text style={styles.itemTitle}>Astros Favoritados</Text>
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
              source={require('../assets/images/fumaca.png')}
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

        <TouchableOpacity onPress={() => router.push('/criar-astro')}>
          <Image
            source={require('../assets/images/add.png')}
            style={styles.addIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/')}>
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
  },

  neighborhoodText: {
    color: '#FFF',
    fontSize: scale(11),
  },

  menuButton: {
    position: 'absolute',
    top: scale(40),
    right: scale(20),
  },

  menuIcon: {
    width: scale(24),
    height: scale(24),
  },

  popupMenu: {
    position: 'absolute',
    top: scale(70),
    right: scale(20),
    backgroundColor: '#FFF',
    borderRadius: scale(12),
    padding: scale(10),
    width: scale(170),
    zIndex: 999,
    elevation: 10,
  },

  securityIcon: {
    width: scale(18),
    height: scale(18),
    resizeMode: 'contain',
    marginRight: scale(10),
    },

  popupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scale(8),
  },

  popupIcon: {
    width: scale(18),
    height: scale(18),
    marginRight: scale(10),
  },

  popupText: {
    fontSize: scale(12),
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
  },

  profileName: {
    color: '#FFF',
    fontSize: scale(18),
    marginTop: scale(10),
  },

  profileRole: {
    color: '#FFF',
    fontSize: scale(12),
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
    marginVertical: scale(8),
  },

  itemLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: scale(8),
  },

  itemTitle: {
    fontSize: scale(13),
  },

  itemSubtitle: {
    fontSize: scale(10),
    color: '#555',
    marginTop: scale(3),
    width: scale(220),
  },

  itemIcon: {
    width: scale(18),
    height: scale(18),
  },

  arrowIcon: {
    width: scale(14),
    height: scale(14),
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
    gap: scale(20),
  },

  navIcon: {
    width: scale(25),
    height: scale(25),
  },

  addIcon: {
    width: scale(40),
    height: scale(40),
  },

  smallIcon: {
    width: scale(18),
    height: scale(18),
    marginRight: scale(5),
  },
});