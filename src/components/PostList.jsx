import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchPosts, PAGE_SIZE } from '../lib/posts.js'
import Notice from './Notice.jsx'
import PostCard from './PostCard.jsx'

export default function PostList({ authorId, empty }) {
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // Only the latest request may update the screen.
  const latestRequest = useRef(0)

  const load = useCallback(
    (before) => {
      const request = ++latestRequest.current
      fetchPosts({ authorId, before }).then(
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
    [authorId],
  )

  // The first page. `loading` already starts as true.
  useEffect(() => {
    load()
    return () => {
      latestRequest.current += 1
    }
  }, [load])

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
