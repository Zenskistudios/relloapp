import { Link, NavLink } from 'react-router'
import { useAuth } from '../auth/AuthContext.js'

export default function AppShell({ children }) {
  const { user, profile } = useAuth()
  const items = [
    { label: 'Journal', symbol: '⌂', to: '/home' },
    { label: 'Create', symbol: '+', to: '/create' },
    { label: 'Profile', symbol: '♙', to: profile ? `/profile/${profile.handle}` : '/profile' },
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="logo-button" to="/" aria-label="RELLO home page">
          <img src="/brand/rello-icon.jpg" alt="" />
        </Link>
        <nav>
          {items.map((item) => (
            <NavLink key={item.label} to={item.to} end>
              <span aria-hidden="true">{item.symbol}</span>
              <b>{item.label}</b>
            </NavLink>
          ))}
        </nav>
        {!user && (
          <div className="sidebar-bottom">
            <Link to="/login">
              <b>Sign in</b>
            </Link>
          </div>
        )}
      </aside>
      <main className="main-page">{children}</main>
      <aside className="context">
        <section>
          <div className="section-heading">
            <h3>About this journal</h3>
          </div>
          <p className="context-note">
            Entries appear newest first. They are written by members of the community and are not
            officially verified.
          </p>
        </section>
      </aside>
    </div>
  )
}
