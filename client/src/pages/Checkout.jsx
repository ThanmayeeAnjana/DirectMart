import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Checkout() {
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  const total = cart.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setPlacing(true);

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
              alert('Payment verification failed');
              return;
            }

            // 4. Create DirectMart order
            await api.post('/orders', {
              items: cart.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
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
            alert(
              err.response?.data?.message ||
                'Payment verification/order creation failed'
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
        alert(
          response.error?.description ||
            'Payment failed. Please try again.'
        );
        setPlacing(false);
      });

      razorpay.open();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          'Unable to start payment'
      );

      setPlacing(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Checkout</h2>

      <p>Total: ₹{total}</p>

      <p style={{ color: '#888' }}>
        Complete your payment using Razorpay test mode.
      </p>

      <button
        disabled={placing || cart.length === 0}
        onClick={handlePlaceOrder}
      >
        {placing ? 'Opening payment...' : 'Pay Now'}
      </button>
    </div>
  );
}