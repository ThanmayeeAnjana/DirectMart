import { Link } from 'react-router-dom';
import './Home.css';

const DOMAINS = [
  {
    key: 'farming',
    label: 'Farming',
    description: 'Fresh farm products directly from local producers.',
    emoji: '🌾',
  },
  {
    key: 'fishing',
    label: 'Fishing',
    description: 'Fresh fish and quality products from local fishers.',
    emoji: '🐟',
  },
  {
    key: 'pottery',
    label: 'Pottery & Arts',
    description: 'Handcrafted pottery and traditional products.',
    emoji: '🏺',
  },
  {
    key: 'dairy',
    label: 'Dairy',
    description: 'Fresh and authentic dairy products from local producers.',
    emoji: '🥛',
  },
];

export default function Home() {
  return (
    <main className="home-page">

      {/* ================= HERO ================= */}
      <section className="hero-section">
        <div className="hero-content">

          <div className="hero-badge">
            <span>🌱</span>
            <span>Supporting Local Producers</span>
          </div>

          <h1 className="hero-title">
            Fresh from the source.
            <span> Direct to you.</span>
          </h1>

          <p className="hero-subtitle">
            Discover fresh products and handmade goods directly from
            local farmers, fishers, artisans and producers.
          </p>

          <div className="hero-actions">
            <a href="#domains" className="hero-primary-button">
              Explore Marketplace
              <span>→</span>
            </a>

            <Link to="/signup" className="hero-secondary-button">
              Become a Member
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>4+</strong>
              <span>Local Domains</span>
            </div>

            <div className="stat-divider"></div>

            <div className="hero-stat">
              <strong>100%</strong>
              <span>Direct Sourcing</span>
            </div>

            <div className="stat-divider"></div>

            <div className="hero-stat">
              <strong>Local</strong>
              <span>Producers</span>
            </div>
          </div>

        </div>
      </section>


      {/* ================= DOMAIN SECTION ================= */}
      <section className="domains-section" id="domains">

        <div className="section-heading">
          <div className="section-label">
            EXPLORE
          </div>

          <h2>
            Shop by Domain
          </h2>

          <p>
            Find authentic products from producers in your community.
          </p>
        </div>


        <div className="domain-grid">

          {DOMAINS.map((domain, index) => (
            <Link
              key={domain.key}
              to={`/domain/${domain.key}`}
              className={`domain-card domain-card-${index + 1}`}
            >

              <div className="domain-card-top">
                <div className="domain-icon">
                  {domain.emoji}
                </div>

                <span className="domain-arrow">
                  ↗
                </span>
              </div>

              <div className="domain-card-content">

                <h3>
                  {domain.label}
                </h3>

                <p>
                  {domain.description}
                </p>

                <span className="domain-link">
                  Explore Products
                  <span>→</span>
                </span>

              </div>

            </Link>
          ))}

        </div>
      </section>


      {/* ================= WHY DIRECTMART ================= */}
      <section className="why-section">

        <div className="why-content">

          <div className="why-text">

            <div className="section-label">
              WHY DIRECTMART
            </div>

            <h2>
              From local hands
              <br />
              <span>to your home.</span>
            </h2>

            <p>
              DirectMart connects you directly with local producers,
              helping you discover quality products while supporting
              the people who make and grow them.
            </p>

            <Link to="/signup" className="why-button">
              Join DirectMart
              <span>→</span>
            </Link>

          </div>


          <div className="benefits-grid">

            <div className="benefit-card">
              <div className="benefit-icon">
                🌱
              </div>

              <h3>
                Local Producers
              </h3>

              <p>
                Discover products created by producers in your community.
              </p>
            </div>


            <div className="benefit-card">
              <div className="benefit-icon">
                🤝
              </div>

              <h3>
                Direct Connection
              </h3>

              <p>
                Buy directly from producers without unnecessary middlemen.
              </p>
            </div>


            <div className="benefit-card">
              <div className="benefit-icon">
                ✨
              </div>

              <h3>
                Authentic Products
              </h3>

              <p>
                Find fresh, handmade and locally produced goods.
              </p>
            </div>


            <div className="benefit-card">
              <div className="benefit-icon">
                🏡
              </div>

              <h3>
                Community First
              </h3>

              <p>
                Support local communities by choosing local products.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="home-cta">

        <div className="cta-content">

          <div className="cta-icon">
            🌿
          </div>

          <h2>
            Ready to discover something local?
          </h2>

          <p>
            Explore products from farmers, fishers, artisans and
            dairy producers around you.
          </p>

          <Link to="/signup" className="cta-button">
            Start Exploring
            <span>→</span>
          </Link>

        </div>

      </section>

    </main>
  );
}