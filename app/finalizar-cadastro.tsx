import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { supabase } from '../lib/supabase';
import { useAppAlerts } from '../utils/alert';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 360;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

type TipoUsuario = 'explorador' | 'estacao_apoio' | 'guardiao';

export default function FinalizarCadastro() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { mostrarConfirmacao, mostrarOpcoesFoto } = useAppAlerts();

  const tipoUsuario = params.tipo_usuario as TipoUsuario;
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagemUri, setImagemUri] = useState<string | null>(null);

  const textos = {
    explorador: {
      desc: 'Conte um pouco sobre sua rotina e seu estilo de vida. Essas informações ajudam a encontrar o Astro mais compatível com você.',
      placeholder: 'Fale sobre você',
      erroBio: 'Fala mais sobre você',
      sucesso: 'Bem-vindo ao Astro! 🚀'
    },
    estacao_apoio: {
      desc: 'Conte sobre o propósito das suas missões e adicione uma foto da sua equipe, logo para que sua base seja reconhecida na galáxia.',
      placeholder: 'Fale sobre a ONG',
      erroBio: 'Fala mais sobre a ONG',
      sucesso: 'Base Estelar ativada! 🚀'
    },
    guardiao: {
      desc: 'Conte sobre sua atuação como guardião e adicione uma foto ou identificação para que você seja reconhecido na rede de proteção.',
      placeholder: 'Fale sobre sua atuação',
      erroBio: 'Fala mais sobre sua atuação',
      sucesso: 'Guardião ativado! 🛡️'
    }
  }[tipoUsuario];

  async function abrirCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status!== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Permissão negada',
        text2: 'Precisamos de acesso à câmera',
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImagemUri(result.assets[0].uri);
    }
  }

  async function abrirGaleria() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImagemUri(result.assets[0].uri);
    }
  }

  async function escolherFoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status!== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Permissão negada',
        text2: 'Precisamos de acesso à galeria',
      });
      return;
    }
    mostrarOpcoesFoto(abrirCamera, abrirGaleria);
  }

  async function finalizarCadastro() {
    if (!bio || bio.trim().length < 10) {
      Toast.show({
        type: 'error',
        text1: textos.erroBio,
        text2: 'Mínimo 10 caracteres',
      });
      return;
    }

    mostrarConfirmacao(
      'Finalizar cadastro',
      'Tem certeza que deseja finalizar o cadastro?',
      () => salvarCadastro(),
      'Finalizar'
    );
  }

  async function salvarCadastro() {
    setLoading(true);
    try {
      // 1. CRIA O USUÁRIO
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: params.email as string,
        password: params.senha as string,
        options: {
          data: {
            full_name: params.nome,
            tipo_usuario: tipoUsuario
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Usuário não criado');

      const userId = authData.user.id;
      console.log('USER ID:', userId);

      let avatarUrl = null;

      // 2. UPLOAD DA FOTO
      if (imagemUri) {
        const fileExt = imagemUri.split('.').pop();
        const fileName = `${userId}.${fileExt}`;

        const response = await fetch(imagemUri);
        const blob = await response.blob();
        const arrayBuffer = await new Response(blob).arrayBuffer();

        const { error: uploadError } = await supabase.storage
         .from('avatars')
         .upload(fileName, arrayBuffer, {
            contentType: `image/${fileExt}`,
            upsert: true,
          });

        if (uploadError) {
          console.log('ERRO DO UPLOAD:', uploadError);
          throw uploadError;
        }

        const { data } = supabase.storage
         .from('avatars')
         .getPublicUrl(fileName);

        avatarUrl = data.publicUrl;
        console.log('AVATAR URL:', avatarUrl);
      }

      // 3. ATUALIZA METADADOS
      const metadata: any = {
        nome_completo: params.nome,
        tipo_usuario: tipoUsuario,
        cep: params.cep,
        numero: params.numero,
        bio: bio,
        avatar_url: avatarUrl,
      };

      // Campos específicos por tipo
      if (params.cpf) metadata.cpf = params.cpf;
      if (params.cnpj) metadata.cnpj = params.cnpj;
      if (params.rede) metadata.rede_social = params.rede;
      if (params.mora_em) metadata.mora_em = params.mora_em;
      if (params.tempo_casa) metadata.tempo_casa = params.tempo_casa;
      if (params.teve_pets) metadata.teve_pets = params.teve_pets;
      if (params.tem_criancas) metadata.tem_criancas = params.tem_criancas;
      if (params.qtd_pessoas) metadata.qtd_pessoas = params.qtd_pessoas;
      if (params.espaco_disp) metadata.espaco_disp = params.espaco_disp;
      if (params.plano_contencao) metadata.plano_contencao = params.plano_contencao;

      const { error: updateError } = await supabase.auth.updateUser({ data: metadata });
      if (updateError) throw updateError;

      // 4. INSERT NA TABELA PROFILES
      const profileData: any = {
        id: userId,
        nome_completo: params.nome as string,
        email: params.email as string,
        cep: params.cep as string,
        numero: params.numero as string,
        bio: bio,
        avatar_url: avatarUrl,
        tipo_usuario: tipoUsuario,
      };

      if (params.cpf) profileData.cpf = params.cpf as string;
      if (params.cnpj) profileData.cnpj = params.cnpj as string;
      if (params.rede) profileData.rede_social = params.rede as string;
      if (params.mora_em) profileData.mora_em = params.mora_em as string;
      if (params.tempo_casa) profileData.tempo_casa = params.tempo_casa as string;
      if (params.teve_pets) profileData.teve_pets = params.teve_pets as string;
      if (params.tem_criancas) profileData.tem_criancas = params.tem_criancas as string;
      if (params.qtd_pessoas) profileData.qtd_pessoas = params.qtd_pessoas as string;
      if (params.espaco_disp) profileData.espaco_disp = params.espaco_disp as string;
      if (params.plano_contencao) profileData.plano_contencao = params.plano_contencao as string;

      const { error: profileError } = await supabase.from('profiles').upsert(profileData, { onConflict: 'id' });
      if (profileError) throw profileError;

      Toast.show({
        type: 'success',
        text1: textos.sucesso,
        text2: 'Confirma seu email e faz login',
        visibilityTime: 4000,
      });

      setTimeout(() => router.replace('/login'), 2000);

    } catch (error: any) {
      console.log('ERRO GERAL:', error);

      if (error.message === 'User already registered') {
        Toast.show({
          type: 'error',
          text1: 'Email já cadastrado',
          text2: 'Faz login direto na conta',
          onPress: () => router.replace('/login'),
          visibilityTime: 4000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro no cadastro',
          text2: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Image
          source={require('../assets/images/back.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <Text style={styles.title}>Relatório e identidade</Text>

      <Text style={styles.description}>
        {textos.desc}
      </Text>

      <TouchableOpacity style={styles.imageContainer} onPress={escolherFoto}>
        {imagemUri? (
          <Image source={{ uri: imagemUri }} style={styles.fotoEscolhida} />
        ) : (
          <Image
            source={require('../assets/images/camera.png')}
            style={styles.cameraIcon}
          />
        )}
      </TouchableOpacity>
      <Text style={styles.fotoHint}>Toque para adicionar foto</Text>

      <TextInput
        style={styles.textArea}
        placeholder={textos.placeholder}
        placeholderTextColor="#888"
        multiline
        value={bio}
        onChangeText={setBio}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={finalizarCadastro}
        disabled={loading}
      >
        {loading? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Finalizar</Text>}
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(20),
  },
  backIcon: {
    width: scale(30),
    height: scale(30),
    resizeMode: 'contain',
  },
  title: {
    fontSize: scale(22),
    marginBottom: scale(10),
    fontFamily: 'IstokWeb-Regular',
    color: '#1A1A1A'
  },
  description: {
    fontSize: scale(12),
    color: '#555',
    marginBottom: scale(30),
    fontFamily: 'IstokWeb-Regular',
  },
  imageContainer: {
    width: scale(180),
    height: scale(180),
    borderRadius: scale(100),
    backgroundColor: '#D9D9D9',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(10),
    overflow: 'hidden',
  },
  cameraIcon: {
    width: scale(100),
    height: scale(100),
    resizeMode: 'contain',
  },
  fotoEscolhida: {
    width: scale(180),
    height: scale(180),
    borderRadius: scale(100),
  },
  fotoHint: {
    textAlign: 'center',
    color: '#777',
    fontSize: scale(12),
    marginBottom: scale(20),
    fontFamily: 'IstokWeb-Regular',
  },
  textArea: {
    backgroundColor: '#E5E5E5',
    borderRadius: scale(20),
    padding: scale(15),
    height: scale(120),
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#CFCFCF',
    fontFamily: 'IstokWeb-Regular',
    marginBottom: scale(30),
    color: '#1A1A1A'
  },
  button: {
    backgroundColor: '#0D0062',
    padding: scale(15),
    borderRadius: scale(20),
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: scale(16),
    fontFamily: 'IstokWeb-Regular',
  },
});