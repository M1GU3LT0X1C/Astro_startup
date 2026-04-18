import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');
const scale = (size: number) => (width / 360) * size;

export default function RedefinirSenha() {
  console.log('[REDEFINIR] COMPONENTE MONTOU');

  const router = useRouter();
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    console.log('[REDEFINIR] useEffect rodou');
    let mounted = true;

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[REDEFINIR] Sessão existe:',!!session);

      if (!mounted) return;
      setSessionOk(!!session);
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log('[REDEFINIR] Auth event:', event);
      if (event === 'SIGNED_OUT') router.replace('/login');
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // TELA DE TESTE - SE APARECER AMARELA, NAVEGAÇÃO FUNCIONOU
  return (
    <View style={{ flex: 1, backgroundColor: 'yellow', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 30, color: 'black', marginBottom: 20 }}>TELA ABRIU</Text>
      <Text style={{ fontSize: 16, color: 'black' }}>Loading: {loading? 'SIM' : 'NÃO'}</Text>
      <Text style={{ fontSize: 16, color: 'black' }}>Session OK: {sessionOk? 'SIM' : 'NÃO'}</Text>
      <TouchableOpacity
        style={{ backgroundColor: 'black', padding: 15, marginTop: 20, borderRadius: 10 }}
        onPress={() => router.replace('/login')}
      >
        <Text style={{ color: 'white' }}>Voltar pro login</Text>
      </TouchableOpacity>
    </View>
  );

  // CÓDIGO ORIGINAL COMENTADO - DESCOMENTA DEPOIS QUE RESOLVER
  /*
  async function handleRedefinir() {
    if (!novaSenha.trim() ||!confirmarSenha.trim()) {
      Toast.show({ type: 'error', text1: 'Preencha os campos' });
      return;
    }

    if (novaSenha!== confirmarSenha) {
      Toast.show({ type: 'error', text1: 'Senhas diferentes' });
      return;
    }

    const senhaForteRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!senhaForteRegex.test(novaSenha)) {
      Toast.show({
        type: 'error',
        text1: 'Senha fraca',
        text2: 'Use 8+ caracteres com A-Z, a-z, 0-9 e símbolo',
        visibilityTime: 5000,
      });
      return;
    }

    setSalvando(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: novaSenha });
      if (error) throw error;

      Toast.show({
        type: 'success',
        text1: 'Senha alterada!',
        text2: 'Faz login com a nova senha',
      });

      await supabase.auth.signOut();
      setTimeout(() => router.replace('/login'), 2000);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao redefinir',
        text2: error.message,
      });
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0D0062" />
        <Text style={{ marginTop: 10, fontFamily: 'IstokWeb-Regular' }}>Validando link...</Text>
      </View>
    );
  }

  if (!sessionOk) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.title}>Link inválido ou expirado</Text>
        <Text style={[styles.subtitle, { textAlign: 'center', marginHorizontal: 20 }]}>
          Esse link de recuperação não é mais válido. Peça um novo.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/recuperar-senha')}>
          <Text style={styles.buttonText}>Pedir novo link</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova senha</Text>
      <Text style={styles.subtitle}>Cria uma senha forte pra proteger sua conta</Text>

      <TextInput
        placeholder="Nova senha"
        style={styles.input}
        placeholderTextColor="#777"
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Confirmar nova senha"
        style={styles.input}
        placeholderTextColor="#777"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, salvando && styles.buttonDisabled]}
        onPress={handleRedefinir}
        disabled={salvando}
      >
        {salvando? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Redefinir senha</Text>
        )}
      </TouchableOpacity>
    </View>
  );
  */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCFD',
    padding: scale(20),
    paddingTop: scale(60),
    justifyContent: 'center',
  },
  title: {
    fontSize: scale(30),
    marginBottom: scale(10),
    fontFamily: 'IstokWeb-Regular',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scale(14),
    color: '#555',
    marginBottom: scale(30),
    fontFamily: 'IstokWeb-Regular',
  },
  input: {
    backgroundColor: '#D9D9D9',
    padding: scale(15),
    borderRadius: scale(15),
    marginBottom: scale(15),
    fontFamily: 'IstokWeb-Regular',
    color: '#1A1A1A',
    fontSize: scale(14),
  },
  button: {
    backgroundColor: '#0D0062',
    padding: scale(15),
    borderRadius: scale(15),
    alignItems: 'center',
    marginTop: scale(10),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: scale(16),
    fontFamily: 'IstokWeb-Regular',
  },
});