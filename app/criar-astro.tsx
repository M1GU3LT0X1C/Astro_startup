import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { supabase } from '../lib/supabase';
import { useAppAlerts } from '../utils/alert';

const { width } = Dimensions.get('window');

const guidelineBaseWidth = 360;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

export default function CriarAstro() {
  const router = useRouter();
  const { mostrarOpcoesFoto } = useAppAlerts();

  // Estados dos campos
  const [imagem, setImagem] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [raca, setRaca] = useState('');
  const [descricao, setDescricao] = useState('');

  const [porte, setPorte] = useState('');
  const [sexo, setSexo] = useState('');
  const [especie, setEspecie] = useState('');

  const [castrado, setCastrado] = useState(false);
  const [vacinado, setVacinado] = useState(false);
  const [vermifugado, setVermifugado] = useState(false);
  const [pedigree, setPedigree] = useState(false);
  const [cuidados, setCuidados] = useState(false);

  const [personalidade, setPersonalidade] = useState<string[]>([]);

  const [porteOpen, setPorteOpen] = useState(false);
  const [sexoOpen, setSexoOpen] = useState(false);
  const [especieOpen, setEspecieOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const personalidadeLista = [
    { nome: 'Afetivo', icon: require('../assets/images/afetivo.png') },
    { nome: 'Energético', icon: require('../assets/images/energetico.png') },
    { nome: 'Apegado', icon: require('../assets/images/apegado.png') },
    { nome: 'Tímido', icon: require('../assets/images/timido.png') },
    { nome: 'Curioso', icon: require('../assets/images/curioso.png') },
    { nome: 'Preguiçoso', icon: require('../assets/images/preguicoso.png') },
    { nome: 'Sociável', icon: require('../assets/images/sociavel.png') },
    { nome: 'Individual', icon: require('../assets/images/individual.png') },
    { nome: 'Medroso', icon: require('../assets/images/medroso.png') },
    { nome: 'Protetor', icon: require('../assets/images/protetor.png') },
  ];

  const togglePersonalidade = (item: string) => {
    if (personalidade.includes(item)) {
      setPersonalidade(personalidade.filter(p => p!== item));
    } else {
      setPersonalidade([...personalidade, item]);
    }
  };

  async function abrirCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status!== 'granted') {
      Toast.show({ type: 'error', text1: 'Permissão negada', text2: 'Precisamos de acesso à câmera' });
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setImagem(result.assets[0].uri);
  }

  async function abrirGaleria() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setImagem(result.assets[0].uri);
  }

  async function escolherImagem() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status!== 'granted') {
      Toast.show({ type: 'error', text1: 'Permissão negada', text2: 'Precisamos de acesso à galeria' });
      return;
    }
    mostrarOpcoesFoto(abrirCamera, abrirGaleria);
  }

  const handlePublicar = async () => {
    if (!nome.trim()) {
      Toast.show({ type: 'error', text1: 'Faltou o nome', text2: 'Dá um nome pro Astro' });
      return;
    }
    if (!imagem) {
      Toast.show({ type: 'error', text1: 'Faltou a foto', text2: 'Adiciona uma imagem do Astro' });
      return;
    }
    if (!porte ||!sexo ||!especie) {
      Toast.show({ type: 'error', text1: 'Campos obrigatórios', text2: 'Preenche porte, sexo e espécie' });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Sessão expirada. Faça login novamente.');

      // Upload da imagem
      const fileExt = imagem.split('.').pop();
      const fileName = `${user.id}/astros/${Date.now()}.${fileExt}`;

      const response = await fetch(imagem);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const { error: uploadError } = await supabase.storage
    .from('astros')
    .upload(fileName, arrayBuffer, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('astros').getPublicUrl(fileName);
      const imageUrl = urlData.publicUrl;

      // Mapeia espécie pra 'cat' ou 'dog'
      const especieMap: Record<string, string> = {
        'Cachorro': 'dog',
        'Gato': 'cat'
      };

      // Insere no banco
      const { data: insertedData, error: dbError } = await supabase.from('astros').insert({
        nome: nome,
        idade: idade || null,
        raca: raca || null,
        porte: porte,
        sexo: sexo,
        especie: especieMap[especie],
        castrado: castrado,
        vacinado: vacinado,
        vermifugado: vermifugado,
        pedigree: pedigree,
        cuidados_especiais: cuidados,
        personalidade: personalidade.length > 0? personalidade : null,
        descricao: descricao || null,
        imagem_url: imageUrl,
        user_id: user.id,
        disponivel: true
      }).select().single();

      if (dbError) throw dbError;

      Toast.show({
        type: 'success',
        text1: 'Astro publicado! 🚀',
        text2: 'Bora pro swap',
      });

      setTimeout(() => {
        router.replace('/match');
      }, 1000);

    } catch (error: any) {
      console.log('ERRO:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao publicar',
        text2: error.message || 'Não foi possível criar o Astro',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={scale(30)} color="#000" />
        </TouchableOpacity>

        <View style={styles.card}>

          <TouchableOpacity style={styles.imageBox} onPress={escolherImagem}>
            {imagem? (
              <Image source={{ uri: imagem }} style={styles.previewImage} />
            ) : (
              <>
                <Image source={require('../assets/images/camera.png')} style={styles.cameraIcon} />
                <Text style={styles.addImageText}>Adicionar imagem</Text>
              </>
            )}
          </TouchableOpacity>

          <TextInput
            placeholder="Nome do Astro"
            style={styles.inputHighlight}
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            placeholder="Idade do Astro"
            style={styles.inputHighlight}
            value={idade}
            onChangeText={setIdade}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Raça do Astro"
            style={styles.inputHighlight}
            value={raca}
            onChangeText={setRaca}
          />

          <View style={styles.box}>

            {/* PORTE */}
            <TouchableOpacity
              style={styles.rowBetween}
              activeOpacity={0.7}
              onPress={() => setPorteOpen(!porteOpen)}
            >
              <Text style={styles.selectText}>{porte || 'Porte'}</Text>
              <Ionicons
                name="chevron-forward"
                size={scale(20)}
                color="#A0A0A0"
                style={[styles.seta, porteOpen && styles.setaRotacionada]}
              />
            </TouchableOpacity>

            {porteOpen && (
              <View style={styles.dropdown}>
                {['Pequeno', 'Médio', 'Grande'].map(item => (
                  <TouchableOpacity
                    key={item}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setPorte(item);
                      setPorteOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.divider} />

            {/* SEXO */}
            <TouchableOpacity
              style={styles.rowBetween}
              activeOpacity={0.7}
              onPress={() => setSexoOpen(!sexoOpen)}
            >
              <Text style={styles.selectText}>{sexo || 'Sexo'}</Text>
              <Ionicons
                name="chevron-forward"
                size={scale(20)}
                color="#A0A0A0"
                style={[styles.seta, sexoOpen && styles.setaRotacionada]}
              />
            </TouchableOpacity>

            {sexoOpen && (
              <View style={styles.dropdown}>
                {['Macho', 'Fêmea'].map(item => (
                  <TouchableOpacity
                    key={item}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSexo(item);
                      setSexoOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.divider} />

            {/* ESPÉCIE */}
            <TouchableOpacity
              style={styles.rowBetween}
              activeOpacity={0.7}
              onPress={() => setEspecieOpen(!especieOpen)}
            >
              <Text style={styles.selectText}>{especie || 'Espécie'}</Text>
              <Ionicons
                name="chevron-forward"
                size={scale(20)}
                color="#A0A0A0"
                style={[styles.seta, especieOpen && styles.setaRotacionada]}
              />
            </TouchableOpacity>

            {especieOpen && (
              <View style={styles.dropdown}>
                {['Cachorro', 'Gato'].map(item => (
                  <TouchableOpacity
                    key={item}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setEspecie(item);
                      setEspecieOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

          </View>

          {/* SWITCHES */}
          <View style={styles.box}>
            {[
              ['Castrado', castrado, setCastrado],
              ['Vacinado', vacinado, setVacinado],
              ['Vermifugado', vermifugado, setVermifugado],
              ['Pedigree', pedigree, setPedigree],
              ['Cuidados especiais', cuidados, setCuidados],
            ].map(([label, value, setValue]: any, index: number) => (
              <View
                key={label}
                style={[
                  styles.rowBetween,
                  index!== 4 && styles.divider
                ]}
              >
                <Text style={styles.switchText}>{label}</Text>
                <Switch value={value} onValueChange={setValue} trackColor={{ true: '#0D0062' }} />
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Personalidade</Text>

          <View style={styles.personalityGrid}>
            {personalidadeLista.map(item => {
              const active = personalidade.includes(item.nome);
              return (
                <TouchableOpacity
                  key={item.nome}
                  style={styles.iconWrapper}
                  onPress={() => togglePersonalidade(item.nome)}
                >
                  <View style={[styles.iconCircle, active && styles.iconActive]}>
                    <Image source={item.icon} style={styles.iconImage} />
                  </View>
                  <Text style={styles.iconLabel}>{item.nome}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TextInput
            placeholder="Conte sobre o Astro..."
            style={styles.textArea}
            multiline
            value={descricao}
            onChangeText={setDescricao}
          />

        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handlePublicar}
          disabled={loading}
        >
          {loading? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Publicar</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: scale(40),
  },

  backButton: {
    marginLeft: scale(20),
    marginBottom: scale(10),
  },

  card: {
    backgroundColor: '#FFF',
    marginHorizontal: scale(15),
    borderRadius: scale(20),
    padding: scale(15),
  },

  imageBox: {
    height: scale(140),
    borderRadius: scale(15),
    borderWidth: 1,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(15),
    overflow: 'hidden',
  },

  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  cameraIcon: {
    width: scale(100),
    height: scale(100),
  },

  addImageText: {
    color: '#777',
    fontSize: scale(12),
  },

  inputHighlight: {
    backgroundColor: '#FFF',
    borderRadius: scale(15),
    padding: scale(14),
    marginBottom: scale(12),
    elevation: 3,
    fontSize: scale(14),
  },

  box: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(15),
    marginBottom: scale(15),
    paddingVertical: scale(5),
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(12),
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  dropdown: {
    backgroundColor: '#FFF',
    paddingHorizontal: scale(12),
    paddingBottom: scale(10),
  },

  dropdownItem: {
    paddingVertical: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },

  dropdownText: {
    fontSize: scale(13),
  },

  selectText: {
    fontSize: scale(13),
  },

  seta: {
    transform: [{ rotate: '0deg' }],
  },

  setaRotacionada: {
    transform: [{ rotate: '90deg' }],
  },

  switchText: {
    fontSize: scale(12),
  },

  sectionTitle: {
    marginBottom: scale(10),
    fontWeight: 'bold',
  },

  personalityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  iconWrapper: {
    alignItems: 'center',
    width: '20%',
    marginBottom: scale(15),
  },

  iconCircle: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    borderWidth: 2,
    borderColor: '#0D0062',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconActive: {
    backgroundColor: '#1B0A3D',
  },

  iconImage: {
    width: scale(44),
    height: scale(44),
  },

  iconLabel: {
    fontSize: scale(10),
    marginTop: scale(5),
    textAlign: 'center',
  },

  textArea: {
    backgroundColor: '#FFF',
    borderRadius: scale(15),
    padding: scale(14),
    height: scale(100),
    textAlignVertical: 'top',
    marginTop: scale(10),
    elevation: 3,
    fontSize: scale(14),
  },

  button: {
    backgroundColor: '#0D0062',
    margin: scale(20),
    padding: scale(15),
    borderRadius: scale(25),
    alignItems: 'center',
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFF',
    fontSize: scale(14),
  },
});