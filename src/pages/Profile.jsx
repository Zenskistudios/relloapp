import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useAuth } from '../auth/AuthContext.js'
import AppShell from '../components/AppShell.jsx'
import Avatar from '../components/Avatar.jsx'
import Notice, { SetupNotice } from '../components/Notice.jsx'
import PostList from '../components/PostList.jsx'
import { countPosts, fetchProfile } from '../lib/posts.js'
import { supabase } from '../lib/supabase.js'

export default function Profile() {
  const { handle } = useParams()
  return (
    <AppShell>
      {/* The key resets everything when moving between profiles. */}
      {supabase ? <ProfileView handle={handle} key={handle} /> : <SetupNotice />}
    </AppShell>
  )
}

function ProfileView({ handle }) {
  const { user, signOut } = useAuth()
  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const profile = await fetchProfile(handle)
        if (!profile) {
          if (!cancelled) setState({ status: 'missing' })
          return
        }
        const total = await countPosts(profile.id)
        if (!cancelled) setState({ status: 'ready', profile, total })
      } catch (err) {
        console.error('Could not load profile:', err.message)
        if (!cancelled) setState({ status: 'error' })
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [handle])

  if (state.status === 'loading') return <Notice title="Loading profile…" />
  if (state.status === 'missing') return <Notice title="This profile does not exist." />
  if (state.status === 'error') {
    return (
      <Notice title="Could not load this profile.">
        <p>Check your connection and refresh the page.</p>
      </Notice>
    )
  }

  const { profile, total } = state
  const joined = new Date(profile.created_at).toLocaleDateString('en-NG', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <div className="profile-cover" />
      <section className="profile-head">
        <Avatar name={profile.display_name} className="profile-avatar" />
        {user?.id === profile.id && (
          <button className="secondary small" onClick={() => signOut().catch(console.error)}>
            Sign out
          </button>
        )}
        <h1>{profile.display_name}</h1>
        <p>@{profile.handle}</p>
        {profile.bio && <p>{profile.bio}</p>}
        <small>
          {profile.location && `⌖ ${profile.location} · `}Joined {joined}
        </small>
        <div className="profile-stats">
          <div>
            <strong>{total}</strong>
            <span>{total === 1 ? 'Post' : 'Posts'}</span>
          </div>
        </div>
      </section>
      <PostList authorId={profile.id} />
    </>
  )
}
