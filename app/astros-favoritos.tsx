import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

type Astro = {
  id: string;
  legenda: string;
  imagem_url: string;
  created_at: string;
};

export default function AstrosFavoritos() {
  const router = useRouter();
  const [astros, setAstros] = useState<Astro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  async function carregarFavoritos() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: favoritos } = await supabase
     .from('astros_favoritos')
     .select('astro_id')
     .eq('user_id', user.id)
     .order('created_at', { ascending: false });

    if (favoritos && favoritos.length > 0) {
      const ids = favoritos.map(f => f.astro_id);
      
      const { data: posts } = await supabase
       .from('posts')
       .select('id, legenda, imagem_url, created_at')
       .in('id', ids)
       .order('created_at', { ascending: false });
        
      setAstros(posts || []);
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
        <Text style={styles.titulo}>Astros Favoritados</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={astros}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/post-detalhe?id=${item.id}` as any)}
          >
            <Image source={{ uri: item.imagem_url }} style={styles.imagem} />
            <Text style={styles.legenda} numberOfLines={2}>{item.legenda}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhum astro favoritado</Text>
            <Text style={styles.emptySub}>Curta um post pra salvar aqui</Text>
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
  grid: { padding: 10 },
  card: {
    width: (width - 30) / 2,
    margin: 5,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagem: { width: '100%', height: 150 },
  legenda: { padding: 10, fontSize: 12 },
  empty: { alignItems: 'center', marginTop: 100, width: width - 40 },
  emptyText: { fontSize: 14, color: '#777' },
  emptySub: { fontSize: 12, color: '#999', marginTop: 5 },
});