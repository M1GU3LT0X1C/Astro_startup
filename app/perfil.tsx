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
  bio: string | null;
  tipo_usuario: 'explorador' | 'base estelar' | 'guardião';
  cep: string;
  cidade?: string;
  bairro?: string;
  created_at: string;
}

type Post = {
  id: string;
  imagem_url: string;
  legenda: string;
  created_at: string;
}

type EstacaoVisitada = {
  id: string;
  nome: string;
  avatar_url: string | null;
}

type AstroFavorito = {
  id: string;
  nome: string;
  imagem_url: string;
}

export default function Perfil() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpcoes, setModalOpcoes] = useState<Post | null>(null);
  const [estacoesVisitadas, setEstacoesVisitadas] = useState<EstacaoVisitada[]>([]);
  const [astrosFavoritos, setAstrosFavoritos] = useState<AstroFavorito[]>([]);
  const [loadingEstacoes, setLoadingEstacoes] = useState(true);
  const [loadingAstros, setLoadingAstros] = useState(true);
  const [missoesCount, setMissoesCount] = useState(0);
  const [localizacaoAtual, setLocalizacaoAtual] = useState('Carregando...');
  const [bairroAtual, setBairroAtual] = useState('');
  const [modalImage, setModalImage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      carregarPerfil();
    }, [])
  );

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    async function iniciarLocalizacao() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status!== 'granted') {
        setLocalizacaoAtual('Localização negada');
        setBairroAtual('');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      atualizarEndereco(location.coords.latitude, location.coords.longitude);

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000,
          distanceInterval: 50,
        },
        (location) => {
          atualizarEndereco(location.coords.latitude, location.coords.longitude);
        }
      );
    }

    iniciarLocalizacao();
    return () => subscription?.remove();
  }, []);

  async function atualizarEndereco(lat: number, lng: number) {
    try {
      const [endereco] = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });

      if (endereco) {
        const cidade = endereco.city || endereco.subregion || 'Cidade';
        setLocalizacaoAtual(`${cidade} - PE`);
        setBairroAtual(endereco.district || endereco.street || '');
      }
    } catch (e) {
      console.log('Erro reverseGeocode:', e);
    }
  }

  async function carregarPerfil() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login' as any);
        return;
      }
      setUserId(user.id);

      const { data: profileData, error } = await supabase
       .from('profiles')
       .select('*')
       .eq('id', user.id)
       .single();

      if (error) throw error;
      setProfile(profileData as Profile);

      const { data: postsData } = await supabase
       .from('posts')
       .select('id, imagem_url, legenda, created_at')
       .eq('user_id', user.id)
       .order('created_at', { ascending: false });

      setPosts(postsData || []);

      // ESTAÇÕES DE APOIO VISTAS - FK ESPECÍFICA
      setLoadingEstacoes(true);
      const { data: estacoes, error: erroEstacoes } = await supabase
       .from('estacoes_visitadas')
       .select(`
          id,
          estacao_id,
          profiles!estacoes_visitadas_estacao_id_fkey(
            id,
            nome_completo,
            avatar_url
          )
        `)
       .eq('user_id', user.id)
       .order('created_at', { ascending: false })
       .limit(3);

      if (erroEstacoes) {
        console.log('Erro estações:', erroEstacoes);
        setEstacoesVisitadas([]);
      } else if (estacoes) {
        setEstacoesVisitadas(estacoes.map(e => {
          const perfil = Array.isArray(e.profiles)? e.profiles[0] : e.profiles;
          return {
            id: perfil?.id || e.estacao_id,
            nome: perfil?.nome_completo || '',
            avatar_url: perfil?.avatar_url || null
          };
        }).filter(e => e.id));
      }
      setLoadingEstacoes(false);

      // ASTROS FAVORITADOS
      setLoadingAstros(true);
      const { data: favoritos } = await supabase
       .from('astros_favoritos')
       .select('astro_id')
       .eq('user_id', user.id)
       .order('created_at', { ascending: false })
       .limit(3);

      if (favoritos && favoritos.length > 0) {
        const ids = favoritos.map(f => f.astro_id);

        const { data: postsData } = await supabase
         .from('posts')
         .select('id, legenda, imagem_url')
         .in('id', ids);

        setAstrosFavoritos((postsData || []).map(p => ({
          id: p.id,
          nome: p.legenda || '',
          imagem_url: p.imagem_url || ''
        })));
      } else {
        setAstrosFavoritos([]);
      }
      setLoadingAstros(false);

      const { count } = await supabase
       .from('missoes_concluidas')
       .select('*', { count: 'exact', head: true })
       .eq('user_id', user.id);

      setMissoesCount(count || 0);

    } catch (error) {
      console.log('Erro geral:', error);
      Toast.show({ type: 'error', text1: 'Erro ao carregar perfil' });
    } finally {
      setLoading(false);
    }
  }

  async function favoritarAstro(postId: string) {
    if (!userId) return;

    const { data: jaExiste } = await supabase
     .from('astros_favoritos')
     .select('id')
     .eq('user_id', userId)
     .eq('astro_id', postId)
     .single();

    if (jaExiste) {
      await supabase
       .from('astros_favoritos')
       .delete()
       .eq('user_id', userId)
       .eq('astro_id', postId);

      Toast.show({ type: 'info', text1: 'Removido dos favoritos' });
    } else {
      await supabase
       .from('astros_favoritos')
       .insert({ user_id: userId, astro_id: postId });

      Toast.show({ type: 'success', text1: 'Adicionado aos favoritos!' });
    }

    carregarPerfil();
  }

  async function marcarEstacaoVisitada(estacaoId: string) {
    if (!userId) return;

    const { data: jaExiste } = await supabase
     .from('estacoes_visitadas')
     .select('id')
     .eq('user_id', userId)
     .eq('estacao_id', estacaoId)
     .single();

    if (jaExiste) {
      await supabase
       .from('estacoes_visitadas')
       .delete()
       .eq('user_id', userId)
       .eq('estacao_id', estacaoId);

      Toast.show({ type: 'info', text1: 'Estação removida' });
    } else {
      await supabase
       .from('estacoes_visitadas')
       .insert({ user_id: userId, estacao_id: estacaoId });

      Toast.show({ type: 'success', text1: 'Estação marcada como visitada!' });
    }

    carregarPerfil();
  }

  async function deletarPost(postId: string) {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) {
      Toast.show({ type: 'error', text1: 'Erro ao deletar' });
    } else {
      Toast.show({ type: 'success', text1: 'Post deletado' });
      setModalOpcoes(null);
      carregarPerfil();
    }
  }

  function editarPost(postId: string) {
    setModalOpcoes(null);
    router.push(`/novo-post?postId=${postId}` as any);
  }

  async function sair() {
    setMenuVisible(false);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Toast.show({ type: 'error', text1: 'Erro ao sair', text2: error.message });
    } else {
      Toast.show({ type: 'success', text1: 'Saiu da conta' });
      router.replace('/' as any);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const isBase = profile?.tipo_usuario === 'base estelar';
  const isGuardiao = profile?.tipo_usuario === 'guardião';
  const isExplorador = profile?.tipo_usuario === 'explorador';

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={18} color="#FFF" />
          <View>
            <Text style={styles.locationText}>{localizacaoAtual}</Text>
            <Text style={styles.neighborhoodText}>{bairroAtual || profile?.bairro || 'Bairro'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(!menuVisible)}>
          <Image source={require('../assets/images/menu.png')} style={styles.menuIcon} />
        </TouchableOpacity>

        {menuVisible && (
          <View style={styles.popupMenu}>
            <TouchableOpacity style={styles.popupItem} onPress={() => {
              setMenuVisible(false);
              router.push('/editar-perfil' as any);
            }}>
              <Image source={require('../assets/images/conta.png')} style={styles.popupIcon} />
              <Text style={styles.popupText}>Conta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.popupItem} onPress={() => {
              setMenuVisible(false);
              Toast.show({ type: 'info', text1: 'Em breve!' });
            }}>
              <Image source={require('../assets/images/privacidade.png')} style={styles.securityIcon} />
              <Text style={styles.popupText}>Privacidade</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.popupItem} onPress={() => {
              setMenuVisible(false);
              Toast.show({ type: 'info', text1: 'Em breve!' });
            }}>
              <Image source={require('../assets/images/config.png')} style={styles.popupIcon} />
              <Text style={styles.popupText}>Configurações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.popupItem} onPress={() => {
              setMenuVisible(false);
              Toast.show({ type: 'info', text1: 'Fala com a gente no suporte' });
            }}>
              <Image source={require('../assets/images/ajuda.png')} style={styles.popupIcon} />
              <Text style={styles.popupText}>Ajuda</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.popupItem} onPress={sair}>
              <Image source={require('../assets/images/verificado.png')} style={styles.popupIcon} />
              <Text style={styles.popupText}>Sair</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.profileCenter}>
          <Image
            source={profile?.avatar_url? { uri: profile.avatar_url } : require('../assets/images/gabriela.png')}
            style={styles.profileImage}
          />

          <TouchableOpacity style={styles.cameraButton} onPress={() => router.push('/editar-perfil' as any)}>
            <Image source={require('../assets/images/explorador.png')} style={styles.cameraIcon} />
          </TouchableOpacity>

          <Text style={styles.profileName}>{profile?.nome_completo}</Text>
          <Text style={styles.profileRole}>{profile?.tipo_usuario}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/registro-bordo' as any)}
        >
          <View style={styles.itemLeft}>
            <Image source={require('../assets/images/registro.png')} style={styles.itemIcon} />
            <View>
              <Text style={styles.itemTitle}>Registros de bordo</Text>
              <Text style={styles.itemSubtitle} numberOfLines={2}>
                {profile?.bio || 'Adicione uma bio ao seu perfil'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/estacoes-visitadas' as any)}>
          <View style={styles.itemLeft}>
            <Image source={require('../assets/images/explorador.png')} style={styles.itemIcon} />
            <Text style={styles.itemTitle}>Estações de Apoio vistas</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        <View style={styles.avatarRow}>
          {loadingEstacoes? (
            <ActivityIndicator size="small" />
          ) : estacoesVisitadas.length > 0? (
            estacoesVisitadas.map(est => (
              <TouchableOpacity
                key={est.id}
                onPress={() => router.push(`/estacao?id=${est.id}` as any)}
              >
                <Image
                  source={est.avatar_url? { uri: est.avatar_url } : require('../assets/images/gabriela.png')}
                  style={styles.smallAvatar}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptySmall}>Nenhuma estação visitada ainda</Text>
          )}
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/astros-favoritos' as any)}>
          <View style={styles.itemLeft}>
            <Image source={require('../assets/images/astro.png')} style={styles.itemIcon} />
            <Text style={styles.itemTitle}>Astros Favoritados</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        <View style={styles.avatarRow}>
          {loadingAstros? (
            <ActivityIndicator size="small" />
          ) : astrosFavoritos.length > 0? (
            astrosFavoritos.map(astro => (
              <TouchableOpacity
                key={astro.id}
                onPress={() => router.push(`/post-detalhe?id=${astro.id}` as any)}
              >
                <Image
                  source={{ uri: astro.imagem_url }}
                  style={styles.smallAvatar}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptySmall}>Nenhum astro favoritado ainda</Text>
          )}
        </View>

        <View style={styles.divider} />

        {isBase && (
          <>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/criar-astro' as any)}>
              <View style={styles.itemLeft}>
                <Image source={require('../assets/images/add.png')} style={styles.itemIcon} />
                <Text style={styles.itemTitle}>Registrar novo Astro</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>
            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/meus-animais' as any)}>
              <View style={styles.itemLeft}>
                <Image source={require('../assets/images/pata.png')} style={styles.itemIcon} />
                <Text style={styles.itemTitle}>Meus Animais Cadastrados</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>
            <View style={styles.divider} />
          </>
        )}

        {(isGuardiao || isExplorador) && (
          <>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/minhas-adocoes' as any)}>
              <View style={styles.itemLeft}>
                <Image source={require('../assets/images/astro.png')} style={styles.itemIcon} />
                <Text style={styles.itemTitle}>Minhas Adoções</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>
            <View style={styles.divider} />
          </>
        )}

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/missoes' as any)}>
          <View style={styles.itemLeft}>
            <Image source={require('../assets/images/check.png')} style={styles.itemIcon} />
            <Text style={styles.itemTitle}>Missões concluídas ({missoesCount})</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => router.push('/home' as any)}>
          <Image source={require('../assets/images/info.png')} style={styles.navIcon} />
        </TouchableOpacity>

        {/* PATINHA AGORA SEMPRE APARECE E VAI PRO MATCH */}
        <TouchableOpacity onPress={() => router.push('/match' as any)}>
          <Image source={require('../assets/images/pata.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (isBase) router.push('/criar-astro' as any);
            else router.push('/novo-post' as any);
          }}
        >
          <Image source={require('../assets/images/add.png')} style={styles.addIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/chat-base' as any)}>
          <Image source={require('../assets/images/chat.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image source={require('../assets/images/perfil.png')} style={[styles.navIcon, { tintColor: '#E91E63' }]} />
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

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFCFD' },
  center: { justifyContent: 'center', alignItems: 'center' },
  topSection: {
    backgroundColor: '#12006D',
    borderBottomLeftRadius: scale(25),
    borderBottomRightRadius: scale(25),
    paddingTop: scale(40),
    paddingHorizontal: scale(20),
    paddingBottom: scale(30),
  },
  locationContainer: { flexDirection: 'row', alignItems: 'center', gap: scale(10) },
  locationText: { color: '#FFF', fontSize: scale(12), fontFamily: 'IstokWeb-Regular' },
  neighborhoodText: { color: '#FFF', fontSize: scale(11) },
  menuButton: { position: 'absolute', top: scale(40), right: scale(20) },
  menuIcon: { width: scale(24), height: scale(24) },
  popupMenu: {
    position: 'absolute',
    top: scale(70),
    right: scale(20),
    backgroundColor: '#FFF',
    borderRadius: scale(12),
    padding: scale(10),
    width: scale(170),
    zIndex: 999,
    elevation: 10,
  },
  securityIcon: { width: scale(18), height: scale(18), resizeMode: 'contain', marginRight: scale(10) },
  popupItem: { flexDirection: 'row', alignItems: 'center', marginVertical: scale(8) },
  popupIcon: { width: scale(18), height: scale(18), marginRight: scale(10) },
  popupText: { fontSize: scale(12) },
  profileCenter: { alignItems: 'center', marginTop: scale(15) },
  profileImage: { width: scale(90), height: scale(90), borderRadius: scale(45) },
  cameraButton: { position: 'absolute', right: scale(110), top: scale(5) },
  cameraIcon: { width: scale(28), height: scale(28) },
  profileName: { color: '#FFF', fontSize: scale(18), marginTop: scale(10) },
  profileRole: { color: '#FFF', fontSize: scale(12) },
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: scale(20),
    marginTop: scale(-10),
    borderRadius: scale(15),
    padding: scale(15),
    flex: 1,
  },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: scale(8) },
  itemLeft: { flexDirection: 'row', flex: 1, gap: scale(8) },
  itemTitle: { fontSize: scale(13) },
  itemSubtitle: { fontSize: scale(10), color: '#555', marginTop: scale(3), width: scale(220) },
  itemIcon: { width: scale(18), height: scale(18) },
  divider: { height: 1, backgroundColor: '#DDD', marginVertical: scale(10) },
  avatarRow: { flexDirection: 'row', marginTop: scale(8), gap: scale(8) },
  smallAvatar: { width: scale(35), height: scale(35), borderRadius: scale(18) },
  emptySmall: { fontSize: scale(10), color: '#999', fontStyle: 'italic' },
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
  opcaoBtn: { padding: 20 },
  opcaoBtnBorder: { borderTopWidth: 1, borderTopColor: '#E5E5E5' },
  opcaoCancelar: { marginTop: 8, backgroundColor: '#F5F5F5' },
  opcaoTexto: { fontSize: 16, textAlign: 'center' },
  post: { marginBottom: scale(20) },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    marginBottom: scale(10),
    gap: scale(10),
  },
  postUserInfo: { flex: 1, justifyContent: 'center' },
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
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: scale(5) },
  actionText: { fontSize: scale(14), fontFamily: 'IstokWeb-Regular', color: '#1A1A1A' },
  captionContainer: { paddingHorizontal: scale(20), flexDirection: 'row', flexWrap: 'wrap' },
  captionAuthor: { fontSize: scale(12), fontFamily: 'IstokWeb-Regular', fontWeight: 'bold' },
  captionText: { fontSize: scale(12), fontFamily: 'IstokWeb-Regular' },
  mention: { color: '#E91E63', fontWeight: '600' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: scale(20), marginTop: 5 },
  infoText: { fontSize: scale(12), color: '#777', fontFamily: 'IstokWeb-Regular' },
});