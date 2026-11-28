import { Link } from 'react-router'
import { timeAgo } from '../lib/format.js'
import { photoUrl } from '../lib/photos.js'
import Avatar from './Avatar.jsx'

// Like, comment, Confirmed and bookmark buttons return once they save for real.
export default function PostCard({ post }) {
  const { author } = post
  return (
    <article className="post">
      <div className="post-author">
        <Avatar name={author.display_name} />
        <div className="author-meta">
          <strong>
            <Link to={`/profile/${author.handle}`}>{author.display_name}</Link>
          </strong>
          <span>
            @{author.handle} · <time dateTime={post.created_at}>{timeAgo(post.created_at)}</time>
          </span>
        </div>
      </div>
      <div className="post-label">
        <span>{post.category}</span>
        {post.location && <span>⌖ {post.location}</span>}
      </div>
      {post.body && <p className="post-text">{post.body}</p>}
      {post.image_path && (
        <a href={photoUrl(post.image_path)} target="_blank" rel="noreferrer">
          <img
            className="post-image"
            src={photoUrl(post.image_path)}
            alt={`Photo shared by ${author.display_name}. Open full size.`}
            loading="lazy"
          />
        </a>
      )}
    </article>
  )
}
