import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Checkout.css';

export default function Checkout() {
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const cart = JSON.parse(
    localStorage.getItem('cart') || '[]'
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
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
                razorpay_order_id:
                  response.razorpay_order_id,
                razorpay_payment_id:
                  response.razorpay_payment_id,
                razorpay_signature:
                  response.razorpay_signature,
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
              paymentId:
                response.razorpay_payment_id,
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
          color: '#2f8f46',
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
        console.error(
          'Payment failed:',
          response.error
        );

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
      <main className="checkout-page">
        <div className="checkout-empty">
          <div className="checkout-empty-icon">
            🛒
          </div>

          <span className="checkout-eyebrow">
            CHECKOUT
          </span>

          <h1>Your cart is empty</h1>

          <p>
            Add some products to your cart before
            continuing to checkout.
          </p>

          <button
            onClick={() => navigate('/')}
            className="checkout-primary-button"
          >
            Continue Shopping
            <span>→</span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">

        <div className="checkout-header">
          <div>
            <span className="checkout-eyebrow">
              SECURE CHECKOUT
            </span>

            <h1>Complete Your Order</h1>

            <p>
              Review your order and complete your
              payment securely.
            </p>
          </div>

          <div className="checkout-step">
            <span className="checkout-step-number">
              1
            </span>
            <span>Review & Pay</span>
          </div>
        </div>

        <div className="checkout-layout">

          {/* ORDER SUMMARY */}
          <section className="checkout-card order-summary-card">
            <div className="checkout-card-header">
              <div>
                <span className="card-eyebrow">
                  YOUR ORDER
                </span>

                <h2>Order Summary</h2>
              </div>

              <span className="item-count">
                {totalItems}{' '}
                {totalItems === 1
                  ? 'item'
                  : 'items'}
              </span>
            </div>

            <div className="checkout-items">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="checkout-item"
                >
                  <div className="checkout-item-icon">
                    🛍️
                  </div>

                  <div className="checkout-item-info">
                    <h3>{item.name}</h3>

                    <p>
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>

                  <strong className="checkout-item-total">
                    ₹{item.price * item.quantity}
                  </strong>
                </div>
              ))}
            </div>

            <div className="checkout-summary-lines">
              <div className="checkout-summary-row">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="checkout-summary-row">
                <span>Delivery</span>
                <span className="free-label">
                  FREE
                </span>
              </div>
            </div>

            <div className="checkout-total-row">
              <span>Total Amount</span>
              <strong>₹{total}</strong>
            </div>
          </section>

          {/* PAYMENT */}
          <section className="checkout-card payment-card">
            <div className="checkout-card-header">
              <div>
                <span className="card-eyebrow">
                  PAYMENT
                </span>

                <h2>Secure Payment</h2>
              </div>

              <div className="secure-icon">
                🔒
              </div>
            </div>

            <div className="payment-info">
              <div className="payment-info-icon">
                💳
              </div>

              <div>
                <h3>Razorpay</h3>

                <p>
                  Complete your payment securely
                  using Razorpay test mode.
                </p>
              </div>
            </div>

            <div className="payment-features">
              <div>
                <span>✓</span>
                Secure payment processing
              </div>

              <div>
                <span>✓</span>
                Payment verification
              </div>

              <div>
                <span>✓</span>
                Order confirmation after payment
              </div>
            </div>

            {error && (
              <div className="checkout-error">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            <button
              disabled={placing}
              onClick={handlePlaceOrder}
              className="pay-button"
            >
              {placing ? (
                <>
                  <span className="button-spinner"></span>
                  Opening payment...
                </>
              ) : (
                <>
                  Pay ₹{total}
                  <span>→</span>
                </>
              )}
            </button>

            <button
              disabled={placing}
              onClick={() => navigate('/cart')}
              className="back-cart-button"
            >
              ← Back to Cart
            </button>

            <div className="payment-note">
              <span>🔒</span>

              <p>
                Your payment is processed securely.
                DirectMart does not store your card
                details.
              </p>
            </div>
          </section>
        </div>

        <div className="checkout-trust">
          <div>
            <span>🛡️</span>
            <div>
              <strong>Secure Checkout</strong>
              <small>Your payment is protected</small>
            </div>
          </div>

          <div>
            <span>🚚</span>
            <div>
              <strong>Direct Delivery</strong>
              <small>Products from local sellers</small>
            </div>
          </div>

          <div>
            <span>✓</span>
            <div>
              <strong>Verified Orders</strong>
              <small>Payment verified before confirmation</small>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}