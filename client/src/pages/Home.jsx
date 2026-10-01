import { Link } from 'react-router-dom';

const DOMAINS = [
  {
    key: 'farming',
    label: 'Farming',
    description: 'Fresh farm products from local producers.',
    emoji: '🌾',
  },
  {
    key: 'fishing',
    label: 'Fishing',
    description: 'Fresh fish and products from local fishers.',
    emoji: '🐟',
  },
  {
    key: 'pottery',
    label: 'Pottery & Arts',
    description: 'Handmade pottery and traditional products.',
    emoji: '🏺',
  },
  {
    key: 'dairy',
    label: 'Dairy',
    description: 'Fresh dairy products from local producers.',
    emoji: '🥛',
  },
];

export default function Home() {
  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <h1 style={styles.title}>Welcome to DirectMart</h1>

        <p style={styles.subtitle}>
          Buy directly from local producers — no middlemen.
        </p>

        <p style={styles.description}>
          Discover fresh products and handmade goods from producers in your
          community.
        </p>
      </section>

      <section>
        <h2 style={styles.sectionTitle}>Shop by Domain</h2>

        <div style={styles.domainGrid}>
          {DOMAINS.map((domain) => (
            <Link
              key={domain.key}
              to={`/domain/${domain.key}`}
              style={styles.card}
            >
              <div style={styles.emoji}>{domain.emoji}</div>

              <h3 style={styles.cardTitle}>{domain.label}</h3>

              <p style={styles.cardDescription}>
                {domain.description}
              </p>

              <span style={styles.button}>Explore Products</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },

  hero: {
    textAlign: 'center',
    padding: '3rem 1rem',
  },

  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },

  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
  },

  description: {
    color: '#666',
  },

  sectionTitle: {
    textAlign: 'center',
    marginBottom: '2rem',
  },

  domainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
  },

  card: {
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '2rem',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#222',
    backgroundColor: '#fff',
  },

  emoji: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },

  cardTitle: {
    marginBottom: '0.75rem',
  },

  cardDescription: {
    color: '#666',
    minHeight: '48px',
  },

  button: {
    display: 'inline-block',
    marginTop: '1rem',
    padding: '0.6rem 1rem',
    borderRadius: '6px',
    backgroundColor: '#222',
    color: '#fff',
  },
};