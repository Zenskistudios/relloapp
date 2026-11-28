import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../auth/AuthContext.js'
import AppShell from '../components/AppShell.jsx'
import Notice, { SetupNotice } from '../components/Notice.jsx'
import PostList from '../components/PostList.jsx'
import { supabase } from '../lib/supabase.js'

export default function Feed() {
  const { loading, user } = useAuth()
  const [version, setVersion] = useState(0)

  return (
    <AppShell>
      <header className="page-header">
        <div>
          <p>Newest first</p>
          <h1>Noticeboard</h1>
        </div>
        <div className="header-actions">
          {supabase && (
            <button className="secondary small" onClick={() => setVersion(version + 1)}>
              Refresh
            </button>
          )}
          {!loading && !user && (
            <Link className="button-link primary small" to="/login">
              Sign in
            </Link>
          )}
        </div>
      </header>
      {supabase ? (
        <PostList
          key={version}
          empty={
            <Notice title="The board is empty.">
              <p>
                <Link to="/create">Post the first notice.</Link>
              </p>
            </Notice>
          }
        />
      ) : (
        <SetupNotice />
      )}
    </AppShell>
  )
}
