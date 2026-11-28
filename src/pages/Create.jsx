import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext.js'
import AppShell from '../components/AppShell.jsx'
import Avatar from '../components/Avatar.jsx'
import { CATEGORIES } from '../lib/categories.js'
import { MAX_INPUT_MB, preparePhoto } from '../lib/photos.js'
import { createPost } from '../lib/posts.js'

export default function Create() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('Community Notice')
  const [location, setLocation] = useState('')
  const [commentsEnabled, setCommentsEnabled] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  // { blob, preview } once a chosen photo has been shrunk
  const [photo, setPhoto] = useState(null)
  const [preparing, setPreparing] = useState(false)

  // Frees the preview's memory when it is replaced, removed or the page closes.
  useEffect(() => {
    if (!photo) return
    return () => URL.revokeObjectURL(photo.preview)
  }, [photo])

  async function choosePhoto(event) {
    const input = event.target
    const file = input.files?.[0]
    input.value = '' // so the same file can be chosen again after removing it
    if (!file) return
    setError('')
    if (!file.type.startsWith('image/')) {
      setError('Choose a photo. Video is not supported yet.')
      return
    }
    if (file.size > MAX_INPUT_MB * 1024 * 1024) {
      setError(`Choose a photo that is ${MAX_INPUT_MB} MB or smaller.`)
      return
    }
    setPreparing(true)
    try {
      const blob = await preparePhoto(file)
      setPhoto({ blob, preview: URL.createObjectURL(blob) })
    } catch (err) {
      console.error('Could not prepare the photo:', err.message)
      setError('That photo could not be opened. Try a JPEG or PNG.')
    } finally {
      setPreparing(false)
    }
  }

  async function publish(event) {
    event.preventDefault()
    if (preparing) return
    if (!body.trim() && !photo) {
      setError('Write something or add a photo before publishing.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await createPost({
        body,
        category,
        location,
        commentsEnabled,
        photo: photo?.blob,
        userId: user.id,
      })
      navigate('/home')
    } catch (err) {
      console.error('Could not publish:', err.message)
      // The text and photo stay on the page so nothing is lost.
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
          <button className="primary small" type="submit" disabled={busy || preparing}>
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
              {photo && (
                <div className="media-preview">
                  <img src={photo.preview} alt="Your chosen photo" />
                  <button
                    type="button"
                    aria-label="Remove photo"
                    disabled={busy}
                    onClick={() => setPhoto(null)}
                  >
                    ×
                  </button>
                </div>
              )}
              <div className="composer-tools">
                <label className="photo-picker">
                  ▧ {preparing ? 'Preparing photo…' : photo ? 'Change photo' : 'Add photo'}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={busy || preparing}
                    onChange={choosePhoto}
                  />
                </label>
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
