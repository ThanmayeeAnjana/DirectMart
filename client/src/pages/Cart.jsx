import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const updateQuantity = (productId, quantity) => {
    const updated = cart.map((i) => (i.productId === productId ? { ...i, quantity } : i));
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (productId) => {
    const updated = cart.filter((i) => i.productId !== productId);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Cart</h2>
      {cart.length === 0 && <p>Cart is empty.</p>}

      {cart.map((item) => (
        <div key={item.productId} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ flex: 1 }}>{item.name}</span>
          <span>₹{item.price}</span>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
            style={{ width: 60 }}
          />
          <button onClick={() => removeItem(item.productId)}>Remove</button>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <h3>Total: ₹{total}</h3>
          <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
        </>
      )}
    </div>
  );
}
