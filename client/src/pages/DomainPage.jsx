import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function DomainPage() {
  const { domainKey } = useParams();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get('/products', { params: { domain: domainKey, search } })
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [domainKey, search]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ textTransform: 'capitalize' }}>{domainKey} products</h2>

      <input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '0.5rem', marginBottom: '1rem', width: '100%', maxWidth: 300 }}
      />

      {loading && <p>Loading...</p>}
      {!loading && products.length === 0 && <p>No products found in this domain yet.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {products.map((p) => (
          <Link
            key={p.id || p._id}
            to={`/product/${p.id || p._id}`}
            style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', textDecoration: 'none', color: 'inherit' }}
          >
            {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />}
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
