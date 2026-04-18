import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 360;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

export default function Compatibilidade2() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [temCriancas, setTemCriancas] = useState('');
  const [qtdPessoas, setQtdPessoas] = useState('');
  const [espacoDisp, setEspacoDisp] = useState('');
  const [planoContencao, setPlanoContencao] = useState('');
  const [loading, setLoading] = useState(false);

  async function finalizarCadastro() {
    if (!temCriancas.trim() || !qtdPessoas.trim() || !espacoDisp.trim() || !planoContencao.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Campos obrigatórios',
        text2: 'Responda todas as perguntas pra continuar.',
      });
      return;
    }

    setLoading(true);
    try {
      // 1. Cria no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: params.email as string,
        password: params.senha as string,
      });

      if (authError) {
        if (authError.message === 'User already registered') {
          throw new Error('Este e-mail já está cadastrado. Faça login.');
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Erro ao criar usuário');
      }

      const userId = authData.user.id;

      // 2. Insere na tabela usuarios
      const { error: dbError } = await supabase.from('usuarios').insert({
        id: userId,
        nome: params.nome as string,
        email: params.email as string,
        cpf: params.cpf as string,
        cep: params.cep as string,
        numero: params.numero as string,
        mora_em: params.mora_em as string,
        tempo_casa: params.tempo_casa as string,
        teve_pets: params.teve_pets as string,
        tem_criancas: temCriancas,
        qtd_pessoas: qtdPessoas,
        espaco_disp: espacoDisp,
        plano_contencao: planoContencao,
        tipo_usuario: 'guardiao',
      });

      if (dbError) throw dbError;

      Toast.show({
        type: 'success',
        text1: 'Guardião ativado! 🛡️',
        text2: 'Confirme seu email pra acessar',
        visibilityTime: 3000,
      });

      setTimeout(() => {
        router.replace('/homeguard'); 
      }, 1500);

    } catch (error: any) {
      console.log('ERRO GERAL:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao cadastrar',
        text2: error.message || 'Tente novamente',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
        disabled={loading}
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
        Perfil da residência
      </Text>

      <Text style={styles.description}>
        Sincronize suas experiências. Estes dados ajudam a estação de apoio a confirmar se seu estilo e o destino ideal para o Astro que você quer adotar.
      </Text>

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

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={finalizarCadastro}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Finalizar Cadastro</Text>
        )}
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
    marginTop: scale(80),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: scale(16),
    fontFamily: 'IstokWeb-Regular',
  },
});