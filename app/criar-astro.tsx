import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

// BASE
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;

// SCALE
const scale = (size:number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size:number) => (height / guidelineBaseHeight) * size;

export default function CriarAstro() {
  const [castrado, setCastrado] = useState(false);
  const [vacinado, setVacinado] = useState(false);
  const [vermifugado, setVermifugado] = useState(false);
  const [pedigree, setPedigree] = useState(false);
  const [cuidados, setCuidados] = useState(false);

  const [personalidade, setPersonalidade] = useState<string[]>([]);

  const [porteOpen, setPorteOpen] = useState(false);
  const [sexoOpen, setSexoOpen] = useState(false);
  const [especieOpen, setEspecieOpen] = useState(false);

  const [porte, setPorte] = useState('');
  const [sexo, setSexo] = useState('');
  const [especie, setEspecie] = useState('');

  const togglePersonalidade = (item: string) => {
    if (personalidade.includes(item)) {
      setPersonalidade(personalidade.filter(p => p !== item));
    } else {
      setPersonalidade([...personalidade, item]);
    }
  };

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
  
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Image source={require('../assets/images/back.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.card}>

          <TouchableOpacity style={styles.imageBox}>
            <Image source={require('../assets/images/camera.png')} style={styles.cameraIcon} />
            <Text style={styles.addImageText}>Adicionar imagem</Text>
          </TouchableOpacity>

          <TextInput placeholder="Nome do Astro" style={styles.inputHighlight} />
          <TextInput placeholder="Idade do Astro" style={styles.inputHighlight} />
          <TextInput placeholder="Raça do Astro" style={styles.inputHighlight} />

          {/* 🔥 SELECTS */}
          <View style={styles.box}>

            {/* PORTE */}
            <TouchableOpacity
              style={styles.rowBetween}
              activeOpacity={0.7}
              onPress={() => setPorteOpen(!porteOpen)}
            >
              <Text style={styles.selectText}>{porte || 'Porte'}</Text>
              <Image source={require('../assets/images/seta.png')} style={styles.arrow} />
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
                    <Text>{item}</Text>
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
              <Image source={require('../assets/images/seta.png')} style={styles.arrow} />
            </TouchableOpacity>

            {sexoOpen && (
              <View style={styles.dropdown}>
                {['Masculino', 'Feminino'].map(item => (
                  <TouchableOpacity
                    key={item}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSexo(item);
                      setSexoOpen(false);
                    }}
                  >
                    <Text>{item}</Text>
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
              <Image source={require('../assets/images/seta.png')} style={styles.arrow} />
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
                    <Text>{item}</Text>
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
                  index !== 4 && styles.divider
                ]}
              >
                <Text style={styles.switchText}>{label}</Text>
                <Switch value={value} onValueChange={setValue} />
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
          />

        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Publicar</Text>
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

  backIcon: {
    width: scale(30),
    height: scale(30),
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

  selectText: {
    fontSize: scale(13),
  },

  arrow: {
    width: scale(10),
    height: scale(10),
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
  },

  button: {
    backgroundColor: '#0D0062',
    margin: scale(20),
    padding: scale(15),
    borderRadius: scale(25),
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontSize: scale(14),
  },
});