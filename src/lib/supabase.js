import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

// A secret key skips every security rule, so it must never reach the browser.
if (key?.startsWith('sb_secret_')) {
  throw new Error('Use the Supabase publishable key, not the secret key.')
}

// null until .env.local is filled in, so the app can explain what is missing.
export const supabase = url && key ? createClient(url, key, { auth: { flowType: 'pkce' } }) : null
