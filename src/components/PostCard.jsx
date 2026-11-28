import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { topicFor } from '../lib/categories.js'
import { timeAgo } from '../lib/format.js'
import { photoUrl } from '../lib/photos.js'
import Avatar from './Avatar.jsx'
import ShareButton from './ShareButton.jsx'

// Like, comment, Confirm and save buttons are added once they save for real.
export default function PostCard({ post }) {
  const { author } = post
  const topic = topicFor(post.category)
  const to = `/post/${post.id}`

  return (
    <article className="post">
      <div className="post-author">
        <Avatar name={author.display_name} />
        <div className="author-meta">
          <p>
            <Link to={`/profile/${author.handle}`}>{author.display_name}</Link> {topic.did}
          </p>
          <Link className="post-time" to={to}>
            <time dateTime={post.created_at}>{timeAgo(post.created_at)}</time>
          </Link>
        </div>
      </div>
      {post.image_path ? (
        <div className="post-photo">
          <Link to={to}>
            <img
              className="post-image"
              src={photoUrl(post.image_path)}
              alt={`Photo shared by ${author.display_name}. Open the post.`}
              loading="lazy"
            />
          </Link>
          <span className="post-tag">{post.category}</span>
        </div>
      ) : (
        <span className="post-tag plain">{post.category}</span>
      )}
      {post.location && (
        <h2 className="post-place">
          <Link to={to}>{post.location}</Link>
        </h2>
      )}
      {post.body && <Excerpt text={post.body} to={to} />}
      <div className="post-foot">
        <Link to={to}>View post</Link>
        <ShareButton path={to} title={post.location || `${author.display_name} on RELLO`} />
      </div>
    </article>
  )
}

// Three lines on the board, with "See more" only when something is cut off.
function Excerpt({ text, to }) {
  const ref = useRef(null)
  const [cut, setCut] = useState(false)

  useLayoutEffect(() => {
    const element = ref.current
    const measure = () => setCut(element.scrollHeight > element.clientHeight + 1)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [text])

  return (
    <>
      <p className="post-text clamp" ref={ref}>
        {text}
      </p>
      {cut && (
        <Link className="see-more" to={to}>
          See more
        </Link>
      )}
    </>
  )
}
