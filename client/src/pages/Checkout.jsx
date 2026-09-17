import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Checkout() {
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      // TODO (Member B): replace this with the real Razorpay/Stripe checkout flow.
      // For now this simulates a successful payment so the order flow can be tested end-to-end.
      const fakePaymentId = `test_payment_${Date.now()}`;

      await api.post('/orders', {
        items: cart.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        totalAmount: total,
        paymentId: fakePaymentId,
      });

      localStorage.removeItem('cart');
      navigate('/my-orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Checkout</h2>
      <p>Total: ₹{total}</p>
      <p style={{ color: '#888' }}>
        Payment gateway integration goes here (Razorpay/Stripe test mode). This button currently
        simulates a successful payment so you can test the order flow before wiring up real
        payments.
      </p>
      <button disabled={placing || cart.length === 0} onClick={handlePlaceOrder}>
        {placing ? 'Placing order...' : 'Place Order'}
      </button>
    </div>
  );
}
