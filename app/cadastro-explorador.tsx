import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// BASE
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;

// SCALE
const scale = (size: number) => (width / guidelineBaseWidth) * size;

// ADICIONEI: máscara de CPF 000.000.000-00
function maskCPF(value: string) {
  return value
   .replace(/\D/g, '')
   .replace(/(\d{3})(\d)/, '$1.$2')
   .replace(/(\d{3})(\d)/, '$1.$2')
   .replace(/(\d{3})(\d{1,2})/, '$1-$2')
   .replace(/(-\d{2})\d+?$/, '$1');
}

// ADICIONEI: máscara de CEP 00000-000
function maskCEP(value: string) {
  return value
   .replace(/\D/g, '')
   .replace(/(\d{5})(\d)/, '$1-$2')
   .replace(/(-\d{3})\d+?$/, '$1');
}

// ADICIONEI: validação de senha forte
function validarSenha(senha: string) {
  const tem8Chars = senha.length >= 8;
  const temMaiuscula = /[A-Z]/.test(senha);
  const temMinuscula = /[a-z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
  return tem8Chars && temMaiuscula && temMinuscula && temNumero && temEspecial;
}

export default function CadastroExplorador() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [cpf, setCpf] = useState('');

  function avancar() {
    if (!nome || !email || !senha || !cep || !numero || !cpf) {
      Alert.alert('Erro', 'Preencher todos os campos pra continuar.');
      return;
    }
    
    if (!validarSenha(senha)) {
      Alert.alert(
        'Senha fraca', 
        'Sua senha precisa ter:\n- Mínimo 8 caracteres\n- 1 letra maiúscula\n- 1 letra minúscula\n- 1 número\n- 1 caractere especial (!@#$...)'
      );
      return;
    }

    if (cpf.length < 14) {
      Alert.alert('Erro', 'CPF incompleto.');
      return;
    }

    if (cep.length < 9) {
      Alert.alert('Erro', 'CEP incompleto.');
      return;
    }

    router.push({
      pathname: '/compatibilidade-1',
      params: { nome, email, senha, cep, numero, cpf, tipo_usuario: 'explorador' }
    });
  }

  return (
    <View style={styles.container}>

      {/* BACK */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Image
          source={require('../assets/images/back.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      {/* HEADER */}
      <Text style={styles.title}>
        Registrando perfil de navegação...
      </Text>

      <Text style={styles.subtitle}>
        Dados pessoais
      </Text>

      <Text style={styles.description}>
        Sincronize seus dados. Usamos sua localização apenas para mapear os Astros em seu órbito e facilitar o encontro no setor mais próximo.
      </Text>

      {/* INPUTS */}
      <TextInput 
        placeholder="Nome" 
        style={styles.input} 
        placeholderTextColor="#777"
        value={nome} 
        onChangeText={setNome} 
      />
      <TextInput 
        placeholder="E-mail" 
        style={styles.input} 
        placeholderTextColor="#777"
        value={email} 
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput 
        placeholder="Senha" 
        style={styles.input} 
        placeholderTextColor="#777"
        value={senha} 
        onChangeText={setSenha}
        secureTextEntry
      />

      <View style={styles.row}>
        <TextInput 
          placeholder="CEP" 
          style={[styles.input, styles.half]} 
          placeholderTextColor="#777"
          value={cep} 
          onChangeText={(text) => setCep(maskCEP(text))} 
          keyboardType="numeric"
          maxLength={9}
        />
        <TextInput 
          placeholder="Número" 
          style={[styles.input, styles.half]} 
          placeholderTextColor="#777"
          value={numero} 
          onChangeText={setNumero}
          keyboardType="numeric"
        />
      </View>

      <TextInput 
        placeholder="CPF" 
        style={styles.input} 
        placeholderTextColor="#777"
        value={cpf} 
        onChangeText={(text) => setCpf(maskCPF(text))}
        keyboardType="numeric"
        maxLength={14}
      />

      {/* BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={avancar}
      >
        <Text style={styles.buttonText}>Avançar</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCFD',
    padding: scale(20),
  },

  backButton: {
    width: scale(50),
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
  },

  subtitle: {
    fontSize: scale(20),
    marginBottom: scale(5),
    fontFamily: 'IstokWeb-Regular',
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
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  half: {
    width: '48%',
  },

  button: {
    backgroundColor: '#0D0062',
    padding: scale(15),
    borderRadius: scale(15),
    alignItems: 'center',
    marginTop: scale(30),
  },

  buttonText: {
    color: '#fff',
    fontSize: scale(16),
    fontFamily: 'IstokWeb-Regular',
  },
});