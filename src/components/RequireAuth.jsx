import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../auth/AuthContext.js'
import { supabase } from '../lib/supabase.js'
import AppShell from './AppShell.jsx'
import Notice, { SetupNotice } from './Notice.jsx'

export default function RequireAuth() {
  const { loading, user } = useAuth()
  const location = useLocation()

  if (!supabase) {
    return (
      <AppShell>
        <SetupNotice />
      </AppShell>
    )
  }
  if (loading) {
    return (
      <AppShell>
        <Notice title="Opening your journal…" />
      </AppShell>
    )
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}
