import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

type Profile = {
  nome_completo: string;
  avatar_url: string | null;
  tipo_usuario: string;
}

type Post = {
  id: string;
  legenda: string;
  imagem_url: string;
  texto_alternativo: string | null;
  localizacao: string | null;
  pessoas_marcadas: string[] | null;
  created_at: string;
  user_id: string;
  profiles: Profile[];
}

export default function PostDetalhe() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    carregarPost();
  }, [id]);

  async function carregarPost() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);

      const { data, error } = await supabase
   .from('posts')
   .select(`
          id,
          legenda,
          imagem_url,
          texto_alternativo,
          localizacao,
          pessoas_marcadas,
          created_at,
          user_id,
          profiles!inner(
            nome_completo,
            avatar_url,
            tipo_usuario
          )
        `)
   .eq('id', id)
   .single();

      if (error) throw error;

      // Garante que profiles sempre seja array
      const postFormatado = {
    ...data,
        profiles: Array.isArray(data.profiles)? data.profiles : [data.profiles]
      };

      setPost(postFormatado as Post);

      if (user && data) {
        // Verifica like
        const { data: meuLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', data.id)
      .eq('user_id', user.id)
      .single();

        setLiked(!!meuLike);

        // Conta likes
        const { count: likes } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', data.id);

        setLikeCount(likes || 0);

        // Conta comentários
        const { count: comments } = await supabase
      .from('post_comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', data.id);

        setCommentCount(comments || 0);

        // Verifica favorito
        const { data: meuFavorito } = await supabase
      .from('astros_favoritos')
      .select('id')
      .eq('user_id', user.id)
      .eq('astro_id', data.id)
      .single();

        setFavorited(!!meuFavorito);
      }

    } catch (error) {
      console.log('ERRO:', error);
      Toast.show({ type: 'error', text1: 'Erro ao carregar post' });
    } finally {
      setLoading(false);
    }
  }

  async function toggleLike() {
    if (!userId ||!post) return;

    if (liked) {
      await supabase
    .from('post_likes')
    .delete()
    .eq('post_id', post.id)
    .eq('user_id', userId);

      setLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      await supabase
    .from('post_likes')
    .insert({ post_id: post.id, user_id: userId });

      setLiked(true);
      setLikeCount(likeCount + 1);
    }
  }

  async function toggleFavorito() {
    if (!userId ||!post) return;

    if (favorited) {
      await supabase
    .from('astros_favoritos')
    .delete()
    .eq('user_id', userId)
    .eq('astro_id', post.id);

      setFavorited(false);
      Toast.show({ type: 'info', text1: 'Removido dos favoritos' });
    } else {
      await supabase
    .from('astros_favoritos')
    .insert({ user_id: userId, astro_id: post.id });

      setFavorited(true);
      Toast.show({ type: 'success', text1: 'Adicionado aos favoritos! ⭐' });
    }
  }

  async function compartilhar() {
    if (!post) return;
    try {
      await Share.share({
        message: `Olha esse Astro no Astro! ${post.legenda}`,
        url: post.imagem_url,
      });
    } catch (error) {
      console.log('ERRO SHARE:', error);
    }
  }

  function renderLegenda(texto: string) {
    const parts = texto.split(/(@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <Text key={index} style={styles.mention}>
            {part}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Post não encontrado</Text>
      </SafeAreaView>
    );
  }

  const autor = post.profiles?.[0];
  const nomeAutor = autor?.nome_completo.toLowerCase().replace(/\s/g, '') || '';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Post</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        <View style={styles.postHeader}>
          <Image
            source={autor?.avatar_url
           ? { uri: autor.avatar_url }
              : require('../assets/images/gabriela.png')}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{autor?.nome_completo || 'Usuário'}</Text>
            <Text style={styles.role}>{autor?.tipo_usuario || ''}</Text>
          </View>
        </View>

        <Image
          source={{ uri: post.imagem_url }}
          style={styles.image}
          accessibilityLabel={post.texto_alternativo || undefined}
        />

        <View style={styles.actions}>
          <TouchableOpacity onPress={toggleLike} style={styles.actionBtn}>
            <Ionicons
              name={liked? "heart" : "heart-outline"}
              size={28}
              color={liked? "#FF0000" : "#1A1A1A"}
            />
            <Text style={styles.actionText}>{likeCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push(`/comentarios?postId=${post.id}` as any)}
            style={styles.actionBtn}
          >
            <Ionicons name="chatbubble-outline" size={26} color="#1A1A1A" />
            <Text style={styles.actionText}>{commentCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={compartilhar} style={styles.actionBtn}>
            <Ionicons name="paper-plane-outline" size={26} color="#1A1A1A" />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleFavorito} style={styles.actionBtn}>
            <Ionicons
              name={favorited? "star" : "star-outline"}
              size={26}
              color={favorited? "#FFD700" : "#1A1A1A"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.captionContainer}>
          <Text style={styles.captionAuthor}>@{nomeAutor}</Text>
          <Text style={styles.captionText}>
            {' '}{renderLegenda(post.legenda)}
          </Text>
        </View>

        {post.localizacao && (
          <View style={styles.infoRow}>
            <Ionicons name="location" size={14} color="#777" />
            <Text style={styles.infoText}>{post.localizacao}</Text>
          </View>
        )}

        {post.pessoas_marcadas && post.pessoas_marcadas.length > 0 && (
          <View style={styles.infoRow}>
            <Ionicons name="people" size={14} color="#777" />
            <Text style={styles.infoText}>
              {post.pessoas_marcadas.map(p => `@${p}`).join(' ')}
            </Text>
          </View>
        )}
      </ScrollView>
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
  title: { fontSize: 16, fontWeight: '600' },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 10,
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  userInfo: { flex: 1 },
  name: { fontSize: 14, fontWeight: '600' },
  role: { fontSize: 12, color: '#777', marginTop: 2 },
  image: { width: width, height: 400 },
  actions: { flexDirection: 'row', gap: 15, padding: 15 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { fontSize: 14, color: '#1A1A1A' },
  captionContainer: { paddingHorizontal: 15, flexDirection: 'row', flexWrap: 'wrap' },
  captionAuthor: { fontSize: 14, fontWeight: 'bold' },
  captionText: { fontSize: 14 },
  mention: { color: '#E91E63', fontWeight: '600' },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 15,
    marginTop: 8
  },
  infoText: { fontSize: 12, color: '#777' },
});