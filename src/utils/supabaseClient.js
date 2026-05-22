import { createClient } from '@supabase/supabase-js'

// Grabs your secure variables automatically from your updated .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// This constant is exported so any page in your website can import it to talk to the cloud
export const supabase = createClient(supabaseUrl, supabaseAnonKey)