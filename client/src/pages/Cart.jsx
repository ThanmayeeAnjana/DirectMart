import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem('cart') || '[]'
    );

    setCart(savedCart);
  }, []);

  const updateQuantity = (productId, quantity) => {
    const item = cart.find(
      (i) => i.productId === productId
    );

    if (!item) return;

    if (quantity < 1) {
      quantity = 1;
    }

    if (quantity > item.stock) {
      alert(
        `Only ${item.stock} units of ${item.name} are available.`
      );

      quantity = item.stock;
    }

    const updated = cart.map((item) =>
      item.productId === productId
        ? { ...item, quantity }
        : item
    );

    setCart(updated);
    localStorage.setItem(
      'cart',
      JSON.stringify(updated)
    );
  };

  const removeItem = (productId) => {
    const updated = cart.filter(
      (item) => item.productId !== productId
    );

    setCart(updated);
    localStorage.setItem(
      'cart',
      JSON.stringify(updated)
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <span className="cart-eyebrow">
            YOUR SHOPPING CART
          </span>

          <h1>Your cart is empty</h1>

          <p>
            Looks like you haven't added anything yet.
            Explore products from local producers and
            find something you love.
          </p>

          <button
            onClick={() => navigate('/')}
            className="cart-primary-button"
          >
            Start Shopping
            <span>→</span>
          </button>

        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">

      <div className="cart-container">

        {/* Header */}
        <div className="cart-header">

          <div>
            <span className="cart-eyebrow">
              YOUR SHOPPING CART
            </span>

            <h1>Your Cart</h1>

            <p>
              Review your items before checkout.
            </p>
          </div>

          <button
            onClick={clearCart}
            className="clear-cart-button"
          >
            Clear Cart
          </button>

        </div>

        <div className="cart-layout">

          {/* Items */}
          <section className="cart-items-section">

            <div className="cart-items-header">
              <span>
                {totalItems}{' '}
                {totalItems === 1
                  ? 'item'
                  : 'items'}
              </span>

              <span>Subtotal</span>
            </div>

            <div className="cart-items">

              {cart.map((item) => {
                const subtotal =
                  item.price * item.quantity;

                return (
                  <article
                    key={item.productId}
                    className="cart-item"
                  >

                    <div className="cart-item-image">
                      <span>🛍️</span>
                    </div>

                    <div className="cart-item-info">

                      <h2>{item.name}</h2>

                      <p className="cart-item-price">
                        ₹{item.price} each
                      </p>

                      <p className="cart-item-stock">
                        {item.stock} available
                      </p>

                    </div>

                    <div className="cart-item-controls">

                      <span className="cart-quantity-label">
                        Quantity
                      </span>

                      <div className="cart-quantity-controls">

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1
                            )
                          }
                          disabled={
                            item.quantity >=
                            item.stock
                          }
                          aria-label="Increase quantity"
                        >
                          +
                        </button>

                      </div>

                    </div>

                    <div className="cart-item-total">
                      <strong>
                        ₹{subtotal}
                      </strong>

                      <button
                        onClick={() =>
                          removeItem(item.productId)
                        }
                        className="remove-item-button"
                      >
                        Remove
                      </button>
                    </div>

                  </article>
                );
              })}

            </div>

            <button
              onClick={() => navigate('/')}
              className="continue-shopping-link"
            >
              ← Continue Shopping
            </button>

          </section>

          {/* Summary */}
          <aside className="cart-summary">

            <div className="summary-heading">
              <h2>Order Summary</h2>
            </div>

            <div className="summary-row">
              <span>
                Items ({totalItems})
              </span>

              <span>
                ₹{total}
              </span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>

              <span className="free-delivery">
                FREE
              </span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>

              <strong>
                ₹{total}
              </strong>
            </div>

            <button
              onClick={() =>
                navigate('/checkout')
              }
              className="checkout-button"
            >
              Proceed to Checkout
              <span>→</span>
            </button>

            <div className="secure-checkout">
              <span>🔒</span>

              <p>
                Secure checkout
                <br />
                Your order information is protected.
              </p>
            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}