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
  const [error, setError] = useState('');

  useEffect(() => {
    setPage(1);
  }, [domainKey]);

  useEffect(() => {
    setLoading(true);
    setError('');

    api
      .get('/products', {
        params: {
          domain: domainKey,
          search: search.trim(),
          page,
        },
      })
      .then((res) => {
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => {
        console.error(err);
        setProducts([]);
        setTotalPages(1);
        setError('Unable to load products. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
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

  const domainName =
    domainKey === 'pottery'
      ? 'Pottery & Arts'
      : domainKey
          ?.charAt(0)
          .toUpperCase() + domainKey?.slice(1);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2>{domainName} Products</h2>

        <p style={styles.subtitle}>
          Browse products from local producers.
        </p>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearchChange}
          style={styles.search}
        />
      </div>

      {loading && (
        <p style={styles.message}>
          Loading products...
        </p>
      )}

      {error && (
        <p style={styles.error}>
          {error}
        </p>
      )}

      {!loading && !error && products.length === 0 && (
        <p style={styles.message}>
          No products found in this domain yet.
        </p>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div style={styles.grid}>
            {products.map((product) => {
              const productId = product.id || product._id;

              return (
                <Link
                  key={productId}
                  to={`/product/${productId}`}
                  style={styles.card}
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={styles.image}
                    />
                  ) : (
                    <div style={styles.noImage}>
                      No Image
                    </div>
                  )}

                  <div style={styles.cardContent}>
                    <h3 style={styles.productName}>
                      {product.name}
                    </h3>

                    <p style={styles.price}>
                      ₹{product.price}
                    </p>

                    {product.description && (
                      <p style={styles.description}>
                        {product.description}
                      </p>
                    )}

                    <p style={styles.stock}>
                      {product.stock > 0
                        ? `${product.stock} available`
                        : 'Out of stock'}
                    </p>

                    <span style={styles.viewButton}>
                      View Product
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div style={styles.pagination}>
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
        </>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },

  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },

  subtitle: {
    color: '#666',
    marginBottom: '1.5rem',
  },

  search: {
    width: '100%',
    maxWidth: '400px',
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '1rem',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1.5rem',
  },

  card: {
    border: '1px solid #ddd',
    borderRadius: '12px',
    overflow: 'hidden',
    textDecoration: 'none',
    color: '#222',
    backgroundColor: '#fff',
  },

  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    display: 'block',
  },

  noImage: {
    width: '100%',
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f3f3',
    color: '#777',
  },

  cardContent: {
    padding: '1rem',
  },

  productName: {
    margin: '0 0 0.5rem',
  },

  price: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    margin: '0.5rem 0',
  },

  description: {
    color: '#666',
    fontSize: '0.9rem',
    minHeight: '40px',
  },

  stock: {
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },

  viewButton: {
    display: 'inline-block',
    padding: '0.6rem 1rem',
    borderRadius: '6px',
    backgroundColor: '#222',
    color: '#fff',
  },

  message: {
    textAlign: 'center',
    padding: '2rem',
  },

  error: {
    textAlign: 'center',
    padding: '1rem',
    color: 'red',
  },

  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem',
  },
};