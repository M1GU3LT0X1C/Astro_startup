import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 360;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

export default function RegistroBordo() {
  const router = useRouter();
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [caracteres, setCaracteres] = useState(0);

  useEffect(() => {
    carregarBio();
  }, []);

  async function carregarBio() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('bio')
      .eq('id', user.id)
      .single();

    if (data?.bio) {
      setBio(data.bio);
      setCaracteres(data.bio.length);
    }
  }

  async function salvar() {
    if (bio.trim().length < 10) {
      Toast.show({ type: 'error', text1: 'Escreva pelo menos 10 caracteres' });
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('profiles')
      .update({ bio: bio.trim() })
      .eq('id', user?.id);

    if (error) {
      Toast.show({ type: 'error', text1: 'Erro ao salvar' });
      console.log('Erro Supabase:', error);
    } else {
      Toast.show({ type: 'success', text1: 'Registro atualizado!' });
      router.back();
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelar}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.titulo}>Registro de Bordo</Text>
          <TouchableOpacity onPress={salvar} disabled={loading}>
            <Text style={[styles.salvar, loading && styles.desativado]}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>
            Comandante, o que você está buscando na galáxia hoje?
          </Text>
          
          <TextInput
            style={styles.input}
            multiline
            value={bio}
            onChangeText={(text) => {
              setBio(text);
              setCaracteres(text.length);
            }}
            placeholder="Ex: Procuro um companheiro felino para meu cachorro Thor. Preferência por filhote fêmea, pelagem clara..."
            placeholderTextColor="#999"
            maxLength={280}
            textAlignVertical="top"
          />

          <Text style={styles.contador}>
            {caracteres}/280
          </Text>

          <View style={styles.dicas}>
            <Text style={styles.dicaTitulo}>💡 Dicas:</Text>
            <Text style={styles.dicaTexto}>• Seja específico sobre o que procura</Text>
            <Text style={styles.dicaTexto}>• Mencione se tem outros pets</Text>
            <Text style={styles.dicaTexto}>• Fale sobre seu espaço (casa/apto)</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  cancelar: { fontSize: scale(16), color: '#777' },
  titulo: { fontSize: scale(16), fontWeight: '600' },
  salvar: { fontSize: scale(16), color: '#E91E63', fontWeight: '600' },
  desativado: { opacity: 0.5 },
  content: { flex: 1, padding: scale(20) },
  label: {
    fontSize: scale(14),
    color: '#333',
    marginBottom: scale(15),
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: scale(12),
    padding: scale(15),
    fontSize: scale(14),
    minHeight: scale(150),
    color: '#000',
  },
  contador: {
    textAlign: 'right',
    color: '#999',
    fontSize: scale(12),
    marginTop: scale(8),
  },
  dicas: {
    marginTop: scale(30),
    padding: scale(15),
    backgroundColor: '#FFF9E6',
    borderRadius: scale(12),
  },
  dicaTitulo: { fontSize: scale(13), fontWeight: '600', marginBottom: scale(8) },
  dicaTexto: { fontSize: scale(12), color: '#666', marginTop: scale(4) },
});