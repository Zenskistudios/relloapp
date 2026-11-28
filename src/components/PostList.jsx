import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigationType } from 'react-router'
import { fetchPosts, PAGE_SIZE } from '../lib/posts.js'
import Notice from './Notice.jsx'
import PostCard from './PostCard.jsx'

// What each list showed when it was last left, so that going back from a post
// returns to the same place.
const remembered = new Map()

export default function PostList({ authorId, category, empty, restore = true }) {
  const cacheKey = `${authorId ?? ''}|${category ?? ''}`
  const goingBack = useNavigationType() === 'POP'
  const [saved] = useState(() => (restore && goingBack ? remembered.get(cacheKey) : undefined))
  const [posts, setPosts] = useState(saved?.posts ?? [])
  const [hasMore, setHasMore] = useState(saved?.hasMore ?? false)
  const [loading, setLoading] = useState(!saved)
  const [error, setError] = useState('')
  // Only the latest request may update the screen.
  const latestRequest = useRef(0)
  const latest = useRef({ posts, hasMore, loading })
  const scrollY = useRef(saved?.scrollY ?? 0)

  const load = useCallback(
    (before) => {
      const request = ++latestRequest.current
      fetchPosts({ authorId, category, before }).then(
        (page) => {
          if (request !== latestRequest.current) return
          setPosts((current) => (before ? [...current, ...page] : page))
          setHasMore(page.length === PAGE_SIZE)
          setLoading(false)
        },
        (err) => {
          if (request !== latestRequest.current) return
          console.error('Could not load posts:', err.message)
          setError('Could not load posts. Check your connection and try again.')
          setLoading(false)
        },
      )
    },
    [authorId, category],
  )

  // The first page, unless the list is being put back as it was.
  useEffect(() => {
    if (!saved) load()
    return () => {
      latestRequest.current += 1
    }
  }, [load, saved])

  useLayoutEffect(() => {
    latest.current = { posts, hasMore, loading }
  })

  useLayoutEffect(() => {
    if (goingBack) window.scrollTo(0, scrollY.current)
    const track = () => {
      scrollY.current = window.scrollY
    }
    window.addEventListener('scroll', track, { passive: true })
    return () => {
      window.removeEventListener('scroll', track)
      const { posts, hasMore, loading } = latest.current
      if (!loading && posts.length > 0) {
        remembered.set(cacheKey, { posts, hasMore, scrollY: scrollY.current })
      }
    }
    // Runs once per list: the key on <PostList> changes when the list does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function loadMore(before) {
    setLoading(true)
    setError('')
    load(before)
  }

  const last = posts.at(-1)

  return (
    <div className="feed">
      {posts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
      {loading && <p className="feed-status">Loading…</p>}
      {error && (
        <div className="feed-status" role="alert">
          <p>{error}</p>
          <button className="secondary small" onClick={() => loadMore(last)}>
            Try again
          </button>
        </div>
      )}
      {!loading && !error && posts.length === 0 && (empty ?? <Notice title="No posts yet." />)}
      {!loading && !error && posts.length > 0 && (
        <div className="feed-status">
          {hasMore ? (
            <button className="secondary small" onClick={() => loadMore(last)}>
              Load older posts
            </button>
          ) : (
            <p>That is every post so far.</p>
          )}
        </div>
      )}
    </div>
  )
}
