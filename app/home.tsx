import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Pressable,
  RefreshControl,
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

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 360;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

type Profile = {
  id: string;
  nome_completo: string;
  avatar_url: string | null;
  tipo_usuario: string;
  cep: string;
  cidade?: string;
  bairro?: string;
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
  profiles: {
    nome_completo: string;
    avatar_url: string | null;
    tipo_usuario: string;
  }
}

type PostInteractions = {
  liked: boolean;
  likeCount: number;
  commentCount: number;
  favorited: boolean;
}

export default function Home() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postInteractions, setPostInteractions] = useState<Record<string, PostInteractions>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [localizacao, setLocalizacao] = useState('Carregando...');
  const [hasNotification, setHasNotification] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [modalOpcoes, setModalOpcoes] = useState<Post | null>(null);

  useEffect(() => {
    loadData();
    getLocation();
    checkNotifications();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        loadPosts(userId);
      }
    }, [userId])
  );

  async function getLocation() {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status!== 'granted') {
        setLocalizacao('Localização desativada');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let [endereco] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (endereco) {
        const cidade = endereco.city || endereco.subregion || 'Cidade';
        const bairro = endereco.district || endereco.street || 'Bairro';
        setLocalizacao(`${cidade} - ${bairro}`);
      }
    } catch (error) {
      setLocalizacao('Erro ao buscar localização');
    }
  }

  async function checkNotifications() {
    const { data } = await supabase
.from('notificacoes')
.select('id')
.eq('lida', false)
.limit(1);

    setHasNotification((data?.length || 0) > 0);
  }

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login' as any);
        return;
      }

      setUserId(user.id);

      const { data: profileData, error: profileError } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();

      if (profileError) {
        Toast.show({ type: 'error', text1: 'Erro ao carregar perfil' });
        return;
      }

      setProfile(profileData as Profile);
      await loadPosts(user.id);

    } catch (error) {
      Toast.show({ type: 'error', text1: 'Algo deu errado ao carregar' });
    } finally {
      setLoading(false);
    }
  }

  async function loadPosts(currentUserId: string) {
    const { data: postsData, error } = await supabase
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
        profiles!posts_user_id_fkey (
          nome_completo,
          avatar_url,
          tipo_usuario
        )
      `)
.order('created_at', { ascending: false })
.limit(30)
.returns<Post[]>();

    if (error) {
      Toast.show({ type: 'error', text1: 'Erro ao carregar feed' });
    } else {
      const postsList = postsData?? [];
      setPosts(postsList);
      await carregarInteracoes(postsList, currentUserId);
    }
  }

  async function carregarInteracoes(postsList: Post[], currentUserId: string) {
    const interactions: Record<string, PostInteractions> = {};

    for (const post of postsList) {
      const { data: meuLike } = await supabase
  .from('post_likes')
  .select('id')
  .eq('post_id', post.id)
  .eq('user_id', currentUserId)
  .single();

      const { data: meuFavorito } = await supabase
  .from('astros_favoritos')
  .select('id')
  .eq('user_id', currentUserId)
  .eq('astro_id', post.id)
  .single();

      const { count: likes } = await supabase
  .from('post_likes')
  .select('*', { count: 'exact', head: true })
  .eq('post_id', post.id);

      const { count: comments } = await supabase
  .from('post_comments')
  .select('*', { count: 'exact', head: true })
  .eq('post_id', post.id);

      interactions[post.id] = {
        liked:!!meuLike,
        likeCount: likes || 0,
        commentCount: comments || 0,
        favorited:!!meuFavorito,
      };
    }

    setPostInteractions(interactions);
  }

  const onRefresh = async () => {
    setRefreshing(true);
    if (userId) await loadPosts(userId);
    await checkNotifications();
    await getLocation();
    setRefreshing(false);
  };

  async function toggleLike(postId: string) {
    if (!userId) return;

    const current = postInteractions[postId];
    if (!current) return;

    if (current.liked) {
      await supabase
  .from('post_likes')
  .delete()
  .eq('post_id', postId)
  .eq('user_id', userId);

      setPostInteractions({
  ...postInteractions,
        [postId]: {
    ...current,
          liked: false,
          likeCount: current.likeCount - 1,
        }
      });
    } else {
      await supabase
  .from('post_likes')
  .insert({ post_id: postId, user_id: userId });

      setPostInteractions({
  ...postInteractions,
        [postId]: {
    ...current,
          liked: true,
          likeCount: current.likeCount + 1,
        }
      });
    }
  }

  async function toggleFavorito(postId: string) {
    if (!userId) return;

    const current = postInteractions[postId];
    if (!current) return;

    if (current.favorited) {
      await supabase
  .from('astros_favoritos')
  .delete()
  .eq('user_id', userId)
  .eq('astro_id', postId);

      setPostInteractions({
  ...postInteractions,
        [postId]: {...current, favorited: false }
      });
      Toast.show({ type: 'info', text1: 'Removido dos favoritos' });
    } else {
      await supabase
  .from('astros_favoritos')
  .insert({ user_id: userId, astro_id: postId });

      setPostInteractions({
  ...postInteractions,
        [postId]: {...current, favorited: true }
      });
      Toast.show({ type: 'success', text1: 'Adicionado aos favoritos! ⭐' });
    }
  }

  async function compartilhar(post: Post) {
    try {
      await Share.share({
        message: `Olha esse Astro no Astro! ${post.legenda}`,
        url: post.imagem_url,
      });
    } catch (error) {
      console.log('ERRO SHARE:', error);
    }
  }

  async function deletarPost(postId: string) {
    const { error } = await supabase
.from('posts')
.delete()
.eq('id', postId);

    if (error) {
      Toast.show({ type: 'error', text1: 'Erro ao deletar', text2: error.message });
    } else {
      Toast.show({ type: 'success', text1: 'Post deletado' });
      setModalOpcoes(null);
      if (userId) await loadPosts(userId);
    }
  }

  function editarPost(postId: string) {
    setModalOpcoes(null);
    router.push(`/novo-post?postId=${postId}` as any);
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

  // BARRA DE CIMA: SEMPRE POSTAR
  function handleTopPress() {
    router.push('/novo-post' as any);
  }

  // BOTÃO + DE BAIXO: SÓ GUARDIÃO E BASE CRIAM ASTRO
  function handleBottomPlus() {
    if (!profile) return;

    const tipo = profile.tipo_usuario.toLowerCase().trim();

    if (tipo.includes('guardiao') || tipo.includes('guardião') || tipo.includes('estacao') || tipo.includes('base')) {
      router.push('/criar-astro' as any);
    } else {
      router.push('/novo-post' as any);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const tipo = profile?.tipo_usuario.toLowerCase().trim() || '';
  const isBase = tipo.includes('estacao') || tipo.includes('base');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.locationContainer} onPress={getLocation}>
          <Image source={require('../assets/images/local.png')} style={styles.iconSmall} />
          <View>
            <Text style={styles.location}>{localizacao}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/notificacoes' as any)}>
          <Image
            source={hasNotification
             ? require('../assets/images/not.png')
              : require('../assets/images/sino.png')
            }
            style={styles.iconSmall}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.postBox}
        onPress={handleTopPress}
      >
        <View>
          <Image
            source={profile?.avatar_url? { uri: profile.avatar_url } : require('../assets/images/gabriela.png')}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.postPlaceholder}>Poste algo...</Text>
        <Image source={require('../assets/images/galeria.png')} style={styles.iconMedium} />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {posts.length === 0? (
          <View style={styles.emptyFeed}>
            <Text style={styles.emptyText}>Nenhum post ainda</Text>
            <Text style={styles.emptySubtext}>Puxe pra baixo pra atualizar</Text>
          </View>
        ) : (
          posts.map((post) => {
            const interactions = postInteractions[post.id] || { liked: false, likeCount: 0, commentCount: 0, favorited: false };
            const nomeAutor = post.profiles.nome_completo.toLowerCase().replace(/\s/g, '');

            return (
              <View style={styles.post} key={post.id}>
                <View style={styles.postHeader}>
                  <Image
                    source={post.profiles.avatar_url
                ? { uri: post.profiles.avatar_url }
                      : require('../assets/images/gabriela.png')
                    }
                    style={styles.avatar}
                  />
                  <View style={styles.postUserInfo}>
                    <Text style={styles.name} numberOfLines={1}>
                      {post.profiles.nome_completo}
                    </Text>
                    <Text style={styles.role}>
                      {post.profiles.tipo_usuario}
                    </Text>
                  </View>

                  {userId === post.user_id && (
                    <TouchableOpacity onPress={() => setModalOpcoes(post)}>
                      <Ionicons name="ellipsis-horizontal" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity onPress={() => setModalImage(post.imagem_url)}>
                  <Image
                    source={{ uri: post.imagem_url }}
                    style={styles.postImage}
                    accessibilityLabel={post.texto_alternativo || undefined}
                  />
                </TouchableOpacity>

                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => toggleLike(post.id)} style={styles.actionBtn}>
                    <Ionicons
                      name={interactions.liked? "heart" : "heart-outline"}
                      size={28}
                      color={interactions.liked? "#FF0000" : "#1A1A1A"}
                    />
                    <Text style={styles.actionText}>{interactions.likeCount}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => router.push(`/comentarios?postId=${post.id}` as any)} style={styles.actionBtn}>
                    <Ionicons name="chatbubble-outline" size={26} color="#1A1A1A" />
                    <Text style={styles.actionText}>{interactions.commentCount}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => compartilhar(post)} style={styles.actionBtn}>
                    <Ionicons name="paper-plane-outline" size={26} color="#1A1A1A" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => toggleFavorito(post.id)} style={styles.actionBtn}>
                    <Ionicons
                      name={interactions.favorited? "star" : "star-outline"}
                      size={26}
                      color={interactions.favorited? "#FFD700" : "#1A1A1A"}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.captionContainer}>
                  <Text style={styles.captionAuthor}>
                    @{nomeAutor}
                  </Text>
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
              </View>
            );
          })
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => router.push('/home' as any)}>
          <Image source={require('../assets/images/info.png')} style={styles.navIcon} />
        </TouchableOpacity>

        {/* PATINHA SEMPRE APARECE E VAI PRO MATCH */}
        <TouchableOpacity onPress={() => router.push('/match' as any)}>
          <Image source={require('../assets/images/pata.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleBottomPlus}
        >
          <Image source={require('../assets/images/add.png')} style={styles.addIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/chat-base' as any)}>
          <Image source={require('../assets/images/chat.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/perfil' as any)}>
          <Image source={require('../assets/images/perfil.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>

      <Modal visible={!!modalImage} transparent animationType="fade">
        <Pressable style={styles.modalContainer} onPress={() => setModalImage(null)}>
          <Image source={{ uri: modalImage! }} style={styles.modalImage} resizeMode="contain" />
        </Pressable>
      </Modal>

      <Modal visible={!!modalOpcoes} transparent animationType="fade" onRequestClose={() => setModalOpcoes(null)}>
        <Pressable
          style={styles.modalOpcoesContainer}
          onPress={() => setModalOpcoes(null)}
        >
          <View style={styles.modalOpcoesContent}>
            <TouchableOpacity
              style={styles.opcaoBtn}
              onPress={() => editarPost(modalOpcoes!.id)}
            >
              <Text style={styles.opcaoTexto}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.opcaoBtn, styles.opcaoBtnBorder]}
              onPress={() => deletarPost(modalOpcoes!.id)}
            >
              <Text style={[styles.opcaoTexto, { color: '#FF3B30' }]}>Deletar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.opcaoBtn, styles.opcaoCancelar]}
              onPress={() => setModalOpcoes(null)}
            >
              <Text style={[styles.opcaoTexto, { fontWeight: '600' }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFCFD' },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    marginBottom: scale(15),
    paddingTop: scale(10),
  },
  locationContainer: { flexDirection: 'row', alignItems: 'center', gap: scale(10) },
  location: { fontSize: scale(14), fontFamily: 'IstokWeb-Regular' },
  postBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDEDED',
    marginHorizontal: scale(20),
    borderRadius: scale(20),
    padding: scale(10),
    marginBottom: scale(15),
  },
  postPlaceholder: {
    flex: 1,
    marginLeft: scale(10),
    color: '#777',
    fontFamily: 'IstokWeb-Regular',
  },
  post: { marginBottom: scale(20) },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    marginBottom: scale(10),
    gap: scale(10),
  },
  postUserInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: scale(13),
    fontFamily: 'IstokWeb-Regular',
    fontWeight: '600',
    color: '#000'
  },
  role: {
    fontSize: scale(11),
    color: '#777',
    fontFamily: 'IstokWeb-Regular',
    marginTop: 2,
  },
  postImage: { width: '100%', height: scale(300) },
  actions: { flexDirection: 'row', gap: scale(15), padding: scale(10) },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
  },
  actionText: {
    fontSize: scale(14),
    fontFamily: 'IstokWeb-Regular',
    color: '#1A1A1A',
  },
  captionContainer: {
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  captionAuthor: {
    fontSize: scale(12),
    fontFamily: 'IstokWeb-Regular',
    fontWeight: 'bold',
  },
  captionText: {
    fontSize: scale(12),
    fontFamily: 'IstokWeb-Regular',
  },
  mention: {
    color: '#E91E63',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: scale(20),
    marginTop: 5,
  },
  infoText: {
    fontSize: scale(12),
    color: '#777',
    fontFamily: 'IstokWeb-Regular',
  },
  bottomBar: {
    position: 'absolute',
    bottom: scale(20),
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: scale(10),
    borderRadius: scale(30),
    alignItems: 'center',
    gap: scale(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  navIcon: { width: scale(25), height: scale(25), resizeMode: 'contain' },
  addButton: { justifyContent: 'center', alignItems: 'center' },
  addIcon: { width: scale(40), height: scale(40), resizeMode: 'contain' },
  iconSmall: { width: scale(20), height: scale(20) },
  iconMedium: { width: scale(25), height: scale(25) },
  avatar: { width: scale(35), height: scale(35), borderRadius: scale(20) },
  emptyFeed: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: scale(100) },
  emptyText: { fontSize: scale(14), color: '#777', fontFamily: 'IstokWeb-Regular' },
  emptySubtext: { fontSize: scale(12), color: '#999', fontFamily: 'IstokWeb-Regular', marginTop: 5 },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: { width: width, height: height },
  modalOpcoesContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalOpcoesContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  opcaoBtn: {
    padding: 20,
  },
  opcaoBtnBorder: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  opcaoCancelar: {
    marginTop: 8,
    backgroundColor: '#F5F5F5',
  },
  opcaoTexto: {
    fontSize: 16,
    textAlign: 'center',
  },
});