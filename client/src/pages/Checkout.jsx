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
      // 1. Create Razorpay order on backend
      const { data: razorpayOrder } = await api.post(
        '/payment/create-order',
        {
          amount: total,
        }
      );

      // 2. Configure Razorpay Checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,

        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,

        name: 'DirectMart',
        description: 'DirectMart Test Payment',

        order_id: razorpayOrder.id,

        handler: async function (response) {
          try {
            // 3. Verify payment signature on backend
            const verifyResponse = await api.post(
              '/payment/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (!verifyResponse.data.verified) {
              setError('Payment verification failed.');
              return;
            }

            // 4. Create DirectMart order
            await api.post('/orders', {
              items: cart.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
              totalAmount: total,
              paymentId: response.razorpay_payment_id,
            });

            // 5. Clear cart
            localStorage.removeItem('cart');

            // 6. Go to orders page
            navigate('/my-orders');
          } catch (err) {
            console.error(err);

            setError(
              err.response?.data?.message ||
                'Payment verification/order creation failed.'
            );
          } finally {
            setPlacing(false);
          }
        },

        prefill: {
          name: '',
          email: '',
          contact: '',
        },

        theme: {
          color: '#3399cc',
        },

        modal: {
          ondismiss: function () {
            setPlacing(false);
          },
        },
      };

      // 7. Open Razorpay popup
      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);

        setError(
          response.error?.description ||
            'Payment failed. Please try again.'
        );

        setPlacing(false);
      });

      razorpay.open();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          'Unable to start payment.'
      );

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
            Complete your payment securely using
            Razorpay test mode.
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
              ? 'Opening payment...'
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