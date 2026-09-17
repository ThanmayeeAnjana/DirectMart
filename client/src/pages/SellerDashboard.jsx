import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products/seller/mine').then((res) => setProducts(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    setProducts(products.filter((p) => p._id !== id));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Seller Dashboard</h2>
      <Link to="/seller/add-product">+ Add Product</Link>
      <Link to="/seller/orders" style={{ marginLeft: '1rem' }}>View Orders</Link>

      <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>Name</th><th>Price</th><th>Stock</th><th>Domain</th><th></th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>{p.domain}</td>
              <td><button onClick={() => handleDelete(p._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
