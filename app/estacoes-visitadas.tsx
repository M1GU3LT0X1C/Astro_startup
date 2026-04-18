import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

type Estacao = {
  id: string;
  nome_completo: string;
  avatar_url: string | null;
  tipo_usuario: string;
  cidade: string | null;
  bairro: string | null;
};

export default function EstacoesVisitadas() {
  const router = useRouter();
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEstacoes();
  }, []);

  async function carregarEstacoes() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
     .from('estacoes_visitadas')
     .select(`
        id,
        profiles!estacoes_visitadas_estacao_id_fkey(
          id,
          nome_completo,
          avatar_url,
          tipo_usuario,
          cidade,
          bairro
        )
      `)
     .eq('user_id', user.id)
     .order('created_at', { ascending: false });

    if (data) {
      setEstacoes(data.map(e => e.profiles?.[0]).filter(Boolean) as Estacao[]);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Estações Visitadas</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={estacoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => router.push(`/perfil-base?id=${item.id}` as any)}
          >
            <Image
              source={item.avatar_url? { uri: item.avatar_url } : require('../assets/images/gabriela.png')}
              style={styles.avatar}
            />
            <View style={styles.info}>
              <Text style={styles.nome}>{item.nome_completo}</Text>
              <Text style={styles.tipo}>{item.tipo_usuario}</Text>
              <Text style={styles.local}>
                {item.cidade || 'Cidade'} - {item.bairro || 'Bairro'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhuma estação visitada ainda</Text>
            <Text style={styles.emptySub}>Visite uma Base Estelar pra registrar aqui</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  titulo: { fontSize: 16, fontWeight: '600' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  info: { flex: 1 },
  nome: { fontSize: 14, fontWeight: '600' },
  tipo: { fontSize: 12, color: '#777', marginTop: 2 },
  local: { fontSize: 11, color: '#999', marginTop: 2 },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 14, color: '#777' },
  emptySub: { fontSize: 12, color: '#999', marginTop: 5 },
});