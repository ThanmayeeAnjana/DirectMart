import { useEffect, useState } from 'react';
import api from '../api/axios';

const STATUS_FLOW = ['placed', 'packed', 'shipped', 'delivered'];

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/seller').then((res) => setOrders(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    const res = await api.put(`/orders/${id}/status`, { status });
    setOrders(orders.map((o) => (o._id === id ? res.data : o)));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Orders</h2>
      {orders.length === 0 && <p>No orders yet.</p>}
      {orders.map((o) => (
        <div key={o._id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
          <p><strong>Status:</strong> {o.status}</p>
          <p><strong>Total:</strong> ₹{o.totalAmount}</p>
          <ul>
            {o.items.map((i, idx) => <li key={idx}>{i.name} x {i.quantity}</li>)}
          </ul>
          <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
            {STATUS_FLOW.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      ))}
    </div>
  );
}
