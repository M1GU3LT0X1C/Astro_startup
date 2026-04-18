import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { supabase } from '../lib/supabase';

export default function Comentarios() {
  const router = useRouter();
  const { postId } = useLocalSearchParams();
  const [comments, setComments] = useState<any[]>([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    carregarUsuario();
    carregarComentarios();
  }, []);

  async function carregarUsuario() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
  }

  async function carregarComentarios() {
    setLoading(true);
    
    const { data: commentsData, error: commentsError } = await supabase
    .from('post_comments')
    .select('id, content, created_at, user_id')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

    if (commentsError) {
      console.log('ERRO BUSCAR COMENTÁRIOS:', commentsError);
      Toast.show({ type: 'error', text1: 'Erro ao carregar' });
      setLoading(false);
      return;
    }

    if (!commentsData || commentsData.length === 0) {
      setComments([]);
      setLoading(false);
      return;
    }

    const userIds = [...new Set(commentsData.map(c => c.user_id))];
    
    const { data: profilesData } = await supabase
    .from('profiles')
    .select('id, nome_completo, avatar_url')
    .in('id', userIds);

    const commentsCompletos = commentsData.map(comment => ({
      ...comment,
      profiles: profilesData?.find(p => p.id === comment.user_id) || {
        nome_completo: 'Usuário',
        avatar_url: null
      }
    }));

    console.log('COMENTÁRIOS CARREGADOS:', commentsCompletos.length);
    setComments(commentsCompletos);
    setLoading(false);
  }

  async function enviarComentario() {
    if (!novoComentario.trim() || !userId) {
      console.log('SEM TEXTO OU USER:', { novoComentario, userId });
      return;
    }

    const { error } = await supabase
    .from('post_comments')
    .insert({
      post_id: postId as string,
      user_id: userId,
      content: novoComentario.trim(),
    });

    if (error) {
      console.log('ERRO AO COMENTAR:', error);
      Toast.show({ type: 'error', text1: error.message });
      return;
    }

    setNovoComentario('');
    carregarComentarios(); // Recarrega a lista
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFCFD' }}>
      <View style={{ flexDirection: 'row', padding: 15, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E5E5' }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, marginLeft: 15 }}>Comentários</Text>
      </View>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', padding: 15, gap: 10 }}>
            <Image
              source={
                item.profiles?.avatar_url
                ? { uri: item.profiles.avatar_url }
                : require('../assets/images/gabriela.png')
              }
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '600' }}>
                @{item.profiles?.nome_completo?.toLowerCase().replace(/\s/g, '')}
              </Text>
              <Text>{item.content}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 100 }}>Nenhum comentário</Text>
        }
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={{ flexDirection: 'row', padding: 15, borderTopWidth: 1, borderTopColor: '#E5E5E5', gap: 10 }}>
          <TextInput
            style={{ flex: 1, backgroundColor: '#F5F5F5', borderRadius: 20, padding: 10 }}
            placeholder="Adicione um comentário..."
            value={novoComentario}
            onChangeText={setNovoComentario}
          />
          <TouchableOpacity
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#0D0062', justifyContent: 'center', alignItems: 'center' }}
            onPress={enviarComentario}
          >
            <Ionicons name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}