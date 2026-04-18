import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { supabase } from '../lib/supabase';
import { useAppAlerts } from '../utils/alert';

export default function NovoPost() {
  const router = useRouter();
  const { mostrarOpcoesFoto } = useAppAlerts();

  const [legenda, setLegenda] = useState('');
  const [imagem, setImagem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [expandLocal, setExpandLocal] = useState(false);
  const [expandMarcar, setExpandMarcar] = useState(false);
  const [expandAlt, setExpandAlt] = useState(false);

  const [localizacao, setLocalizacao] = useState('');
  const [textoAlt, setTextoAlt] = useState('');
  const [pessoasMarcadas, setPessoasMarcadas] = useState<string[]>([]);
  const [inputMencao, setInputMencao] = useState('');

  async function abrirCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status!== 'granted') {
      Toast.show({ type: 'error', text1: 'Permissão negada', text2: 'Precisamos de acesso à câmera' });
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) setImagem(result.assets[0].uri);
  }

  async function abrirGaleria() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) setImagem(result.assets[0].uri);
  }

  async function escolherImagem() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status!== 'granted') {
      Toast.show({ type: 'error', text1: 'Permissão negada', text2: 'Precisamos de acesso à galeria' });
      return;
    }
    mostrarOpcoesFoto(abrirCamera, abrirGaleria);
  }

  const pegarLocalizacao = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status!== 'granted') {
      Toast.show({ type: 'error', text1: 'Permissão negada', text2: 'Precisa liberar acesso à localização' });
      return;
    }
    try {
      let location = await Location.getCurrentPositionAsync({});
      let endereco = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (endereco[0]) {
        const { street, district, city } = endereco[0];
        setLocalizacao(`${street || ''}, ${district || ''} - ${city || ''}`);
        Toast.show({ type: 'success', text1: 'Localização capturada' });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Erro na localização' });
    }
  };

  const adicionarMencao = () => {
    if (inputMencao.trim() &&!pessoasMarcadas.includes(inputMencao)) {
      setPessoasMarcadas([...pessoasMarcadas, inputMencao.trim()]);
      setInputMencao('');
    }
  };

  const handlePublicar = async () => {
    if (!imagem) {
      Toast.show({ type: 'error', text1: 'Faltou a foto', text2: 'Adiciona uma imagem pra postar' });
      return;
    }
    if (!legenda.trim()) {
      Toast.show({ type: 'error', text1: 'Faltou legenda', text2: 'Escreve algo no post' });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Sessão expirada. Faça login novamente.');

      // UPSERT SÓ COM ID - CONSTRAINT FOI REMOVIDA
      const { error: profileError } = await supabase
.from('profiles')
.upsert({ id: user.id }, { onConflict: 'id' });
      if (profileError) throw profileError;

      // UPLOAD DA IMAGEM
      const fileExt = imagem.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const response = await fetch(imagem);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const { error: uploadError } = await supabase.storage
.from('posts')
.upload(fileName, arrayBuffer, {
  contentType: `image/${fileExt}`,
  upsert: true,
});
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('posts').getPublicUrl(fileName);
      const imageUrl = data.publicUrl;

      // INSERT NO POSTS
      const { error: dbError } = await supabase.from('posts').insert({
        user_id: user.id,
        legenda: legenda,
        imagem_url: imageUrl,
        localizacao: localizacao || null,
        pessoas_marcadas: pessoasMarcadas.length > 0? pessoasMarcadas : null,
        texto_alternativo: textoAlt || null,
      });
      if (dbError) throw dbError;

      Toast.show({
        type: 'success',
        text1: 'Post criado! 🚀',
        text2: 'Seu post foi publicado',
        visibilityTime: 2000,
      });

      setTimeout(() => router.back(), 1000);

    } catch (error: any) {
      console.log('ERRO:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao publicar',
        text2: error.message || 'Não foi possível criar o post',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <TouchableOpacity style={styles.backButtonContainer} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadCard} onPress={escolherImagem}>
          {imagem? (
            <Image source={{ uri: imagem }} style={styles.previewImage} />
          ) : (
            <>
              <Image source={require('../assets/images/camera.png')} style={{ width: 60, height: 60, tintColor: '#9E9EBE' }} />
              <Text style={styles.uploadText}>Adicionar imagem</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Adicionar legenda..."
            placeholderTextColor="#A0A0A0"
            style={styles.input}
            value={legenda}
            onChangeText={setLegenda}
            multiline
          />
        </View>

        <TouchableOpacity style={styles.optionRow} onPress={() => setExpandLocal(!expandLocal)}>
          <View style={styles.optionLeft}>
            <Image source={require('../assets/images/locali.png')} style={{ width: 22, height: 22 }} />
            <Text style={styles.optionLabel}>Adicionar localização</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#A0A0A0" style={[styles.seta, expandLocal && styles.setaRotacionada]} />
        </TouchableOpacity>

        {expandLocal && (
          <View style={styles.expandContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={pegarLocalizacao}>
              <Ionicons name="locate" size={20} color="#0D0062" />
              <Text style={styles.actionButtonText}>Usar localização atual</Text>
            </TouchableOpacity>

            <TextInput
              placeholder="Ou digite manualmente..."
              placeholderTextColor="#A0A0A0"
              style={styles.inputExpand}
              value={localizacao}
              onChangeText={setLocalizacao}
            />

            {localizacao? (
              <View style={styles.tagContainer}>
                <Ionicons name="location" size={16} color="#0D0062" />
                <Text style={styles.tagText}>{localizacao}</Text>
                <TouchableOpacity onPress={() => setLocalizacao('')}>
                  <Ionicons name="close-circle" size={18} color="#A0A0A0" />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}

        <TouchableOpacity style={styles.optionRow} onPress={() => setExpandMarcar(!expandMarcar)}>
          <View style={styles.optionLeft}>
            <Image source={require('../assets/images/marcar.png')} style={{ width: 22, height: 22 }} />
            <Text style={styles.optionLabel}>Marcar pessoas / instituições</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#A0A0A0" style={[styles.seta, expandMarcar && styles.setaRotacionada]} />
        </TouchableOpacity>

        {expandMarcar && (
          <View style={styles.expandContainer}>
            <View style={styles.mencaoInputRow}>
              <TextInput
                placeholder="Digite @usuario ou nome..."
                placeholderTextColor="#A0A0A0"
                style={styles.inputExpand}
                value={inputMencao}
                onChangeText={setInputMencao}
              />
              <TouchableOpacity style={styles.addMencaoBtn} onPress={adicionarMencao}>
                <Ionicons name="add" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            {pessoasMarcadas.length > 0 && (
              <View style={styles.mencoesList}>
                {pessoasMarcadas.map((pessoa, index) => (
                  <View key={index} style={styles.tagContainer}>
                    <Text style={styles.tagText}>@{pessoa}</Text>
                    <TouchableOpacity onPress={() => setPessoasMarcadas(pessoasMarcadas.filter(p => p!== pessoa))}>
                      <Ionicons name="close-circle" size={18} color="#A0A0A0" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.infoText}>
              Amigos aparecem primeiro. Pode marcar qualquer pessoa com @
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.optionRow} onPress={() => setExpandAlt(!expandAlt)}>
          <View style={styles.optionLeft}>
            <Image source={require('../assets/images/textoalt.png')} style={{ width: 22, height: 22 }} />
            <Text style={styles.optionLabel}>Escrever texto alternativo</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#A0A0A0" style={[styles.seta, expandAlt && styles.setaRotacionada]} />
        </TouchableOpacity>

        {expandAlt && (
          <View style={styles.expandContainer}>
            <Text style={styles.descriptionText}>
              Descreva a imagem para pessoas com deficiência visual. Isso ativa leitura automática no TalkBack/VoiceOver.
            </Text>
            <TextInput
              placeholder="Ex: Um gato laranja dormindo em uma calçada..."
              placeholderTextColor="#A0A0A0"
              style={[styles.inputExpand, { height: 80, textAlignVertical: 'top' }]}
              value={textoAlt}
              onChangeText={setTextoAlt}
              multiline
            />
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.publishButton, loading && styles.publishButtonDisabled]}
            onPress={handlePublicar}
            disabled={loading}
          >
            {loading? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.publishButtonText}>Publicar</Text>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  backButtonContainer: { marginBottom: 20, alignSelf: 'flex-start' },
  uploadCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
    overflow: 'hidden',
  },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  uploadText: { marginTop: 8, color: '#9E9EBE', fontSize: 14, fontFamily: 'IstokWeb-Regular' },
  inputContainer: { marginBottom: 20 },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 15,
    minHeight: 50,
    textAlignVertical: 'top',
    fontFamily: 'IstokWeb-Regular',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  optionLabel: { fontSize: 15, color: '#000000', fontFamily: 'IstokWeb-Regular' },
  seta: { transform: [{ rotate: '0deg' }] },
  setaRotacionada: { transform: [{ rotate: '90deg' }] },
  expandContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8E5FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  actionButtonText: { color: '#0D0062', fontSize: 14, fontFamily: 'IstokWeb-Regular' },
  inputExpand: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 14,
    fontFamily: 'IstokWeb-Regular',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E5FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  tagText: { color: '#0D0062', fontSize: 13, fontFamily: 'IstokWeb-Regular' },
  mencaoInputRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  addMencaoBtn: {
    backgroundColor: '#0D0062',
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mencoesList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  infoText: { fontSize: 11, color: '#A0A0A0', fontFamily: 'IstokWeb-Regular', marginTop: 4 },
  descriptionText: { fontSize: 12, color: '#666', marginBottom: 8, lineHeight: 16, fontFamily: 'IstokWeb-Regular' },
  footer: { paddingVertical: 30 },
  publishButton: {
    backgroundColor: '#0D0062',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  publishButtonDisabled: { opacity: 0.6 },
  publishButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', fontFamily: 'IstokWeb-Regular' },
});