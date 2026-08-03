import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Login from './pages/Login';
import Register from './pages/Register';
import EventList from './pages/EventList';
import BookingHistory from './pages/BookingHistory';
import AdminPanel from './pages/AdminPanel';

function Navigation({ user, onLogout }) {
  return (
    <nav className="nav">
      <div className="logo"><div className="logo-mark"></div>EVENT<span>Masters</span></div>
      <ul className="nav-links">
        <li>Home</li><li>About</li><li>Service</li><li>Portfolio</li><li>Upcoming Projects</li>
      </ul>
      <div className="nav-actions">
        {user ? (
          <>
            <Link to="/bookings"><button className="btn">My Bookings</button></Link>
            {user.role === 'admin' && <Link to="/admin"><button className="btn">Admin</button></Link>}
            <button className="btn btn-solid" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"><button className="btn">Login</button></Link>
            <Link to="/register"><button className="btn btn-solid">Request Service</button></Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
        } else {
          // Keep role from token, wait for local storage or decode to get name if needed, 
          // usually we just need role and id in frontend
          setUser({ id: decoded.id, role: decoded.role, name: localStorage.getItem('userName') || 'User' });
        }
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userName', userData.name);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Navigation user={user} onLogout={handleLogout} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<EventList user={user} />} />
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/bookings" element={user ? <BookingHistory /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
