import { Link, NavLink } from 'react-router'
import { useAuth } from '../auth/AuthContext.js'
import Icon from './Icon.jsx'

// `focused` screens (one post, writing a post) hide the phone's bottom bar.
export default function AppShell({ children, focused = false }) {
  const { user, profile } = useAuth()
  const items = [
    { label: 'Board', icon: 'board', to: '/home' },
    { label: 'New post', icon: 'plus', to: '/create', main: true },
    { label: 'Profile', icon: 'user', to: profile ? `/profile/${profile.handle}` : '/profile' },
  ]

  return (
    <div className={focused ? 'app-shell focused' : 'app-shell'}>
      <aside className="sidebar">
        <Link className="logo-button" to="/" aria-label="RELLO home page">
          <img src="/brand/rello-icon.jpg" alt="" />
        </Link>
        <nav aria-label="Main">
          {items.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={item.main ? 'nav-new' : undefined}
              end
            >
              <Icon name={item.icon} size={item.main ? 26 : 22} />
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
            <h3>About this noticeboard</h3>
          </div>
          <p className="context-note">
            Posts appear newest first. They are written by members of the community and are not
            officially verified.
          </p>
        </section>
      </aside>
    </div>
  )
}
