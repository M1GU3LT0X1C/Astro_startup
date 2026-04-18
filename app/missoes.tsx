import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { supabase } from '../lib/supabase';

type Missao = {
  id: string;
  missao_nome: string;
  descricao: string | null;
  created_at: string;
};

const MISSOES_PREDEFINIDAS = [
  'Castração',
  'Vacinação V10',
  'Vacinação Antirrábica',
  'Resgate',
  'Lar temporário',
  'Doação de ração',
  'Adoção concluída',
];

export default function Missoes() {
  const router = useRouter();
  const [missoes, setMissoes] = useState<Missao[]>([]);
  const [loading, setLoading] = useState(true);
  const [novaMissao, setNovaMissao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [modalDelete, setModalDelete] = useState<{ visivel: boolean; missao: Missao | null }>({
    visivel: false,
    missao: null,
  });

  useEffect(() => {
    carregarMissoes();
  }, []);

  async function carregarMissoes() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('missoes_concluidas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      Toast.show({ type: 'error', text1: 'Erro ao carregar missões' });
    } else {
      setMissoes(data || []);
    }
    setLoading(false);
  }

  async function concluirMissao() {
    if (!novaMissao.trim()) {
      Toast.show({ type: 'error', text1: 'Escolha ou digite uma missão' });
      return;
    }

    setSalvando(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      Toast.show({ type: 'error', text1: 'Usuário não logado' });
      setSalvando(false);
      return;
    }

    const { error } = await supabase
      .from('missoes_concluidas')
      .insert({
        user_id: user.id,
        missao_nome: novaMissao.trim(),
        descricao: descricao.trim() || null,
      });

    if (error) {
      Toast.show({ type: 'error', text1: `Erro: ${error.message}` });
    } else {
      Toast.show({ type: 'success', text1: 'Missão registrada! 🎉' });
      setNovaMissao('');
      setDescricao('');
      setMostrarForm(false);
      await carregarMissoes();
    }
    setSalvando(false);
  }

  async function confirmarDelete() {
    if (!modalDelete.missao) return;

    const { error } = await supabase
      .from('missoes_concluidas')
      .delete()
      .eq('id', modalDelete.missao.id);

    if (error) {
      Toast.show({ type: 'error', text1: 'Erro ao remover' });
    } else {
      Toast.show({ type: 'success', text1: 'Missão removida' });
      carregarMissoes();
    }
    setModalDelete({ visivel: false, missao: null });
  }

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
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
        <Text style={styles.titulo}>Missões Concluídas</Text>
        <TouchableOpacity onPress={() => setMostrarForm(!mostrarForm)}>
          <Ionicons name={mostrarForm ? "close" : "add"} size={24} color="#E91E63" />
        </TouchableOpacity>
      </View>

      {mostrarForm && (
        <View style={styles.form}>
          <Text style={styles.label}>Qual missão você concluiu?</Text>
          
          <View style={styles.chips}>
            {MISSOES_PREDEFINIDAS.map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.chip, novaMissao === m && styles.chipAtivo]}
                onPress={() => setNovaMissao(m)}
              >
                <Text style={[styles.chipText, novaMissao === m && styles.chipTextAtivo]}>
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Ou digite outra missão..."
            value={novaMissao}
            onChangeText={setNovaMissao}
          />

          <TextInput
            style={[styles.input, styles.inputDesc]}
            placeholder="Descrição (opcional)"
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />

          <TouchableOpacity 
            style={[styles.botaoSalvar, salvando && styles.desativado]} 
            onPress={concluirMissao}
            disabled={salvando}
          >
            <Text style={styles.botaoTexto}>
              {salvando ? 'Salvando...' : 'Concluir Missão'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={missoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.missao}>
            <View style={styles.iconeMissao}>
              <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
            </View>
            <View style={styles.infoMissao}>
              <Text style={styles.nomeMissao}>{item.missao_nome}</Text>
              {item.descricao && (
                <Text style={styles.descMissao}>{item.descricao}</Text>
              )}
              <Text style={styles.dataMissao}>{formatarData(item.created_at)}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setModalDelete({ visivel: true, missao: item })}
              style={styles.botaoDelete}
            >
              <Ionicons name="trash-outline" size={20} color="#E91E63" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="rocket-outline" size={60} color="#CCC" />
            <Text style={styles.emptyText}>Nenhuma missão concluída</Text>
            <Text style={styles.emptySub}>Toque no + pra registrar sua primeira</Text>
          </View>
        }
      />

      {/* MODAL BONITINHO DE CONFIRMAÇÃO */}
      <Modal
        visible={modalDelete.visivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalDelete({ visivel: false, missao: null })}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalDelete({ visivel: false, missao: null })}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalIcone}>
              <Ionicons name="warning" size={40} color="#FF9800" />
            </View>
            
            <Text style={styles.modalTitulo}>Remover missão?</Text>
            <Text style={styles.modalTexto}>
              Tem certeza que quer remover "{modalDelete.missao?.missao_nome}"?
            </Text>

            <View style={styles.modalBotoes}>
              <TouchableOpacity 
                style={[styles.modalBotao, styles.modalBotaoCancelar]}
                onPress={() => setModalDelete({ visivel: false, missao: null })}
              >
                <Text style={styles.modalBotaoTextoCancelar}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalBotao, styles.modalBotaoConfirmar]}
                onPress={confirmarDelete}
              >
                <Text style={styles.modalBotaoTextoConfirmar}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  form: { 
    padding: 15, 
    backgroundColor: '#F8F8F8', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E5E5' 
  },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  chipAtivo: { backgroundColor: '#E91E63', borderColor: '#E91E63' },
  chipText: { fontSize: 12, color: '#333' },
  chipTextAtivo: { color: '#FFF' },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 10,
  },
  inputDesc: { minHeight: 60, textAlignVertical: 'top' },
  botaoSalvar: {
    backgroundColor: '#E91E63',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  desativado: { opacity: 0.5 },
  botaoTexto: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  missao: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
    alignItems: 'center',
  },
  iconeMissao: { paddingTop: 2 },
  infoMissao: { flex: 1 },
  nomeMissao: { fontSize: 14, fontWeight: '600', color: '#000' },
  descMissao: { fontSize: 12, color: '#666', marginTop: 4 },
  dataMissao: { fontSize: 11, color: '#999', marginTop: 4 },
  botaoDelete: { padding: 8 },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 14, color: '#777', marginTop: 10 },
  emptySub: { fontSize: 12, color: '#999', marginTop: 5 },
  
  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalIcone: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  modalTexto: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalBotoes: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBotao: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalBotaoCancelar: {
    backgroundColor: '#F5F5F5',
  },
  modalBotaoConfirmar: {
    backgroundColor: '#E91E63',
  },
  modalBotaoTextoCancelar: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  modalBotaoTextoConfirmar: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
});