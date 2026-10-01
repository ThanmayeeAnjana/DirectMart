import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Checkout() {
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setPlacing(true);
    setError('');

    try {
      // Temporary payment ID.
      // Member B will replace this with Razorpay integration.
      const fakePaymentId = `test_payment_${Date.now()}`;

      await api.post('/orders', {
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        totalAmount: total,
        paymentId: fakePaymentId,
      });

      localStorage.removeItem('cart');

      navigate('/my-orders');
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          'Failed to place order. Please try again.'
      );
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <h2>Checkout</h2>

        <p>Your cart is empty.</p>

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
      <h2>Checkout</h2>

      <div style={styles.content}>
        <section style={styles.orderSection}>
          <h3>Order Summary</h3>

          {cart.map((item) => (
            <div
              key={item.productId}
              style={styles.item}
            >
              <div>
                <strong>{item.name}</strong>

                <p style={styles.itemDetails}>
                  ₹{item.price} × {item.quantity}
                </p>
              </div>

              <strong>
                ₹{item.price * item.quantity}
              </strong>
            </div>
          ))}

          <div style={styles.totalRow}>
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>
        </section>

        <section style={styles.paymentSection}>
          <h3>Payment</h3>

          <p style={styles.paymentText}>
            Secure payment will be processed through the payment
            gateway.
          </p>

          {error && (
            <p style={styles.error}>
              {error}
            </p>
          )}

          <button
            disabled={placing}
            onClick={handlePlaceOrder}
            style={styles.primaryButton}
          >
            {placing
              ? 'Processing...'
              : `Pay ₹${total}`}
          </button>

          <button
            disabled={placing}
            onClick={() => navigate('/cart')}
            style={styles.secondaryButton}
          >
            Back to Cart
          </button>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '2rem',
    maxWidth: '900px',
    margin: '0 auto',
  },

  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    marginTop: '1.5rem',
  },

  orderSection: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '1.5rem',
  },

  paymentSection: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '1.5rem',
  },

  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0',
    borderBottom: '1px solid #eee',
  },

  itemDetails: {
    margin: '0.3rem 0 0',
    color: '#666',
  },

  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.3rem',
    marginTop: '1.5rem',
  },

  paymentText: {
    color: '#666',
    lineHeight: 1.5,
    marginBottom: '1.5rem',
  },

  primaryButton: {
    width: '100%',
    padding: '0.8rem',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#222',
    color: '#fff',
    cursor: 'pointer',
    marginBottom: '0.75rem',
  },

  secondaryButton: {
    width: '100%',
    padding: '0.8rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },

  error: {
    color: 'red',
    marginBottom: '1rem',
  },

  emptyContainer: {
    padding: '4rem 2rem',
    textAlign: 'center',
  },
};