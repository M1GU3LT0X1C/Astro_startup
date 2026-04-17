import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

// Máscara de CNPJ 00.000.000/0000-00
function maskCNPJ(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

// Máscara de CEP 00000-000
function maskCEP(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
}

export default function CadastroBase() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [rede, setRede] = useState('');
  
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  function avancar() {
    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim() || !cep.trim() || !numero.trim() || !cnpj.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Campos obrigatórios',
        text2: 'Preencha todos os campos.',
        visibilityTime: 3000,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Toast.show({
        type: 'error',
        text1: 'E-mail inválido',
        text2: 'Digite um e-mail válido',
        visibilityTime: 3000,
      });
      return;
    }

    const senhaForteRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    
    if (!senhaForteRegex.test(senha)) {
      Toast.show({
        type: 'error',
        text1: 'Senha inválida',
        text2: 'Use 8+ caracteres com A-Z, a-z, 0-9 e símbolo.',
        visibilityTime: 5000,
      });
      return;
    }

    if (senha !== confirmarSenha) {
      Toast.show({
        type: 'error',
        text1: 'Senhas diferentes',
        text2: 'As senhas não coincidem',
        visibilityTime: 3000,
      });
      return;
    }

    if (cep.length < 9) {
      Toast.show({
        type: 'error',
        text1: 'CEP incompleto',
        text2: 'Verifique o número do CEP',
        visibilityTime: 3000,
      });
      return;
    }

    if (cnpj.replace(/\D/g, '').length < 14) {
      Toast.show({
        type: 'error',
        text1: 'CNPJ incompleto',
        text2: 'CNPJ precisa ter 14 dígitos',
        visibilityTime: 3000,
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Base Estelar registrada!',
      text2: 'Vamos configurar sua frota 🚀',
      visibilityTime: 2000,
    });

    setTimeout(() => {
      router.push({
        pathname: '/base-final',
        params: { 
          nome, 
          email, 
          senha,
          cep, 
          numero, 
          cnpj: cnpj.replace(/\D/g, ''), 
          rede,
          tipo_usuario: 'base_estelar' 
        }
      });
    }, 1000);
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Image source={require('../assets/images/back.png')} style={styles.backIcon}/>
      </TouchableOpacity>

      <Text style={styles.title}>Registrando perfil de navegação...</Text>
      <Text style={styles.subtitle}>Dados institucionais</Text>
      <Text style={styles.description}>
        Sincronize sua base: Insira os dados institucionais e de localização para validar sua frota e conectar seus Astros aos exploradores da região.
      </Text>

      <TextInput 
        placeholder="Nome Institucional" 
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
      
      <View style={styles.inputContainer}>
        <TextInput 
          placeholder="Senha" 
          style={styles.inputSenha} 
          placeholderTextColor="#777"
          value={senha} 
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
        />
        <TouchableOpacity 
          style={styles.eyeIcon} 
          onPress={() => setMostrarSenha(!mostrarSenha)}
        >
          <Ionicons 
            name={mostrarSenha ? "eye-off" : "eye"} 
            size={scale(20)} 
            color="#777" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput 
          placeholder="Confirmar senha" 
          style={styles.inputSenha} 
          placeholderTextColor="#777"
          value={confirmarSenha} 
          onChangeText={setConfirmarSenha}
          secureTextEntry={!mostrarConfirmarSenha}
        />
        <TouchableOpacity 
          style={styles.eyeIcon} 
          onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
        >
          <Ionicons 
            name={mostrarConfirmarSenha ? "eye-off" : "eye"} 
            size={scale(20)} 
            color="#777" 
          />
        </TouchableOpacity>
      </View>

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
        placeholder="CNPJ" 
        style={styles.input} 
        placeholderTextColor="#777"
        value={cnpj} 
        onChangeText={(text) => setCnpj(maskCNPJ(text))}
        keyboardType="numeric"
        maxLength={18}
      />
      <TextInput 
        placeholder="Rede social" 
        style={styles.input} 
        placeholderTextColor="#777"
        value={rede} 
        onChangeText={setRede}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={avancar}>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: scale(15),
    marginBottom: scale(15),
    height: scale(50),
  },
  inputSenha: {
    flex: 1,
    paddingHorizontal: scale(15),
    paddingVertical: scale(15),
    fontFamily: 'IstokWeb-Regular',
    color: '#1A1A1A',
    fontSize: scale(14),
  },
  eyeIcon: {
    padding: scale(15),
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