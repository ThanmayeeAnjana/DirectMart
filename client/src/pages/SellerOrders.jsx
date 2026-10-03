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
    <main className="seller-page">
      <div className="seller-container">

        <header className="seller-header">
          <div>
            <span className="seller-eyebrow">
              SELLER CENTER
            </span>

            <h1>Seller Orders</h1>

            <p>
              Manage orders containing your products and
              keep buyers updated.
            </p>
          </div>

          <div className="seller-order-count">
            <strong>{orders.length}</strong>
            <span>
              {orders.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>
        </header>

        {orders.length === 0 ? (
          <section className="seller-card seller-orders-empty">
            <div className="seller-orders-empty-icon">
              📦
            </div>

            <span className="seller-eyebrow">
              ORDER MANAGEMENT
            </span>

            <h2>No orders yet</h2>

            <p>
              Orders from buyers containing your products
              will appear here.
            </p>
          </section>
        ) : (
          <div className="seller-orders-list">
            {orders.map((order) => {
              const currentStatus =
                STATUS_FLOW.indexOf(order.status);

              return (
                <article
                  className="seller-order-card"
                  key={order._id}
                >

                  <div className="seller-order-top">
                    <div>
                      <span className="seller-order-label">
                        ORDER
                      </span>

                      <h2>
                        #{order._id.slice(-6).toUpperCase()}
                      </h2>
                    </div>

                    <span
                      className={`seller-order-status status-${order.status}`}
                    >
                      <span></span>
                      {order.status}
                    </span>
                  </div>

                  <div className="seller-order-summary">
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

                  <section className="seller-order-products">
                    <div className="seller-section-heading">
                      <h3>Products in this order</h3>
                    </div>

                    {order.items.map((item, index) => (
                      <div
                        className="seller-order-product"
                        key={index}
                      >
                        <div className="seller-order-product-icon">
                          🛍️
                        </div>

                        <div className="seller-order-product-info">
                          <strong>{item.name}</strong>

                          <span>
                            ₹{item.price} × {item.quantity}
                          </span>
                        </div>

                        <strong className="seller-order-product-total">
                          ₹{item.price * item.quantity}
                        </strong>
                      </div>
                    ))}
                  </section>

                  <section className="seller-order-progress">
                    <div className="seller-section-heading">
                      <h3>Order Progress</h3>
                    </div>

                    <div className="seller-progress">
                      {STATUS_FLOW.map((status, index) => {
                        const completed =
                          index <= currentStatus;

                        return (
                          <div
                            className={`seller-progress-step ${
                              completed
                                ? 'seller-progress-completed'
                                : ''
                            }`}
                            key={status}
                          >
                            <div className="seller-progress-dot">
                              {completed &&
                                index < currentStatus &&
                                '✓'}
                            </div>

                            <span>{status}</span>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  <div className="seller-order-action">
                    <div>
                      <span>Update Order Status</span>

                      <small>
                        Keep the buyer informed about
                        their order.
                      </small>
                    </div>

                    <select
                      className="status-select"
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                    >
                      {STATUS_FLOW.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status.charAt(0).toUpperCase() +
                            status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                </article>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}