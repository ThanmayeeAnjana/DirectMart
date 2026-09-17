import { Link } from 'react-router-dom';

const DOMAINS = [
  { key: 'farming', label: 'Farming' },
  { key: 'fishing', label: 'Fishing' },
  { key: 'pottery', label: 'Pottery & Arts' },
  { key: 'dairy', label: 'Dairy' },
];

export default function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to DirectMart</h1>
      <p>Buy directly from local producers — no middlemen.</p>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        {DOMAINS.map((d) => (
          <Link
            key={d.key}
            to={`/domain/${d.key}`}
            style={{
              padding: '2rem',
              border: '1px solid #ccc',
              borderRadius: 8,
              minWidth: 150,
              textAlign: 'center',
              textDecoration: 'none',
            }}
          >
            {d.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
