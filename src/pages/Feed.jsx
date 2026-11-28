import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useAuth } from '../auth/AuthContext.js'
import AppShell from '../components/AppShell.jsx'
import Icon from '../components/Icon.jsx'
import Notice, { SetupNotice } from '../components/Notice.jsx'
import PostList from '../components/PostList.jsx'
import { TOPICS } from '../lib/categories.js'
import { supabase } from '../lib/supabase.js'

export default function Feed() {
  const { loading, user } = useAuth()
  const [refreshes, setRefreshes] = useState(0)
  const [params, setParams] = useSearchParams()
  const topic = TOPICS.find((item) => item.id === params.get('topic'))

  return (
    <AppShell>
      <header className="page-header board-header">
        <Link className="board-logo" to="/" aria-label="RELLO home page">
          <img src="/brand/rello-logo.jpg" alt="" />
        </Link>
        <div className="board-title">
          <p>Newest first</p>
          <h1>Noticeboard</h1>
        </div>
        <div className="header-actions">
          {supabase && (
            <button
              className="icon-circle"
              type="button"
              aria-label="Refresh"
              onClick={() => setRefreshes(refreshes + 1)}
            >
              <Icon name="refresh" size={20} />
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
        <>
          <div className="topic-row" role="group" aria-label="Filter by topic">
            {[undefined, ...TOPICS].map((item) => (
              <button
                key={item?.id ?? 'all'}
                type="button"
                aria-pressed={item?.id === topic?.id}
                onClick={() => setParams(item ? { topic: item.id } : {}, { replace: true })}
              >
                {item?.chip ?? 'All'}
              </button>
            ))}
          </div>
          <PostList
            key={`${topic?.id ?? 'all'}:${refreshes}`}
            category={topic?.value}
            restore={refreshes === 0}
            empty={
              <Notice title={topic ? `No posts under ${topic.chip} yet.` : 'The board is empty.'}>
                <p>
                  <Link to="/create">{topic ? 'Write a post.' : 'Post the first notice.'}</Link>
                </p>
              </Notice>
            }
          />
        </>
      ) : (
        <SetupNotice />
      )}
    </AppShell>
  )
}
