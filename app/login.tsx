import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message'; // ← ADICIONA ISSO
import { supabase } from '../lib/supabase';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [salvar, setSalvar] = useState(false);

  const handleLogin = async () => {
    if (!email ||!senha) {
      Toast.show({
        type: 'error',
        text1: 'Campos vazios',
        text2: 'Preencher email e senha pra entrar.',
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
      });

      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Erro no login',
          text2: 'Email ou senha incorretos.',
        });
        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Bem-vindo ao Astro 🚀',
        text2: 'Entrando...',
        visibilityTime: 2000,
      });

      setTimeout(() => router.push('/homebase'), 1000);

    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Erro de conexão',
        text2: 'Não foi possível conectar ao servidor',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bem-vindo</Text>

      <Text style={styles.title}>Astro</Text>
      <Text style={styles.subtitle}>
        Encontre seu pet{'\n'}em sua órbita
      </Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#777"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#777"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[styles.checkbox, salvar && styles.checkboxChecked]}
          onPress={() => setSalvar(!salvar)}
        >
          {salvar && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>

        <Text style={styles.checkboxText}>
          Quero salvar meus dados
        </Text>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push('/escolher-tipo')}>
          <Text style={styles.footerText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/recuperar-senha')}>
          <Text style={styles.footerText}>Esqueci a senha</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEDED',
    padding: scale(24),
    justifyContent: 'center',
  },
  welcome: {
    fontSize: scale(20),
    color: '#000000',
    marginBottom: scale(10),
    fontFamily: 'IstokWeb-Regular',
  },
  title: {
    fontSize: scale(50),
    fontFamily: 'ComicNeue-Bold',
  },
  subtitle: {
    fontSize: scale(18),
    marginBottom: scale(15),
    fontFamily: 'IstokWeb-Regular',
  },
  input: {
    backgroundColor: '#D9D9D9',
    borderRadius: scale(12),
    padding: scale(14),
    marginBottom: scale(15),
    fontSize: scale(18),
    fontFamily: 'IstokWeb-Regular',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(35),
    marginLeft: scale(30),
  },
  checkbox: {
    width: scale(20),
    height: verticalScale(20),
    borderWidth: scale(1),
    borderColor: '#555',
    borderRadius: scale(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0D0062',
    borderColor: '#0D0062',
  },
  checkmark: {
    color: '#FFF',
    fontSize: scale(10),
  },
  checkboxText: {
    marginLeft: scale(8),
    color: '#555',
    fontSize: scale(15),
    fontFamily: 'IstokWeb-Regular',
  },
  buttonWrapper: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#8A38F5',
    padding: scale(20),
    borderRadius: scale(16),
    marginBottom: verticalScale(20),
    alignSelf: 'center',
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
    fontSize: scale(18),
    fontWeight: 'bold',
    fontFamily: 'IstokWeb-Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(100),
  },
  footerText: {
    color: '#000000',
    fontSize: scale(20),
    fontFamily: 'IstokWeb-Regular',
  },
});