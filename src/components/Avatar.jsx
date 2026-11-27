import { initials } from '../lib/format.js'

export default function Avatar({ name, className = 'avatar' }) {
  return (
    <span className={className} aria-hidden="true">
      {initials(name)}
    </span>
  )
}
