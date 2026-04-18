import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Notificacoes() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notificações</Text>
      <Text style={styles.empty}>Nenhuma notificação ainda</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFCFD', padding: 20 },
  title: { fontSize: 24, fontFamily: 'IstokWeb-Regular', marginBottom: 20 },
  empty: { fontSize: 14, color: '#777', fontFamily: 'IstokWeb-Regular' },
});