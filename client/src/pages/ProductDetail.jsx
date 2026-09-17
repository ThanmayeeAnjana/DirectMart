import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

// Very simple cart stored in localStorage for the mini-project version.
// Revisit with a proper DB-backed cart only if you need it to persist across devices.
function addToCart(product, quantity) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find((i) => i.productId === product._id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
    });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: 600 }}>
      {product.imageUrl && <img src={product.imageUrl} alt={product.name} style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }} />}
      <h2>{product.name}</h2>
      <p>₹{product.price} • {product.stock} in stock</p>
      <p>{product.description}</p>
      <p>Sold by: {product.sellerId?.name || 'Unknown seller'}</p>

      <input
        type="number"
        min="1"
        max={product.stock}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        style={{ width: 60, marginRight: '1rem' }}
      />
      <button onClick={() => addToCart(product, quantity)}>Add to Cart</button>
      <button onClick={() => { addToCart(product, quantity); navigate('/cart'); }} style={{ marginLeft: '0.5rem' }}>
        Buy Now
      </button>
    </div>
  );
}
