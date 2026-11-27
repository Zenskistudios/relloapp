import { Link, Navigate } from 'react-router'
import { useAuth } from '../auth/AuthContext.js'
import Notice from '../components/Notice.jsx'
import { readReturnTo } from '../lib/returnTo.js'

// Google sends people back here. The Supabase client finishes the sign-in.
export default function AuthCallback() {
  const { loading, user } = useAuth()

  if (loading) return <Notice title="Signing you in…" />
  if (user) return <Navigate to={readReturnTo()} replace />

  return (
    <Notice title="Sign-in didn’t finish.">
      <p>
        <Link to="/login">Try again</Link>
      </p>
    </Notice>
  )
}
