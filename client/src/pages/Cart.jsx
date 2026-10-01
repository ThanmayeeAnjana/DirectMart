import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1 || Number.isNaN(quantity)) {
      return;
    }

    const updated = cart.map((item) =>
      item.productId === productId
        ? { ...item, quantity }
        : item
    );

    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (productId) => {
    const updated = cart.filter(
      (item) => item.productId !== productId
    );

    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <h2>Your Cart</h2>

        <p style={styles.emptyText}>
          Your cart is empty.
        </p>

        <button
          onClick={() => navigate('/')}
          style={styles.primaryButton}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2>Your Cart</h2>

        <button
          onClick={clearCart}
          style={styles.clearButton}
        >
          Clear Cart
        </button>
      </div>

      <div style={styles.cartContainer}>
        {cart.map((item) => {
          const subtotal = item.price * item.quantity;

          return (
            <div
              key={item.productId}
              style={styles.cartItem}
            >
              <div style={styles.itemInfo}>
                <h3>{item.name}</h3>

                <p style={styles.price}>
                  ₹{item.price} each
                </p>
              </div>

              <div style={styles.quantitySection}>
                <button
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.quantity - 1
                    )
                  }
                  disabled={item.quantity <= 1}
                  style={styles.quantityButton}
                >
                  −
                </button>

                <span style={styles.quantity}>
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.quantity + 1
                    )
                  }
                  style={styles.quantityButton}
                >
                  +
                </button>
              </div>

              <div style={styles.subtotal}>
                <strong>₹{subtotal}</strong>
              </div>

              <button
                onClick={() => removeItem(item.productId)}
                style={styles.removeButton}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <div style={styles.summary}>
        <h3>Order Summary</h3>

        <div style={styles.totalRow}>
          <span>Total</span>
          <strong>₹{total}</strong>
        </div>

        <div style={styles.actions}>
          <button
            onClick={() => navigate('/')}
            style={styles.secondaryButton}
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate('/checkout')}
            style={styles.primaryButton}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '2rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },

  clearButton: {
    padding: '0.6rem 1rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },

  cartContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },

  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '10px',
  },

  itemInfo: {
    flex: 1,
  },

  price: {
    color: '#666',
    margin: '0.25rem 0',
  },

  quantitySection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },

  quantityButton: {
    width: '32px',
    height: '32px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '1.1rem',
  },

  quantity: {
    minWidth: '25px',
    textAlign: 'center',
  },

  subtotal: {
    minWidth: '80px',
    textAlign: 'right',
  },

  removeButton: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#c00',
    cursor: 'pointer',
  },

  summary: {
    marginTop: '2rem',
    padding: '1.5rem',
    border: '1px solid #ddd',
    borderRadius: '10px',
  },

  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.3rem',
    marginTop: '1rem',
  },

  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    marginTop: '1.5rem',
  },

  primaryButton: {
    padding: '0.75rem 1.2rem',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#222',
    color: '#fff',
    cursor: 'pointer',
  },

  secondaryButton: {
    padding: '0.75rem 1.2rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },

  emptyContainer: {
    padding: '4rem 2rem',
    textAlign: 'center',
  },

  emptyText: {
    color: '#666',
    margin: '1.5rem 0',
  },
};