import { useEffect, useState } from 'react';
import api from '../api/axios';
import './Seller.css';

const STATUS_FLOW = [
  'placed',
  'packed',
  'shipped',
  'delivered',
];

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/seller').then((res) => {
      setOrders(res.data);
    });
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/orders/${id}/status`, {
        status,
      });

      setOrders(
        orders.map((o) =>
          o._id === id ? res.data : o
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
        'Failed to update order status'
      );
    }
  };

  return (
    <div className="seller-page">
      <div className="seller-container">

        <div className="seller-header">
          <div>
            <h2>Seller Orders</h2>
            <p>Manage orders containing your products.</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="seller-card empty-state">
            <h3>No orders yet</h3>
            <p>Orders from buyers will appear here.</p>
          </div>
        ) : (
          orders.map((o) => (
            <div className="order-card" key={o._id}>

              <div className="order-header">
                <div>
                  <strong>Order #{o._id.slice(-6)}</strong>
                </div>

                <span className="order-status">
                  {o.status}
                </span>
              </div>

              <p className="order-total">
                Total: ₹{o.totalAmount}
              </p>

              <ul className="order-items">
                {o.items.map((i, idx) => (
                  <li key={idx}>
                    {i.name} × {i.quantity}
                  </li>
                ))}
              </ul>

              <select
                className="status-select"
                value={o.status}
                onChange={(e) =>
                  updateStatus(o._id, e.target.value)
                }
              >
                {STATUS_FLOW.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

            </div>
          ))
        )}

      </div>
    </div>
  );
}