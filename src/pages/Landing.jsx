import { Link } from 'react-router'
import Logo from '../components/Logo.jsx'

const PILLARS = [
  {
    title: 'Noticeboard',
    text: 'Public conversations, text posts, community updates and thoughtful discussions.',
  },
  {
    title: 'Discover',
    text: 'Visual stories, short-form videos and local content worth knowing about.',
    later: true,
  },
  {
    title: 'Stories',
    text: 'Temporary public moments that bring people and places closer.',
    later: true,
  },
]

const TOPICS = [
  'Safety & Crime',
  'Traffic & Roads',
  'Power & Water',
  'Weather & Flooding',
  'Community Notice',
  'Local Experiences',
]

export default function Landing() {
  return (
    <main className="landing">
      <nav className="landing-nav">
        <Logo />
        <div className="landing-links">
          <a href="#product">Product</a>
          <a href="#discover">Discover</a>
          <a href="#about">About</a>
        </div>
        <div className="nav-actions">
          <Link className="button-link text-button" to="/login">
            Sign in
          </Link>
          <Link className="button-link primary small" to="/signup">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Your community noticeboard</p>
          <h1>
            Your world.
            <br />
            Your people.
            <br />
            <em>Your story.</em>
          </h1>
          <p className="hero-lede">
            Discover what is happening around you. Share what matters. Stay connected to the
            communities that make your world.
          </p>
          <div className="hero-actions">
            <Link className="button-link primary" to="/signup">
              Get Started →
            </Link>
            <Link className="button-link secondary" to="/home">
              Explore RELLO
            </Link>
          </div>
        </div>
        <SamplePage />
      </section>

      <section className="pillars" id="product">
        {PILLARS.map((pillar, i) => (
          <article key={pillar.title}>
            <span>
              0{i + 1}
              {pillar.later && ' · Coming later'}
            </span>
            <h2>{pillar.title}</h2>
            <p>{pillar.text}</p>
          </article>
        ))}
      </section>

      <section className="community-section" id="discover">
        <div>
          <p className="eyebrow">Closer to home</p>
          <h2>
            Information from
            <br />
            the people around you.
          </h2>
        </div>
        <div className="community-grid">
          {TOPICS.map((topic, i) => (
            <div key={topic}>
              <span>0{i + 1}</span>
              <strong>{topic}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <p>Chapter 01 / Connect</p>
        <h2>
          Your community has a story.
          <br />
          <em>Make it heard.</em>
        </h2>
        <Link className="button-link primary" to="/signup">
          Join RELLO →
        </Link>
      </section>

      <footer id="about">
        <Logo />
        <div>
          <a>About</a>
          <a>Privacy</a>
          <a>Terms</a>
          <a>Contact</a>
        </div>
        <small>© 2026 RELLO</small>
      </footer>
    </main>
  )
}

// An illustration of the product. Nothing in it is live data.
function SamplePage() {
  return (
    <div className="hero-product">
      <div className="phone-note">
        <span>Sample page</span>
        <span>Board</span>
      </div>
      <div className="journal-preview">
        <div className="preview-top">
          <span className="preview-logo">R</span>
          <div>
            <strong>Good morning, Adaeze</strong>
            <small>Tuesday, 24 November</small>
          </div>
          <span className="avatar">AO</span>
        </div>
        <div className="preview-tabs">
          <b>Latest</b>
        </div>
        <article className="post">
          <div className="post-author">
            <span className="avatar">AO</span>
            <div className="author-meta">
              <p>
                <strong>Adaeze Okafor</strong> shared a notice
              </p>
              <span className="post-time">12 min ago</span>
            </div>
          </div>
          <div className="post-photo">
            <img
              className="post-image"
              src="/sample/bridge.svg"
              alt="Drawing of a pedestrian bridge over a road"
            />
            <span className="post-tag">Community Notice</span>
          </div>
          <p className="post-place">Herbert Macaulay Way, Yaba</p>
          <p className="post-text">
            The new pedestrian bridge is officially open. Please use the designated crossing and
            give way to other commuters.
          </p>
        </article>
      </div>
    </div>
  )
}
