import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { supabase } from '../lib/supabase';
import { useAppAlerts } from '../utils/alert';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 360;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

export default function BaseFinal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { mostrarConfirmacao, mostrarOpcoesFoto } = useAppAlerts();

  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagemUri, setImagemUri] = useState<string | null>(null);

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
        text1: 'Fala mais sobre a ONG',
        text2: 'Mínimo 10 caracteres.',
      });
      return;
    }

    mostrarConfirmacao(
      'Finalizar cadastro',
      'Tem certeza que deseja finalizar o cadastro da sua Base Estelar?',
      () => salvarCadastro(),
      'Finalizar'
    );
  }

  async function salvarCadastro() {
    setLoading(true);
    try {
      // 1. CRIA O USUÁRIO COM A SENHA DO FORM
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: params.email as string,
        password: params.senha as string,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Usuário não criado');

      const userId = authData.user.id;
      console.log('USER ID:', userId);

      let avatarUrl = null;

      // 2. UPLOAD DA IMAGEM
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

      // 3. INSERT NA TABELA USUARIOS
      const { error: dbError } = await supabase.from('usuarios').insert({
        id: userId,
        nome: params.nome,
        email: params.email,
        cnpj: params.cnpj,
        cep: params.cep,
        numero: params.numero,
        rede_social: params.rede,
        bio: bio,
        avatar_url: avatarUrl,
        tipo_usuario: 'base_estelar',
      });

      if (dbError) throw dbError;

      Toast.show({
        type: 'success',
        text1: 'Base Estelar ativada! 🚀',
        text2: 'Bem vindo ao Astro.',
        visibilityTime: 4000,
      });

      setTimeout(() => router.replace('/homebase'), 1500);

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
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Image source={require('../assets/images/back.png')} style={styles.backIcon}/>
      </TouchableOpacity>

      <Text style={styles.title}>Relatório e identidade</Text>

      <Text style={styles.description}>
        Conte sobre o propósito das suas missões e adicione uma foto da sua equipe, logo para que sua base seja reconhecida na galáxia.
      </Text>

      <TouchableOpacity style={styles.imageContainer} onPress={escolherFoto}>
        {imagemUri? (
          <Image source={{ uri: imagemUri }} style={styles.fotoEscolhida} />
        ) : (
          <Image source={require('../assets/images/camera.png')} style={styles.cameraIcon}/>
        )}
      </TouchableOpacity>
      <Text style={styles.fotoHint}>Toque para adicionar foto</Text>

      <TextInput
        style={styles.textArea}
        placeholder="Fale sobre a ONG"
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