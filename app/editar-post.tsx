import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { supabase } from '../lib/supabase';

export default function EditarPost() {
  const router = useRouter();
  const { postId } = useLocalSearchParams();
  const [legenda, setLegenda] = useState('');
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarPost();
  }, []);

  async function carregarPost() {
    const { data, error } = await supabase
    .from('posts')
    .select('legenda')
    .eq('id', postId)
    .single();
    
    if (error) {
      Toast.show({ type: 'error', text1: 'Erro ao carregar post' });
      router.back();
    } else {
      setLegenda(data.legenda || '');
    }
    setLoading(false);
  }

  async function salvarEdicao() {
    if (!legenda.trim()) {
      Toast.show({ type: 'error', text1: 'Legenda não pode ficar vazia' });
      return;
    }

    setSalvando(true);
    const { error } = await supabase
    .from('posts')
    .update({ legenda: legenda.trim() })
    .eq('id', postId);

    if (error) {
      Toast.show({ type: 'error', text1: 'Erro ao salvar', text2: error.message });
    } else {
      Toast.show({ type: 'success', text1: 'Post atualizado!' });
      router.back();
    }
    setSalvando(false);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelar}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Editar Post</Text>
        <TouchableOpacity onPress={salvarEdicao} disabled={salvando}>
          {salvando ? (
            <ActivityIndicator color="#0D0062" />
          ) : (
            <Text style={styles.salvar}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        multiline
        value={legenda}
        onChangeText={setLegenda}
        placeholder="Edite sua legenda..."
        style={styles.input}
        autoFocus
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  cancelar: { fontSize: 16, color: '#000' },
  titulo: { fontSize: 18, fontWeight: '600' },
  salvar: { fontSize: 16, fontWeight: '600', color: '#0D0062' },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 15,
    textAlignVertical: 'top',
  },
});