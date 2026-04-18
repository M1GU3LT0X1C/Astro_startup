import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 360;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

export default function Compatibilidade1() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [moraEm, setMoraEm] = useState('');
  const [tempoCasa, setTempoCasa] = useState('');
  const [tevePets, setTevePets] = useState('');

  function avancar() {
    if (!moraEm.trim() || !tempoCasa.trim() || !tevePets.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Campos obrigatórios',
        text2: 'Responda todas as perguntas pra continuar.',
      });
      return;
    }

    router.push({
      pathname: '/finalizar-cadastro',
      params: { 
        ...params,
        mora_em: moraEm, 
        tempo_casa: tempoCasa, 
        teve_pets: tevePets 
      }
    });
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Image
          source={require('../assets/images/back.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <Text style={styles.subtitle}>
        Dados de compatibilidade
      </Text>

      <Text style={styles.title}>
        Perfil do ambiente
      </Text>

      <Text style={styles.description}>
        Sincronize suas experiências. Estes dados ajudam a estação de apoio a confirmar se seu estilo e o destino ideal para o Astro que você quer adotar.
      </Text>

      <TextInput 
        placeholder="Você mora em:" 
        style={styles.input} 
        placeholderTextColor="#777"
        value={moraEm}
        onChangeText={setMoraEm}
      />

      <TextInput 
        placeholder="Quanto tempo você passa em casa?" 
        style={styles.input} 
        placeholderTextColor="#777"
        value={tempoCasa}
        onChangeText={setTempoCasa}
      />

      <TextInput 
        placeholder="Você tem/teve outros pets?" 
        style={styles.input} 
        placeholderTextColor="#777"
        value={tevePets}
        onChangeText={setTevePets}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={avancar}
      >
        <Text style={styles.buttonText}>Avançar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCFD',
  },
  contentContainer: {
    padding: scale(20),
    paddingBottom: scale(40),
  },
  backButton: {
    width: scale(60),
    height: scale(50),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(20),
  },
  backIcon: {
    width: scale(30),
    height: scale(30),
    resizeMode: 'contain',
  },
  title: {
    fontSize: scale(30),
    marginBottom: scale(20),
    fontFamily: 'IstokWeb-Regular',
    color: '#1A1A1A'
  },
  subtitle: {
    fontSize: scale(20),
    marginBottom: scale(5),
    fontFamily: 'IstokWeb-Regular',
    color: '#1A1A1A'
  },
  description: {
    fontSize: scale(12),
    color: '#555',
    marginBottom: scale(20),
    fontFamily: 'IstokWeb-Regular',
  },
  input: {
    backgroundColor: '#D9D9D9',
    padding: scale(15),
    borderRadius: scale(15),
    marginBottom: scale(15),
    fontFamily: 'IstokWeb-Regular',
    color: '#1A1A1A',
    fontSize: scale(14),
  },
  button: {
    backgroundColor: '#0D0062',
    padding: scale(15),
    borderRadius: scale(15),
    alignItems: 'center',
    marginTop: scale(20),
  },
  buttonText: {
    color: '#fff',
    fontSize: scale(16),
    fontFamily: 'IstokWeb-Regular',
  },
});