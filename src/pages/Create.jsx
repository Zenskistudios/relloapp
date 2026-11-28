import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext.js'
import AppShell from '../components/AppShell.jsx'
import Icon from '../components/Icon.jsx'
import { TOPICS } from '../lib/categories.js'
import { MAX_INPUT_MB, preparePhoto } from '../lib/photos.js'
import { createPost } from '../lib/posts.js'

export default function Create() {
  const { user } = useAuth()
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
      setError('Write something or add a photo before posting.')
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
      setError('Your post was not sent. Check your connection and try again.')
      setBusy(false)
    }
  }

  return (
    <AppShell focused>
      <form className="new-post" onSubmit={publish}>
        <header className="page-header new-post-header">
          <Link className="icon-circle" to="/home" aria-label="Close">
            <Icon name="close" size={20} />
          </Link>
          <h1>What’s happening?</h1>
        </header>
        <div className="composer">
          {photo && (
            <div className="media-preview">
              <img src={photo.preview} alt="Your chosen photo" />
              <button
                className="icon-circle"
                type="button"
                aria-label="Remove photo"
                disabled={busy}
                onClick={() => setPhoto(null)}
              >
                <Icon name="close" size={20} />
              </button>
            </div>
          )}
          <label className={photo ? 'photo-picker small-picker' : 'photo-picker'}>
            <Icon name="camera" size={photo ? 20 : 30} />
            {preparing ? 'Preparing photo…' : photo ? 'Change photo' : 'Add a photo'}
            <input
              type="file"
              accept="image/*"
              disabled={busy || preparing}
              onChange={choosePhoto}
            />
          </label>

          <div className="field">
            <textarea
              aria-label="Post"
              maxLength={500}
              value={body}
              onChange={(e) => {
                setBody(e.target.value)
                setError('')
              }}
              placeholder="Describe what you can see"
            />
            <span className="count">{body.length}/500</span>
          </div>

          <fieldset className="topic-picker">
            <legend>Topic</legend>
            {TOPICS.map((topic) => (
              <label key={topic.id}>
                <input
                  type="radio"
                  name="category"
                  value={topic.value}
                  checked={category === topic.value}
                  onChange={() => setCategory(topic.value)}
                />
                <span>{topic.value}</span>
              </label>
            ))}
          </fieldset>

          <label className="field place-field">
            <span>Where is it? (optional)</span>
            <input
              maxLength={80}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Street or area, like Yaba"
            />
          </label>

          <label className="comments-field">
            Allow comments
            <input
              type="checkbox"
              checked={commentsEnabled}
              onChange={(e) => setCommentsEnabled(e.target.checked)}
            />
          </label>
        </div>
        <div className="new-post-submit">
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="primary full" type="submit" disabled={busy || preparing}>
            {busy ? 'Posting…' : 'Post to the board'}
          </button>
        </div>
      </form>
    </AppShell>
  )
}
