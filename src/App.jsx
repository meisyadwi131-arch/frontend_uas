import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };
    fetchProducts();
  }, []);

  const handleCheckout = async (product) => {
    try {
      const orderData = {
        customer_name: "Customer Walk-in",
        customer_phone: "08111222333",
        customer_address: "Jl. Test No. 123",
        total_amount: product.price,
        items: [{
          product_id: product.id,
          name: product.name,
          quantity: 1,
          price: product.price
        }]
      };
      const response = await axios.post(`${API_URL}/orders/checkout`, orderData);
      if(response.data.whatsapp_link) {
        window.open(response.data.whatsapp_link, '_blank');
      }
    } catch (error) {
      alert('Checkout failed!');
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">KICKS & CO.</Link>
          <div className="nav-links">
            <Link to="/">Shop</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </div>
      </nav>
      
      <section className="hero">
        <div className="container">
          <h1 className="animate-fade-in">Step Up Your <span className="text-gradient">Style Game</span></h1>
          <p className="animate-fade-in" style={{animationDelay: '0.1s'}}>Discover the most premium selection of exclusive sneakers and streetwear.</p>
        </div>
      </section>

      <section className="container products-grid">
        {products.map((p, index) => (
          <div key={p.id} className="product-card animate-fade-in" style={{animationDelay: `${0.2 + (index * 0.1)}s`}}>
            <img src={p.image_url || 'https://via.placeholder.com/300'} alt={p.name} className="product-image"/>
            <div className="product-info">
              <div className="product-category">{p.category_name || 'Category'}</div>
              <h3 className="product-name">{p.name}</h3>
              <div className="product-price">Rp {Number(p.price).toLocaleString('id-ID')}</div>
              <button 
                onClick={() => handleCheckout(p)} 
                className="btn btn-primary" 
                style={{width: '100%', marginTop: '16px'}}>
                Checkout Now
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

const Admin = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 style={{marginBottom: '32px'}}>Kicks Admin</h2>
        <a href="#" className="active">Products</a>
        <a href="#">Orders</a>
      </aside>
      <main className="dashboard-content">
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '32px'}}>
          <h2>Products Management</h2>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>Rp {Number(p.price).toLocaleString('id-ID')}</td>
                <td>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
