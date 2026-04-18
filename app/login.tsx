import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

// BASE
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;

// SCALE
const scale = (size:number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size:number) => (height / guidelineBaseHeight) * size;

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [salvar, setSalvar] = useState(false);

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

      {/* BOTÃO ENTRAR */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => console.log('Login pressionado')}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push('/escolher-tipo')}>
          <Text style={styles.footerText}>Cadastrar</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Esqueci a senha</Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEDED',
    padding: 24,
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 20,
    color: '#000000',
    marginBottom: 10,
    fontFamily: 'IstokWeb-Regular',

  },
  title: {
    fontSize: 50,
    fontFamily: 'ComicNeue-Bold',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 30,
    fontFamily: 'IstokWeb-Regular',
  },
  input: {
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    fontSize: 18,
    fontFamily: 'IstokWeb-Regular',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    marginLeft: 30,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0D0062',
    borderColor: '#0D0062',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 14,
  },
  checkboxText: {
    marginLeft: 8,
    color: '#555',
    fontSize: 15,
    fontFamily: 'IstokWeb-Regular',
  },
    buttonWrapper: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#8A38F5',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignSelf: 'center', // 👈 ADICIONA ISSO
  },
  button: {
  backgroundColor: '#0D0062',
  paddingVertical: 20,
  paddingHorizontal: 105, // 👈 deixa mais estreito/bonito
  borderRadius: 16,
  alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'IstokWeb-Regular',
  },
  footer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 100, //
  },
  footerText: {
    color: '#000000',
    fontSize: 20,
    fontFamily: 'IstokWeb-Regular',
  },
});