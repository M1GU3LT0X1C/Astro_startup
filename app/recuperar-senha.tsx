import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// BASE
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;

// SCALE
const scale = (size:number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size:number) => (height / guidelineBaseHeight) * size;

export default function RecuperarSenha() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleRecuperar = () => {
    if (!email) {
      alert('Digite seu email');
      return;
    }

    // Aqui depois você conecta com API
    alert('Link de recuperação enviado!');

    router.push('/login'); // volta pro login
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.title}>Recuperar Senha</Text>

      <TextInput
        placeholder="Digite seu email"
        value={email}
        placeholderTextColor="#777"
        onChangeText={setEmail}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleRecuperar}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Voltar para login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(20),
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  title: {
    fontSize: scale(24),
    fontWeight: 'bold',
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },

  input: {
    backgroundColor:'#D9D9D9',
    borderRadius: scale(12),
    padding: scale(14),
    marginBottom: scale(15),
    fontSize: scale(18),
    fontFamily: 'IstokWeb-Regular',
  },

  button: {
    backgroundColor: '#0D0062',
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(105), 
    borderRadius: scale(16),
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontSize: scale(16),
    fontWeight: 'bold',
    fontFamily: 'IstokWeb-Regular',
  },

  link: {
    marginTop: verticalScale(15),
    textAlign: 'center',
    color: '#000000',
  },
});