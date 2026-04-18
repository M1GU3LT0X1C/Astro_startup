import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

export default function DetalheAstro() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [astro, setAstro] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAstro();
  }, [id]);

  async function carregarAstro() {
    const { data } = await supabase
 .from('astros')
 .select('*')
 .eq('id', id)
 .single();

    if (data) setAstro(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0D0062" />
      </SafeAreaView>
    );
  }

  if (!astro) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text>Astro não encontrado</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>

        <Image source={{ uri: astro.imagem_url }} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.nome}>{astro.nome}</Text>
          <Text style={styles.info}>{astro.raca} • {astro.porte}</Text>
          <Text style={styles.info}>{astro.sexo} • {astro.especie}</Text>

          {astro.personalidade && astro.personalidade.length > 0 && (
            <View style={styles.tagsContainer}>
              {astro.personalidade.map((item: string) => (
                <View key={item} style={styles.tag}>
                  <Text style={styles.tagText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {astro.descricao && (
            <Text style={styles.descricao}>{astro.descricao}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  center: { justifyContent: 'center', alignItems: 'center' },
  back: { padding: 20 },
  backText: { fontSize: 16, color: '#0D0062', fontWeight: '600' },
  image: { width: '100%', height: 300 },
  content: { padding: 20 },
  nome: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  info: { fontSize: 16, color: '#666', marginBottom: 5 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 15 },
  tag: { backgroundColor: '#E8E5FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  tagText: { color: '#0D0062', fontSize: 12 },
  descricao: { fontSize: 16, color: '#444', marginTop: 20, lineHeight: 24 },
  link: { color: '#0D0062', marginTop: 10, fontSize: 16 },
});