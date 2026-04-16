import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

const supabaseUrl = 'https://ublrshmlkrapkhfengws.supabase.co' // tirei da sua key mesmo
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVibHJzaG1sa3JhcGtoZmVuZ3dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyODMyOTEsImV4cCI6MjA5MTg1OTI5MX0.uDl6lgQixT1357jgaT4k5gF65GgPimuPgb4sh7LCEZg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})