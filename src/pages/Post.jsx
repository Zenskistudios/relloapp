import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import AppShell from '../components/AppShell.jsx'
import Avatar from '../components/Avatar.jsx'
import Icon from '../components/Icon.jsx'
import Notice, { SetupNotice } from '../components/Notice.jsx'
import ShareButton from '../components/ShareButton.jsx'
import { topicFor } from '../lib/categories.js'
import { capitalizeFirst, timeAgo } from '../lib/format.js'
import { photoUrl } from '../lib/photos.js'
import { fetchPost } from '../lib/posts.js'
import { supabase } from '../lib/supabase.js'

export default function Post() {
  const { id } = useParams()
  return (
    <AppShell focused>
      {/* The key resets everything when moving between posts. */}
      {supabase ? <PostView id={id} key={id} /> : <SetupNotice />}
    </AppShell>
  )
}

// Goes back to the list the person came from, or to the board if they opened
// a shared link.
function BackButton() {
  const navigate = useNavigate()
  const { key } = useLocation()
  return (
    <button
      className="icon-circle"
      type="button"
      aria-label="Back"
      onClick={() => (key === 'default' ? navigate('/home') : navigate(-1))}
    >
      <Icon name="back" />
    </button>
  )
}

function PostView({ id }) {
  const [state, setState] = useState({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetchPost(id).then(
      (post) => {
        if (!cancelled) setState(post ? { status: 'ready', post } : { status: 'missing' })
      },
      (err) => {
        console.error('Could not load the post:', err.message)
        if (!cancelled) setState({ status: 'error' })
      },
    )
    return () => {
      cancelled = true
    }
  }, [id, attempt])

  if (state.status !== 'ready') {
    return (
      <>
        <div className="post-bar">
          <BackButton />
        </div>
        {state.status === 'loading' && <Notice title="Loading post…" />}
        {state.status === 'missing' && (
          <Notice title="This post is not available.">
            <p>
              <Link to="/home">Go to the board.</Link>
            </p>
          </Notice>
        )}
        {state.status === 'error' && (
          <Notice title="Could not load this post.">
            <p>Check your connection and try again.</p>
            <button
              className="secondary small"
              onClick={() => {
                setState({ status: 'loading' })
                setAttempt(attempt + 1)
              }}
            >
              Try again
            </button>
          </Notice>
        )}
      </>
    )
  }

  const { post } = state
  const { author } = post
  const topic = topicFor(post.category)
  const place = capitalizeFirst(post.location)

  return (
    <article className="post-page">
      <div className={post.image_path ? 'post-bar over' : 'post-bar'}>
        <BackButton />
        <ShareButton path={`/post/${post.id}`} title={place || 'A post on RELLO'} />
      </div>
      {post.image_path && (
        <a
          className="post-hero"
          href={photoUrl(post.image_path)}
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={photoUrl(post.image_path)}
            alt={`Photo shared by ${author.display_name}. Open full size.`}
          />
        </a>
      )}
      <div className="post-sheet">
        <span className="post-tag plain">{post.category}</span>
        <h1>{place || `${author.display_name} ${topic.did}`}</h1>
        <div className="post-author">
          <Avatar name={author.display_name} />
          <div className="author-meta">
            <p>
              <Link to={`/profile/${author.handle}`}>{author.display_name}</Link>
            </p>
            <time className="post-time" dateTime={post.created_at}>
              {timeAgo(post.created_at)}
            </time>
          </div>
        </div>
        {post.body && <p className="post-text">{post.body}</p>}
        <p className="post-note">Posted by a community member. Not officially verified.</p>
      </div>
    </article>
  )
}
