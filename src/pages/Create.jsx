import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext.js'
import AppShell from '../components/AppShell.jsx'
import Avatar from '../components/Avatar.jsx'
import { CATEGORIES } from '../lib/categories.js'
import { createPost } from '../lib/posts.js'

export default function Create() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('Community Notice')
  const [location, setLocation] = useState('')
  const [commentsEnabled, setCommentsEnabled] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function publish(event) {
    event.preventDefault()
    if (!body.trim()) {
      setError('Write something before publishing.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await createPost({ body, category, location, commentsEnabled })
      navigate('/home')
    } catch (err) {
      console.error('Could not publish:', err.message)
      // The text stays in the box so nothing is lost.
      setError('Your entry was not published. Check your connection and try again.')
      setBusy(false)
    }
  }

  return (
    <AppShell>
      <form onSubmit={publish}>
        <header className="page-header">
          <div>
            <p>New entry</p>
            <h1>Create</h1>
          </div>
          <button className="primary small" type="submit" disabled={busy}>
            {busy ? 'Publishing…' : 'Publish'}
          </button>
        </header>
        <div className="composer">
          <div className="composer-body">
            <Avatar name={profile?.display_name} />
            <div className="composer-content">
              <textarea
                aria-label="Entry"
                maxLength={500}
                value={body}
                onChange={(e) => {
                  setBody(e.target.value)
                  setError('')
                }}
                placeholder="What is happening around you?"
              />
              <div className="composer-tools">
                <label>
                  ⌖ Location
                  <input
                    maxLength={80}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Add location"
                  />
                </label>
                <label>
                  Category
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {CATEGORIES.map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                </label>
              </div>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <div className="composer-footer">
                <span>{body.length}/500</span>
                <button
                  className="secondary small"
                  type="button"
                  aria-pressed={commentsEnabled}
                  onClick={() => setCommentsEnabled(!commentsEnabled)}
                >
                  Comments {commentsEnabled ? 'on' : 'off'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AppShell>
  )
}
