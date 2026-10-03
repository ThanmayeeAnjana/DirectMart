import { useEffect, useState } from 'react';
import api from '../api/axios';
import './MyOrders.css';

const STATUS_FLOW = [
  'placed',
  'packed',
  'shipped',
  'delivered',
];

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
      <main className="orders-page">
        <div className="orders-message">
          <div className="orders-loading-icon">📦</div>
          <h2>Loading your orders</h2>
          <p>Please wait while we fetch your order history.</p>
          <div className="orders-spinner"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="orders-page">
        <div className="orders-message orders-error-message">
          <div className="orders-message-icon">!</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="orders-container">

        <header className="orders-header">
          <div>
            <span className="orders-eyebrow">
              YOUR ACCOUNT
            </span>

            <h1>My Orders</h1>

            <p>
              Track your purchases and view your order history.
            </p>
          </div>

          <div className="orders-count">
            <strong>{orders.length}</strong>
            <span>
              {orders.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>
        </header>

        {orders.length === 0 && (
          <section className="orders-empty">
            <div className="orders-empty-icon">
              📦
            </div>

            <span className="orders-eyebrow">
              NO ORDERS YET
            </span>

            <h2>Your order history is empty</h2>

            <p>
              You haven't placed any orders yet.
              Explore DirectMart and discover products
              from local sellers.
            </p>

            <a
              href="/"
              className="orders-shop-button"
            >
              Start Shopping
              <span>→</span>
            </a>
          </section>
        )}

        {orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => {
              const currentStatus =
                STATUS_FLOW.indexOf(order.status);

              return (
                <article
                  key={order._id}
                  className="order-card"
                >
                  <div className="order-card-header">
                    <div className="order-heading">
                      <span className="order-label">
                        ORDER
                      </span>

                      <h2>
                        #{order._id.slice(-6).toUpperCase()}
                      </h2>
                    </div>

                    <div className="order-status">
                      <span className="status-dot"></span>
                      {order.status}
                    </div>
                  </div>

                  <div className="order-total-bar">
                    <div>
                      <span>Order Total</span>
                      <strong>
                        ₹{order.totalAmount}
                      </strong>
                    </div>

                    <div>
                      <span>Items</span>
                      <strong>
                        {order.items.reduce(
                          (sum, item) =>
                            sum + item.quantity,
                          0
                        )}
                      </strong>
                    </div>
                  </div>

                  <section className="order-items">
                    <div className="section-heading">
                      <h3>Items in this order</h3>
                    </div>

                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="order-item"
                      >
                        <div className="order-item-icon">
                          🛍️
                        </div>

                        <div className="order-item-info">
                          <h4>{item.name}</h4>

                          <p>
                            ₹{item.price} ×{' '}
                            {item.quantity}
                          </p>
                        </div>

                        <strong className="order-item-price">
                          ₹{item.price * item.quantity}
                        </strong>
                      </div>
                    ))}
                  </section>

                  <section className="order-progress">
                    <div className="section-heading">
                      <h3>Order Progress</h3>
                    </div>

                    <div className="progress-track">
                      <div className="progress-line"></div>

                      {STATUS_FLOW.map(
                        (status, index) => {
                          const completed =
                            index <= currentStatus;

                          return (
                            <div
                              key={status}
                              className={`progress-step ${
                                completed
                                  ? 'progress-completed'
                                  : ''
                              }`}
                            >
                              <div className="progress-dot">
                                {completed &&
                                  index <
                                    currentStatus && (
                                    <span>✓</span>
                                  )}
                              </div>

                              <span>
                                {status}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </section>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}