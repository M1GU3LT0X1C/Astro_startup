import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

const guidelineBaseWidth = 360;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

const SWIPE_THRESHOLD = width * 0.25;

type Astro = {
  id: string;
  nome: string;
  especie: string; // 'cat' ou 'dog'
  imagem_url: string;
  sexo: string;
  idade: string;
  porte: string;
}

type Profile = {
  id: string;
  tipo_usuario: string;
}

export default function Match() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [astros, setAstros] = useState<Astro[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [localizacao, setLocalizacao] = useState('Recife - PE');
  const [bairro, setBairro] = useState('Cordeiro');
  const [loading, setLoading] = useState(true);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const currentPet = astros[index];

  useEffect(() => {
    loadProfile();
    loadAstros();
    getLocation();
  }, []);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
.from('profiles')
.select('id, tipo_usuario')
.eq('id', user.id)
.single();

    if (data) setProfile(data as Profile);
  }

  async function loadAstros() {
    const { data, error } = await supabase
.from('astros')
.select('*')
.eq('disponivel', true)
.order('created_at', { ascending: false });

    if (error) {
      console.log('Erro ao carregar astros:', error);
    } else {
      setAstros(data || []);
    }
    setLoading(false);
  }

  async function getLocation() {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status!== 'granted') return;

      let location = await Location.getCurrentPositionAsync({});
      let [endereco] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (endereco) {
        const cidade = endereco.city || endereco.subregion || 'Cidade';
        setLocalizacao(`${cidade} - PE`);
        setBairro(endereco.district || endereco.street || 'Bairro');
      }
    } catch (error) {
      console.log('Erro ao buscar localização');
    }
  }

  const nextCard = () => {
    setIndex((prev) => prev + 1);
    translateX.value = 0;
    translateY.value = 0;
  };

  const openAbout = () => {
    router.push({
      pathname: '/detalhe-astro',
      params: { id: currentPet.id },
    } as any);
  };

  const panGesture = Gesture.Pan()
.onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
.onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withTiming(width, {}, () => {
          runOnJS(nextCard)();
        });
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-width, {}, () => {
          runOnJS(nextCard)();
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${translateX.value / 20}deg` },
      ],
    };
  });

  const handleLike = () => {
    translateX.value = withTiming(width, {}, () => {
      runOnJS(nextCard)();
    });
  };

  const handleDislike = () => {
    translateX.value = withTiming(-width, {}, () => {
      runOnJS(nextCard)();
    });
  };

  function handleBottomPlus() {
    if (!profile) {
      router.push('/novo-post' as any);
      return;
    }

    const tipo = profile.tipo_usuario.toLowerCase().trim();

    if (tipo.includes('guardiao') || tipo.includes('guardião') || tipo.includes('estacao') || tipo.includes('base')) {
      router.push('/criar-astro' as any);
    } else {
      router.push('/novo-post' as any);
    }
  }

  if (loading) {
    return (
      <GestureHandlerRootView style={[styles.container, styles.center]}>
        <Text style={styles.emptyText}>Carregando astros...</Text>
      </GestureHandlerRootView>
    );
  }

  if (!currentPet) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <Text style={styles.emptyText}>Acabaram os astros 😢</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => router.push('/home' as any)}>
            <Image source={require('../assets/images/info.png')} style={styles.navIcon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/match' as any)}>
            <Image source={require('../assets/images/pata.png')} style={[styles.navIcon, { tintColor: '#E91E63' }]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleBottomPlus}
          >
            <Image source={require('../assets/images/add.png')} style={styles.addIcon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/chat-base' as any)}>
            <Image source={require('../assets/images/chat.png')} style={styles.navIcon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/perfil' as any)}>
            <Image source={require('../assets/images/perfil.png')} style={styles.navIcon} />
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    );
  }

  const infoArray = [currentPet.sexo, currentPet.idade, currentPet.porte].filter(Boolean);

  return (
    <GestureHandlerRootView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.locationContainer} onPress={getLocation}>
          <Image source={require('../assets/images/local.png')} style={styles.iconSmall} />
          <View>
            <Text style={styles.location}>{localizacao}</Text>
            <Text style={styles.neighborhood}>{bairro}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/notificacoes' as any)}>
          <Image source={require('../assets/images/not.png')} style={styles.iconSmall} />
        </TouchableOpacity>
      </View>

      {/* CARD */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, animatedStyle]}>

          <Image source={{ uri: currentPet.imagem_url }} style={styles.image} />

          {/* NAME + ICONS */}
          <View style={styles.nameRow}>

            <View style={styles.nameLeft}>
              <Ionicons
                name="paw"
                size={18}
                color="#0D0062"
              />
              <Text style={styles.name}>{currentPet.nome}</Text>
            </View>

            <TouchableOpacity onPress={openAbout} style={styles.bookButton}>
              <Ionicons name="information-circle-outline" size={26} color="#0D0062" />
            </TouchableOpacity>

          </View>

          {/* INFO */}
          {infoArray.map((item, i) => (
            <Text key={i} style={styles.info}>
              {item}
            </Text>
          ))}

        </Animated.View>
      </GestureDetector>

      {/* ACTIONS */}
      <View style={styles.actions}>

        <TouchableOpacity style={styles.btnDislike} onPress={handleDislike}>
          <Ionicons name="close" size={32} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnLike} onPress={handleLike}>
          <Ionicons name="heart" size={32} color="#FFF" />
        </TouchableOpacity>

      </View>

      {/* FOOTER */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => router.push('/home' as any)}>
          <Image source={require('../assets/images/info.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/match' as any)}>
          <Image source={require('../assets/images/pata.png')} style={[styles.navIcon, { tintColor: '#E91E63' }]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleBottomPlus}
        >
          <Image source={require('../assets/images/add.png')} style={styles.addIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/chat-base' as any)}>
          <Image source={require('../assets/images/chat.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/perfil' as any)}>
          <Image source={require('../assets/images/perfil.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>

    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFCFD',
    paddingTop: scale(40),
    alignItems: 'center',
  },

  center: {
    justifyContent: 'center',
  },

  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    marginBottom: scale(20),
  },

  locationContainer: {
    flexDirection: 'row',
    gap: scale(10),
  },

  location: {
    fontSize: scale(14),
  },

  neighborhood: {
    fontSize: scale(12),
    color: '#777',
  },

  card: {
    width: '85%',
    backgroundColor: '#EDEDED',
    borderRadius: scale(25),
    padding: scale(15),
    alignItems: 'center',
    elevation: 5,
  },

  image: {
    width: '100%',
    height: scale(250),
    borderRadius: scale(20),
    marginBottom: scale(10),
  },

  nameRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(10),
  },

  nameLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },

  bookButton: {
    padding: scale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },

  name: {
    fontSize: scale(16),
    fontWeight: 'bold',
  },

  info: {
    fontSize: scale(12),
    color: '#555',
    marginTop: scale(2),
    alignSelf: 'flex-start',
    width: '100%',
  },

  actions: {
    flexDirection: 'row',
    gap: scale(30),
    marginTop: scale(20),
    marginBottom: scale(100),
  },

  btnDislike: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnLike: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconSmall: {
    width: scale(20),
    height: scale(20),
  },

  emptyText: {
    fontSize: scale(26),
    marginTop: scale(40),
  },

  button: {
    backgroundColor: '#0D0062',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  navIcon: { width: scale(25), height: scale(25), resizeMode: 'contain' },
  addButton: { justifyContent: 'center', alignItems: 'center' },
  addIcon: { width: scale(40), height: scale(40), resizeMode: 'contain' },

});