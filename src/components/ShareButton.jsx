import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'

// Uses the phone's share sheet where there is one, otherwise copies the link.
export default function ShareButton({ path, title, className = 'icon-circle' }) {
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(''), 2500)
    return () => clearTimeout(timer)
  }, [message])

  async function share() {
    const url = new URL(path, window.location.origin).href
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setMessage('Link copied')
    } catch (err) {
      if (err.name === 'AbortError') return // the share sheet was closed
      window.prompt('Copy this link', url)
    }
  }

  return (
    <span className="share">
      <span className="share-message" role="status">
        {message}
      </span>
      <button className={className} type="button" aria-label="Share post" onClick={share}>
        <Icon name="share" size={20} />
      </button>
    </span>
  )
}
