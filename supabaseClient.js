import { createClient } from "@supabase/supabase-js";
import { REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  localStorage: AsyncStorage,
  detectSessionInUrl: false,
});
