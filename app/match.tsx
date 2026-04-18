import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

const guidelineBaseWidth = 360;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

const SWIPE_THRESHOLD = width * 0.25;

const pets = [
  {
    id: 1,
    name: 'Cenoura',
    type: 'cat',
    image: require('../assets/images/cenoura.png'),
    info: ['Fêmea', '3 anos', 'Porte pequeno'],
  },
  {
    id: 2,
    name: 'Fumaça',
    type: 'cat',
    image: require('../assets/images/fumaca.png'),
    info: ['Fêmea', '2 anos', 'Porte pequeno'],
  },
  {
    id: 3,
    name: 'Manteiguinha',
    type: 'dog',
    image: require('../assets/images/manteiguinha.png'),
    info: ['Macho', '3 anos', 'Porte grande'],
  },
  {
    id: 4,
    name: 'Bibinho',
    type: 'dog',
    image: require('../assets/images/bibinho.png'),
    info: ['Macho', '2 anos', 'Porte grande'],
  },
];

export default function Match() {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const currentPet = pets[index];

  const nextCard = () => {
    setIndex((prev) => prev + 1);
    translateX.value = 0;
    translateY.value = 0;
  };

  const openAbout = () => {
    router.push({
      pathname: '/',
      params: { id: currentPet.id },
    });
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

  if (!currentPet) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Acabaram os pets 😢</Text>
      </View>
    );
  }

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

      {/* CARD */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, animatedStyle]}>

          <Image source={currentPet.image} style={styles.image} />

          {/* NAME + ICONS */}
          <View style={styles.nameRow}>

            <View style={styles.nameLeft}>

              <Image
                source={
                  currentPet.type === 'cat'
                    ? require('../assets/images/cat.png')
                    : require('../assets/images/dog.png')
                }
                style={styles.typeIcon}
              />

              <Text style={styles.name}>{currentPet.name}</Text>

            </View>

            <TouchableOpacity onPress={openAbout} style={styles.bookButton}>
                <Image
                    source={require('../assets/images/book.png')}
                    style={styles.bookIcon}
                    resizeMode="contain"
                />
                </TouchableOpacity>

          </View>

          {/* INFO */}
          {currentPet.info.map((item, i) => (
            <Text key={i} style={styles.info}>
              {item}
            </Text>
          ))}

        </Animated.View>
      </GestureDetector>

      {/* ACTIONS */}
      <View style={styles.actions}>

        <TouchableOpacity style={styles.btn} onPress={handleDislike}>
          <Image source={require('../assets/images/remove.png')} style={styles.iconBtn} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={handleLike}>
          <Image source={require('../assets/images/match.png')} style={styles.iconBtn} />
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
    alignItems: 'center',
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

  typeIcon: {
    width: scale(18),
    height: scale(18),
  },

    bookButton: {
    padding: scale(5),
    justifyContent: 'center',
    alignItems: 'center',
    },

    bookIcon: {
    width: scale(26),
    height: scale(26),
    resizeMode: 'contain',
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
  },

  btn: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: '#0D0062',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconBtn: {
    width: scale(28),
    height: scale(28),
    resizeMode: 'contain',
  },

  iconSmall: {
    width: scale(20),
    height: scale(20),
  },

  emptyText: {
    fontSize: scale(26),
    marginTop: scale(40),
  },

});