import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

// Add product to localStorage cart
function addToCart(product, quantity) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  const existing = cart.find((i) => i.productId === product._id);

  if (existing) {
    const remainingStock = product.stock - existing.quantity;

    if (remainingStock <= 0) {
      alert(
        `You already have ${existing.quantity} ${product.name} items in your cart. ` +
        `This is the maximum available stock.`
      );
      return false;
    }

    if (quantity > remainingStock) {
      alert(
        `You already have ${existing.quantity} ${product.name} items in your cart. ` +
        `Only ${remainingStock} more can be added.`
      );
      return false;
    }

    existing.quantity += quantity;
    existing.stock = product.stock;
  } else {
    if (quantity > product.stock) {
      alert(`Only ${product.stock} units of ${product.name} are available.`);
      return false;
    }

    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      quantity,
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  return true;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      setProduct(res.data);
    });
  }, [id]);

  if (!product) {
    return <p style={{ padding: '2rem' }}>Loading...</p>;
  }

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);

    if (value < 1) {
      setQuantity(1);
    } else if (value > product.stock) {
      setQuantity(product.stock);
      alert(`Only ${product.stock} units are available.`);
    } else {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      alert('This product is out of stock.');
      return;
    }

    if (quantity > product.stock) {
      alert(`Only ${product.stock} units are available.`);
      return;
    }

    const added = addToCart(product, quantity);

    if (added) {
      alert('Product added to cart.');
    }
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) {
      alert('This product is out of stock.');
      return;
    }

    if (quantity > product.stock) {
      alert(`Only ${product.stock} units are available.`);
      return;
    }

    const added = addToCart(product, quantity);

    if (added) {
      navigate('/cart');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 600 }}>
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            width: '100%',
            maxHeight: 300,
            objectFit: 'cover',
          }}
        />
      )}

      <h2>{product.name}</h2>

      <p>
        ₹{product.price} • {product.stock} in stock
      </p>

      <p>{product.description}</p>

      <p>
        Sold by: {product.sellerId?.name || 'Unknown seller'}
      </p>

      {product.stock > 0 ? (
        <>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={handleQuantityChange}
            style={{
              width: 60,
              marginRight: '1rem',
            }}
          />

          <button onClick={handleAddToCart}>
            Add to Cart
          </button>

          <button
            onClick={handleBuyNow}
            style={{ marginLeft: '0.5rem' }}
          >
            Buy Now
          </button>
        </>
      ) : (
        <p style={{ color: 'red' }}>
          Out of stock
        </p>
      )}
    </div>
  );
}