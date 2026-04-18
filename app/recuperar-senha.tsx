import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { supabase } from '../lib/supabase';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;

export default function RecuperarSenha() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecuperar = async () => {
    if (!email.trim()) {
      Toast.show({ type: 'error', text1: 'Digite seu email' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Toast.show({ type: 'error', text1: 'Email inválido' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: 'astrostartup://redefinir-senha',
      });

      if (error) throw error;

      Toast.show({
        type: 'success',
        text1: 'Email enviado!',
        text2: 'Checa sua caixa de entrada e spam',
        visibilityTime: 4000,
      });

      setTimeout(() => router.replace('/login'), 2000);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao enviar email',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.title}>Recuperar Senha</Text>

      <TextInput
        placeholder="Digite seu email"
        value={email}
        placeholderTextColor="#777"
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRecuperar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Enviar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Voltar para login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(20),
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: scale(24),
    fontWeight: 'bold',
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#D9D9D9',
    borderRadius: scale(12),
    padding: scale(14),
    marginBottom: scale(15),
    fontSize: scale(18),
    fontFamily: 'IstokWeb-Regular',
  },
  button: {
    backgroundColor: '#0D0062',
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(105),
    borderRadius: scale(16),
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: scale(16),
    fontWeight: 'bold',
    fontFamily: 'IstokWeb-Regular',
  },
  link: {
    marginTop: verticalScale(15),
    textAlign: 'center',
    color: '#000000',
  },
});