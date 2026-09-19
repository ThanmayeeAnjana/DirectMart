import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function DomainPage() {
  const { domainKey } = useParams();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [domainKey]);

  useEffect(() => {
    setLoading(true);

    api
      .get('/products', {
        params: {
          domain: domainKey,
          search: search.trim(),
          page,
        },
      })
      .then((res) => {
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.error(err);
        setProducts([]);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, [domainKey, search, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ textTransform: 'capitalize' }}>
        {domainKey} products
      </h2>

      <input
        placeholder="Search products..."
        value={search}
        onChange={handleSearchChange}
        style={{
          padding: '0.5rem',
          marginBottom: '1rem',
          width: '100%',
          maxWidth: 300,
        }}
      />

      {loading && <p>Loading...</p>}

      {!loading && products.length === 0 && (
        <p>No products found in this domain.</p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {products.map((p) => (
          <Link
            key={p.id || p._id}
            to={`/product/${p.id || p._id}`}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: '1rem',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt={p.name}
                style={{
                  width: '100%',
                  height: 120,
                  objectFit: 'cover',
                }}
              />
            )}

            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
            <p>Stock: {p.stock}</p>
          </Link>
        ))}
      </div>

      {!loading && products.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          <button
            onClick={goToPreviousPage}
            disabled={page === 1}
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}