import { Link } from 'react-router'
import Logo from '../components/Logo.jsx'

// Only what works today. Add to these lists when a new feature goes live.
const STEPS = [
  {
    title: 'See what’s happening',
    text: 'Read the noticeboard without signing in. The newest posts come first.',
  },
  {
    title: 'Post what you see',
    text: 'Sign in with Google, then add a few words, a photo and the place.',
  },
  {
    title: 'Pass it on',
    text: 'Every post has its own link, so you can send it to people who need it.',
  },
]

// `id` matches the topic filter on the board (src/lib/categories.js).
const TOPIC_LINKS = [
  { id: 'safety', name: 'Safety & Crime' },
  { id: 'traffic', name: 'Traffic & Roads' },
  { id: 'power', name: 'Power & Water' },
  { id: 'weather', name: 'Weather & Flooding' },
  { id: 'notice', name: 'Community Notices' },
  { id: 'other', name: 'Everything else' },
]

export default function Landing() {
  return (
    <main className="landing">
      <nav className="landing-nav">
        <Logo />
        <div className="landing-links">
          <a href="#how">How it works</a>
          <a href="#topics">Topics</a>
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
            See what is happening around you, from the people who are there. Share what your
            neighbours need to know.
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
        <SamplePost />
      </section>

      <section className="pillars" id="how" aria-label="How it works">
        {STEPS.map((step, i) => (
          <article key={step.title}>
            <span>0{i + 1}</span>
            <h2>{step.title}</h2>
            <p>{step.text}</p>
          </article>
        ))}
      </section>

      <section className="community-section" id="topics">
        <div>
          <p className="eyebrow">Closer to home</p>
          <h2>
            Information from
            <br />
            the people around you.
          </h2>
        </div>
        <div className="community-grid">
          {TOPIC_LINKS.map((topic) => (
            <Link key={topic.id} to={`/home?topic=${topic.id}`}>
              <strong>{topic.name}</strong>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <h2>
          Your community has a story.
          <br />
          <em>Make it heard.</em>
        </h2>
        <Link className="button-link primary" to="/signup">
          Join RELLO →
        </Link>
      </section>

      <footer>
        <Logo />
        <p>Posts are written by community members and are not officially verified.</p>
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
function SamplePost() {
  return (
    <div className="hero-product">
      <p className="sample-note">Sample post</p>
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
