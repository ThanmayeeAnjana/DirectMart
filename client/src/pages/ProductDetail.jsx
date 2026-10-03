import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './ProductDetail.css';

// Add product to localStorage cart
function addToCart(product, quantity) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  const existing = cart.find(
    (item) => item.productId === product._id
  );

  if (existing) {
    const remainingStock = product.stock - existing.quantity;

    if (remainingStock <= 0) {
      alert(
        `You already have ${existing.quantity} ${product.name} items in your cart. ` +
        `This is the maximum available stock.`
      );
      return false;
    }

    if (quantity > remainingStock) {
      alert(
        `You already have ${existing.quantity} ${product.name} items in your cart. ` +
        `Only ${remainingStock} more can be added.`
      );
      return false;
    }

    existing.quantity += quantity;
    existing.stock = product.stock;
  } else {
    if (quantity > product.stock) {
      alert(
        `Only ${product.stock} units of ${product.name} are available.`
      );
      return false;
    }

    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      quantity,
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  return true;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setQuantity(1);
      })
      .catch((err) => {
        console.error(err);
        setError('Unable to load this product.');
      });
  }, [id]);

  const handleQuantityChange = (value) => {
    const newQuantity = Number(value);

    if (Number.isNaN(newQuantity)) {
      return;
    }

    if (newQuantity < 1) {
      setQuantity(1);
      return;
    }

    if (product && newQuantity > product.stock) {
      setQuantity(product.stock);
      return;
    }

    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) {
      return;
    }

    if (quantity < 1 || quantity > product.stock) {
      setError('Please select a valid quantity.');
      return;
    }

    const wasAdded = addToCart(product, quantity);

    if (wasAdded) {
      setError('');
      setAdded(true);
    }
  };

  const handleBuyNow = () => {
    if (!product || product.stock <= 0) {
      return;
    }

    if (quantity < 1 || quantity > product.stock) {
      setError('Please select a valid quantity.');
      return;
    }

    const wasAdded = addToCart(product, quantity);

    if (wasAdded) {
      navigate('/cart');
    }
  };

  if (error && !product) {
    return (
      <main className="product-detail-page">
        <div className="product-state">
          <div className="product-state-icon">!</div>

          <h2>Unable to load product</h2>

          <p>{error}</p>

          <button
            className="state-back-button"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-detail-page">
        <div className="product-state">
          <div className="product-loading-spinner"></div>

          <h2>Loading product...</h2>

          <p>We're getting the product details for you.</p>
        </div>
      </main>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <main className="product-detail-page">

      <div className="product-detail-container">

        <button
          onClick={() => navigate(-1)}
          className="product-back-button"
        >
          ← Back to products
        </button>

        <div className="product-detail-card">

          {/* Product image */}
          <div className="product-detail-image-section">

            <div className="product-detail-image-wrapper">

              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-detail-image"
                />
              ) : (
                <div className="product-detail-no-image">
                  <span>🛍️</span>
                  <p>No image available</p>
                </div>
              )}

              <span
                className={`detail-stock-badge ${
                  outOfStock
                    ? 'detail-out-stock'
                    : 'detail-in-stock'
                }`}
              >
                {outOfStock
                  ? 'Out of stock'
                  : 'In stock'}
              </span>

            </div>

          </div>

          {/* Product information */}
          <div className="product-detail-info">

            <span className="product-detail-label">
              LOCAL PRODUCER
            </span>

            <h1 className="product-detail-title">
              {product.name}
            </h1>

            <div className="product-detail-price">
              ₹{product.price}
            </div>

            <div className="product-divider"></div>

            <div className="product-detail-description">
              <h3>About this product</h3>

              <p>
                {product.description ||
                  'No description available for this product.'}
              </p>
            </div>

            <div className="product-meta">

              <div className="product-meta-item">
                <span className="meta-icon">📦</span>

                <div>
                  <small>Availability</small>

                  <strong
                    className={
                      outOfStock
                        ? 'meta-out-stock'
                        : 'meta-in-stock'
                    }
                  >
                    {outOfStock
                      ? 'Out of stock'
                      : `${product.stock} available`}
                  </strong>
                </div>
              </div>

              <div className="product-meta-item">
                <span className="meta-icon">👤</span>

                <div>
                  <small>Sold by</small>

                  <strong>
                    {product.sellerId?.name ||
                      'Local Producer'}
                  </strong>
                </div>
              </div>

            </div>

            {!outOfStock && (
              <>

                <div className="quantity-section">

                  <label htmlFor="quantity">
                    Quantity
                  </label>

                  <div className="quantity-controls">

                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(quantity - 1)
                      }
                      disabled={quantity <= 1}
                      className="quantity-button"
                    >
                      −
                    </button>

                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(e.target.value)
                      }
                      className="quantity-input"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(quantity + 1)
                      }
                      disabled={quantity >= product.stock}
                      className="quantity-button"
                    >
                      +
                    </button>

                  </div>

                  <span className="quantity-hint">
                    Maximum {product.stock} available
                  </span>

                </div>

                {error && (
                  <div className="detail-error">
                    {error}
                  </div>
                )}

                {added && (
                  <div className="detail-success">
                    <span>✓</span>
                    Product added to your cart!
                  </div>
                )}

                <div className="product-action-buttons">

                  <button
                    onClick={handleAddToCart}
                    className="add-cart-button"
                  >
                    <span>🛒</span>
                    Add to Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="buy-now-button"
                  >
                    Buy Now
                    <span>→</span>
                  </button>

                </div>

              </>
            )}

            {outOfStock && (
              <button
                disabled
                className="detail-disabled-button"
              >
                Currently unavailable
              </button>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}