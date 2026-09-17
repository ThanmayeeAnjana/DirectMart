import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/mine').then((res) => setOrders(res.data));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Orders</h2>
      {orders.length === 0 && <p>No orders yet.</p>}
      {orders.map((o) => (
        <div key={o._id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
          <p><strong>Status:</strong> {o.status}</p>
          <p><strong>Total:</strong> ₹{o.totalAmount}</p>
          <ul>
            {o.items.map((i, idx) => (
              <li key={idx}>{i.name} x {i.quantity}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
