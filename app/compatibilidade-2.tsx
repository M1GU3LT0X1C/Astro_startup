import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// BASE
const guidelineBaseWidth = 360;

// SCALE
const scale = (size: number) => (width / guidelineBaseWidth) * size;

export default function Compatibilidade2() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  
  const [temCriancas, setTemCriancas] = useState('');
  const [qtdPessoas, setQtdPessoas] = useState('');
  const [espacoDisp, setEspacoDisp] = useState('');
  const [planoContencao, setPlanoContencao] = useState('');

  function avancar() {
    if (!temCriancas || !qtdPessoas || !espacoDisp || !planoContencao) {
      Alert.alert('Erro', 'Responder todas as perguntas pra continuar.');
      return;
    }

    router.push({
      pathname: '/explorador-final',
      params: { 
        ...params, 
        tem_criancas: temCriancas,
        qtd_pessoas: qtdPessoas,
        espaco_disp: espacoDisp,
        plano_contencao: planoContencao
      }
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
      <Text style={styles.subtitle}>
        Dados de compatibilidade
      </Text>

      <Text style={styles.title}>
        Perfil da residência
      </Text>

      <Text style={styles.description}>
        Sincere suas experiências. Estes dados ajudam a estação de apoio a confirmar se seu estilo e o destino ideal para o Astro que você quer adotar.
      </Text>

      {/* INPUTS */}
      <TextInput 
        placeholder="Há crianças em sua residência?" 
        style={styles.input} 
        placeholderTextColor="#777"
        value={temCriancas}
        onChangeText={setTemCriancas}
      />

      <TextInput 
        placeholder="Quantidade de pessoas na residência:" 
        style={styles.input} 
        placeholderTextColor="#777"
        value={qtdPessoas}
        onChangeText={setQtdPessoas}
        keyboardType="numeric"
      />

      <TextInput 
        placeholder="Existe espaço disponível na residência?" 
        style={styles.input} 
        placeholderTextColor="#777"
        value={espacoDisp}
        onChangeText={setEspacoDisp}
      />

      <TextInput 
        placeholder="Na residência tem plano de contenção?" 
        style={styles.input} 
        placeholderTextColor="#777"
        value={planoContencao}
        onChangeText={setPlanoContencao}
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

  button: {
    backgroundColor: '#0D0062',
    padding: scale(15),
    borderRadius: scale(15),
    alignItems: 'center',
    marginTop: scale(80),
  },

  buttonText: {
    color: '#fff',
    fontSize: scale(16),
    fontFamily: 'IstokWeb-Regular',
  },
});