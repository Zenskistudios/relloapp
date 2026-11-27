import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { AuthContext } from './AuthContext.js'

export default function AuthProvider({ children }) {
  // undefined = still checking, null = signed out
  const [session, setSession] = useState(supabase ? undefined : null)
  const [profile, setProfile] = useState(null)
  const userId = session?.user.id

  useEffect(() => {
    if (!supabase) return
    // Fires once with the saved session, then on every sign in and sign out.
    // Don't call Supabase from inside this callback: it can deadlock.
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    supabase
      .from('profiles')
      .select('id, handle, display_name')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error('Could not load your profile:', error.message)
        if (!cancelled) setProfile(data)
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) throw error
  }

  async function signOut() {
    // 'local' signs out this device only, not the person's other phones.
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) throw error
  }

  const value = {
    loading: session === undefined,
    user: session?.user ?? null,
    // Never show one person's profile during another person's session.
    profile: profile && profile.id === userId ? profile : null,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
