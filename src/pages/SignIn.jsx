import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router'
import { useAuth } from '../auth/AuthContext.js'
import Logo from '../components/Logo.jsx'
import { SetupNotice } from '../components/Notice.jsx'
import { readReturnTo, saveReturnTo } from '../lib/returnTo.js'
import { supabase } from '../lib/supabase.js'

export default function SignIn() {
  const { user, signInWithGoogle } = useAuth()
  const location = useLocation()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (user) return <Navigate to={location.state?.from ?? readReturnTo()} replace />

  async function start() {
    setBusy(true)
    setError('')
    saveReturnTo(location.state?.from ?? '/home')
    try {
      await signInWithGoogle()
      // The browser now leaves for Google.
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <Link className="auth-logo" to="/">
        <Logo />
      </Link>
      <section className="auth-card">
        <p className="eyebrow">Your community noticeboard</p>
        <h1>Join RELLO</h1>
        {supabase ? (
          <>
            <button className="primary full" onClick={start} disabled={busy}>
              {busy ? 'Opening Google…' : 'Continue with Google'}
            </button>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <p className="auth-switch">
              Your Google name appears on your public profile. Your email address does not.
            </p>
          </>
        ) : (
          <SetupNotice />
        )}
        <p className="auth-switch">
          <Link to="/home">See what’s happening without signing in</Link>
        </p>
      </section>
    </main>
  )
}
