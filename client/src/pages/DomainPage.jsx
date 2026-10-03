import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import './DomainPage.css';

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

  const clearSearch = () => {
    setSearch('');
    setPage(1);
  };

  const domainName =
    domainKey === 'pottery'
      ? 'Pottery & Arts'
      : domainKey
        ? domainKey.charAt(0).toUpperCase() + domainKey.slice(1)
        : 'Marketplace';

  const domainEmoji =
    domainKey === 'farming'
      ? '🌾'
      : domainKey === 'fishing'
        ? '🐟'
        : domainKey === 'pottery'
          ? '🏺'
          : domainKey === 'dairy'
            ? '🥛'
            : '🛍️';

  return (
    <main className="domain-page">

      <section className="domain-hero">
        <div className="domain-hero-pattern"></div>

        <div className="domain-hero-content">
          <div className="domain-icon">
            {domainEmoji}
          </div>

          <span className="domain-eyebrow">
            DIRECT FROM LOCAL PRODUCERS
          </span>

          <h1>{domainName}</h1>

          <p>
            Discover quality products from local producers
            and shop directly from the source.
          </p>
        </div>
      </section>

      <section className="domain-content">

        <div className="domain-toolbar">

          <div className="domain-results-heading">
            <span className="domain-section-label">
              MARKETPLACE
            </span>

            <h2>Explore {domainName}</h2>

            {!loading && !error && (
              <p>
                {products.length} product
                {products.length !== 1 ? 's' : ''} available
              </p>
            )}
          </div>

          <div className="domain-search">
            <span className="search-icon">⌕</span>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

        </div>

        {search && !loading && !error && (
          <div className="search-result-note">
            <span>Searching for</span>
            <strong>"{search}"</strong>
            <button
              type="button"
              onClick={clearSearch}
            >
              Clear
            </button>
          </div>
        )}

        {loading && (
          <div className="domain-state">
            <div className="loading-spinner"></div>

            <h3>Finding products...</h3>

            <p>
              Please wait while we load the latest products.
            </p>
          </div>
        )}

        {error && (
          <div className="domain-state domain-error-state">
            <div className="state-icon">!</div>

            <h3>Something went wrong</h3>

            <p>{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="domain-state">
            <div className="state-icon">🔎</div>

            <span className="empty-state-label">
              NO PRODUCTS FOUND
            </span>

            <h3>No products found</h3>

            <p>
              {search
                ? `We couldn't find any products matching "${search}".`
                : 'There are no products available in this domain yet.'}
            </p>

            {search && (
              <button
                type="button"
                className="clear-results-button"
                onClick={clearSearch}
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div className="product-grid">

              {products.map((product) => {
                const productId = product.id || product._id;
                const isInStock = product.stock > 0;

                return (
                  <Link
                    key={productId}
                    to={`/product/${productId}`}
                    className="product-card"
                  >
                    <div className="product-image-wrapper">

                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="product-image"
                        />
                      ) : (
                        <div className="product-no-image">
                          <span>🛍️</span>
                          <small>No image available</small>
                        </div>
                      )}

                      <span
                        className={`stock-badge ${
                          isInStock
                            ? 'in-stock'
                            : 'out-of-stock'
                        }`}
                      >
                        <span className="stock-dot"></span>

                        {isInStock
                          ? 'In stock'
                          : 'Out of stock'}
                      </span>
                    </div>

                    <div className="product-card-content">

                      <div className="product-domain-tag">
                        {domainName}
                      </div>

                      <h3 className="product-name">
                        {product.name}
                      </h3>

                      <div className="product-price">
                        ₹{product.price}
                      </div>

                      {product.description && (
                        <p className="product-description">
                          {product.description}
                        </p>
                      )}

                      <div className="product-card-footer">

                        <span className="product-stock">
                          {isInStock
                            ? `${product.stock} available`
                            : 'Currently unavailable'}
                        </span>

                        <span className="view-product">
                          View <span>→</span>
                        </span>

                      </div>

                    </div>
                  </Link>
                );
              })}

            </div>

            {totalPages > 1 && (
              <div className="pagination">

                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={page === 1}
                  className="pagination-button"
                >
                  ← Previous
                </button>

                <div className="pagination-info">
                  <span>Page</span>
                  <strong>{page}</strong>
                  <span>of {totalPages}</span>
                </div>

                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={page === totalPages}
                  className="pagination-button"
                >
                  Next →
                </button>

              </div>
            )}
          </>
        )}

      </section>
    </main>
  );
}