import { useEffect, useState } from 'react';
import api from '../api/axios';

const STATUS_FLOW = ['placed', 'packed', 'shipped', 'delivered'];

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders/mine')
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError('Unable to load your orders.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={styles.message}>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.message}>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h2>My Orders</h2>

      {orders.length === 0 && (
        <div style={styles.empty}>
          <p>You haven't placed any orders yet.</p>
        </div>
      )}

      {orders.length > 0 && (
        <div style={styles.orders}>
          {orders.map((order) => {
            const currentStatus =
              STATUS_FLOW.indexOf(order.status);

            return (
              <div
                key={order._id}
                style={styles.orderCard}
              >
                <div style={styles.orderHeader}>
                  <div>
                    <h3>Order #{order._id.slice(-6)}</h3>

                    <p style={styles.orderDate}>
                      Order total: ₹{order.totalAmount}
                    </p>
                  </div>

                  <span style={styles.status}>
                    {order.status}
                  </span>
                </div>

                <div style={styles.items}>
                  <h4>Items</h4>

                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      style={styles.item}
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>

                      <span>
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={styles.progress}>
                  {STATUS_FLOW.map((status, index) => (
                    <div
                      key={status}
                      style={{
                        ...styles.progressStep,
                        fontWeight:
                          index <= currentStatus
                            ? 'bold'
                            : 'normal',
                      }}
                    >
                      <div
                        style={{
                          ...styles.dot,
                          opacity:
                            index <= currentStatus
                              ? 1
                              : 0.3,
                        }}
                      />

                      <span>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: '2rem',
    maxWidth: '900px',
    margin: '0 auto',
  },

  orders: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginTop: '1.5rem',
  },

  orderCard: {
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '1.5rem',
  },

  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    borderBottom: '1px solid #eee',
    paddingBottom: '1rem',
  },

  orderDate: {
    color: '#666',
    margin: 0,
  },

  status: {
    padding: '0.5rem 0.8rem',
    borderRadius: '20px',
    backgroundColor: '#eee',
    textTransform: 'capitalize',
  },

  items: {
    marginTop: '1rem',
  },

  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.7rem 0',
    borderBottom: '1px solid #f0f0f0',
  },

  progress: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid #eee',
  },

  progressStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.4rem',
    textTransform: 'capitalize',
    fontSize: '0.85rem',
  },

  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#222',
  },

  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
  },

  message: {
    padding: '3rem',
    textAlign: 'center',
  },

  error: {
    color: 'red',
  },
};