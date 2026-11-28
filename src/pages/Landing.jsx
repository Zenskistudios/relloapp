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

// Free to use under the Unsplash License: https://unsplash.com/license
const SAMPLE_PHOTO = {
  src: 'https://images.unsplash.com/photo-1548013759-dbf491716275',
  page: 'https://unsplash.com/photos/vehicles-on-road-during-daytime-fjefNIs0230',
  by: 'Ayoola Salako',
}

// An illustration of the product. The post is made up; nothing in it is live.
function SamplePage() {
  return (
    <div className="hero-product">
      <div className="phone-note">
        <span>Sample page</span>
        <span>Board</span>
      </div>
      <div className="journal-preview">
        <article className="post">
          <div className="post-author">
            <span className="avatar">AO</span>
            <div className="author-meta">
              <p>
                <strong>Adaeze Okafor</strong> posted a traffic update
              </p>
              <span className="post-time">12 min ago</span>
            </div>
          </div>
          <div className="post-photo">
            <img
              className="post-image"
              src={`${SAMPLE_PHOTO.src}?auto=format&fit=crop&w=1200&h=600&q=75`}
              alt="Vehicles and a tricycle on a road in Lagos"
              width="1200"
              height="600"
            />
            <span className="post-tag">Traffic / Roads</span>
          </div>
          <p className="photo-credit">
            Photo:{' '}
            <a href={SAMPLE_PHOTO.page} target="_blank" rel="noreferrer">
              {SAMPLE_PHOTO.by} on Unsplash
            </a>
          </p>
          <p className="post-place">Lagos</p>
          <p className="post-text">
            Traffic is moving slowly. If you are heading out, give yourself extra time.
          </p>
        </article>
      </div>
    </div>
  )
}
