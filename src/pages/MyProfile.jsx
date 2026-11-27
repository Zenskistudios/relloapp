import { Navigate } from 'react-router'
import { useAuth } from '../auth/AuthContext.js'
import AppShell from '../components/AppShell.jsx'
import Notice from '../components/Notice.jsx'

// /profile sends you to your own public profile once it has loaded.
export default function MyProfile() {
  const { profile, signOut } = useAuth()
  if (profile) return <Navigate to={`/profile/${profile.handle}`} replace />

  return (
    <AppShell>
      <Notice title="Loading your profile…">
        <p>If this stays here, refresh the page. On a new setup, check that the database script ran.</p>
        <button className="secondary small" onClick={() => signOut().catch(console.error)}>
          Sign out
        </button>
      </Notice>
    </AppShell>
  )
}
