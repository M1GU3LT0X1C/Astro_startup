import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { 
  Ionicons, 
  MaterialCommunityIcons, 
  FontAwesome5, 
  Entypo 
} from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // ✅ ADICIONADO

export default function NovoPost() {
  const router = useRouter(); // ✅ ADICIONADO

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Botão Voltar */}
        <TouchableOpacity 
          style={styles.backButtonContainer}
          onPress={() => router.back()} // ✅ ADICIONADO
        >
          <Image 
  source={require('../assets/images/back.png')} 
  style={{ width: 32, height: 32 }} 
/>
        </TouchableOpacity>

        {/* Caixa de Imagem */}
        <View style={styles.uploadCard}>
          <Image 
  source={require('../assets/images/camera.png')} 
  style={{ width: 90, height: 100 }} 
/>
          <Text style={styles.uploadText}>Adicionar imagem</Text>
        </View>

        {/* Input Legenda */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Adicionar legenda..."
            placeholderTextColor="#A0A0A0"
            style={styles.input}
          />
        </View>

        {/* Lista de Opções */}
        <View style={styles.optionsWrapper}>
          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <Image 
  source={require('../assets/images/locali.png')} 
  style={{ width: 20, height: 20 }} 
/>
              <Text style={styles.optionLabel}>Adicionar localização</Text>
            </View>
            <Image 
  source={require('../assets/images/seta.png')} 
  style={{ width: 16, height: 16 }} 
/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <Image 
  source={require('../assets/images/marcar.png')} 
  style={{ width: 22, height: 22 }} 
/>
              <Text style={styles.optionLabel}>Marcar pessoas / instituições</Text>
            </View>
            <Image 
  source={require('../assets/images/seta.png')} 
  style={{ width: 16, height: 16 }} 
/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRowColumn}>
            <View style={styles.optionRowMain}>
              <View style={styles.optionLeft}>
                <Image 
  source={require('../assets/images/textoalt.png')} 
  style={{ width: 22, height: 22 }} 
/>
                <Text style={styles.optionLabel}>Escrever texto alternativo</Text>
              </View>
              <Image 
  source={require('../assets/images/seta.png')} 
  style={{ width: 16, height: 16 }} 
/>
            </View>
            <Text style={styles.descriptionText}>
              O texto alternativo descreve imagens para pessoas com deficiências visuais
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botão Publicar */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.publishButton}>
            <Text style={styles.publishButtonText}>Publicar</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButtonContainer: {
    marginBottom: 20,
    marginLeft: 22,
  },
  uploadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    marginRight: 30,
    marginLeft: 30,

  },
  uploadText: {
    marginTop: 1,
    color: '#9E9EBE',
    fontSize: 14,
  },
  inputContainer: {
    marginTop: 10,
    marginBottom: -82,
    marginLeft: 30,
    marginRight: 30,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 14,
  },
  optionsWrapper: {
    marginTop: 90,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    marginLeft: 30,
    marginRight: 30,
  },
  optionRowColumn: {
    paddingVertical: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  optionRowMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 33.7,
  },
  optionLabel: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  descriptionText: {
    marginLeft: 56,
    fontSize: 11,
    color: '#A0A0A0',
    marginTop: -2,
    lineHeight: 14,
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
  },
  publishButton: {
    backgroundColor: '#000066',
    width: '59%',
    paddingVertical: 25,
    borderRadius: 25,
    alignItems: 'center',
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
  },
});