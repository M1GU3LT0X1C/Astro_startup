import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

// Pega esses 2 valores em: Supabase → Project Settings → API
const supabaseUrl = 'https://seu-projeto.supabase.co'
const supabaseAnonKey = 'sua-anon-public-key-aqui'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // Salva a sessão no celular
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})