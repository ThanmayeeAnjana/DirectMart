import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function addToCart(product, quantity) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  const existing = cart.find(
    (item) => item.productId === product._id
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
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

    addToCart(product, quantity);
    setError('');
    setAdded(true);
  };

  const handleBuyNow = () => {
    if (!product || product.stock <= 0) {
      return;
    }

    if (quantity < 1 || quantity > product.stock) {
      setError('Please select a valid quantity.');
      return;
    }

    addToCart(product, quantity);
    navigate('/cart');
  };

  if (error && !product) {
    return (
      <div style={styles.message}>
        <p style={styles.error}>{error}</p>
        <button onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={styles.message}>
        <p>Loading product...</p>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <div style={styles.page}>
      <button
        onClick={() => navigate(-1)}
        style={styles.backButton}
      >
        ← Back
      </button>

      <div style={styles.productContainer}>
        <div style={styles.imageContainer}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              style={styles.image}
            />
          ) : (
            <div style={styles.noImage}>
              No Image Available
            </div>
          )}
        </div>

        <div style={styles.details}>
          <h1 style={styles.title}>{product.name}</h1>

          <p style={styles.price}>
            ₹{product.price}
          </p>

          <p style={styles.description}>
            {product.description || 'No description available.'}
          </p>

          <p style={styles.stock}>
            {outOfStock
              ? 'Out of stock'
              : `${product.stock} available`}
          </p>

          <p style={styles.seller}>
            Sold by:{' '}
            <strong>
              {product.sellerId?.name || 'Local Producer'}
            </strong>
          </p>

          {!outOfStock && (
            <>
              <div style={styles.quantitySection}>
                <label htmlFor="quantity">
                  Quantity:
                </label>

                <div style={styles.quantityControls}>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(quantity - 1)
                    }
                    disabled={quantity <= 1}
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
                    style={styles.quantityInput}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(quantity + 1)
                    }
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              {error && (
                <p style={styles.error}>
                  {error}
                </p>
              )}

              {added && (
                <p style={styles.success}>
                  Product added to cart!
                </p>
              )}

              <div style={styles.buttons}>
                <button
                  onClick={handleAddToCart}
                  style={styles.cartButton}
                >
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  style={styles.buyButton}
                >
                  Buy Now
                </button>
              </div>
            </>
          )}

          {outOfStock && (
            <button
              disabled
              style={styles.disabledButton}
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '2rem',
    maxWidth: '1100px',
    margin: '0 auto',
  },

  backButton: {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    marginBottom: '1.5rem',
    fontSize: '1rem',
  },

  productContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
  },

  imageContainer: {
    width: '100%',
  },

  image: {
    width: '100%',
    maxHeight: '500px',
    objectFit: 'cover',
    borderRadius: '12px',
  },

  noImage: {
    width: '100%',
    height: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: '12px',
    color: '#777',
  },

  details: {
    padding: '1rem',
  },

  title: {
    marginBottom: '1rem',
  },

  price: {
    fontSize: '1.7rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },

  description: {
    color: '#555',
    lineHeight: 1.6,
  },

  stock: {
    marginTop: '1rem',
    fontWeight: 'bold',
  },

  seller: {
    marginTop: '1rem',
    color: '#555',
  },

  quantitySection: {
    marginTop: '1.5rem',
  },

  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },

  quantityInput: {
    width: '60px',
    padding: '0.5rem',
    textAlign: 'center',
  },

  buttons: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1.5rem',
  },

  cartButton: {
    padding: '0.75rem 1.2rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: '#222',
    color: '#fff',
  },

  buyButton: {
    padding: '0.75rem 1.2rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: '#555',
    color: '#fff',
  },

  disabledButton: {
    padding: '0.75rem 1.2rem',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#ccc',
    color: '#666',
  },

  success: {
    color: 'green',
    marginTop: '1rem',
  },

  error: {
    color: 'red',
    marginTop: '1rem',
  },

  message: {
    padding: '2rem',
    textAlign: 'center',
  },
};