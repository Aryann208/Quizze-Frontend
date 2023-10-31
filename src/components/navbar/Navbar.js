import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router';
const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  if (!token) {
    return <p></p>;
  }
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <div className="navbar">
      <div className="navbar--content">
        <h2 className="navbar--logo">Quizze</h2>
        <div className="navbar--options">
          <span
            onClick={() => navigate('/analytics')}
            className="navbar--option"
          >
            Dashboard
          </span>
          <span onClick={() => navigate('/')} className="navbar--option">
            Analytics
          </span>
          <span
            onClick={() => navigate('/quiz-creation')}
            className="navbar--option"
          >
            Create Quiz
          </span>
        </div>
        <div style={{ position: 'relative' }}>
          <p className="navbar--logout-border"></p>
          <span onClick={handleLogout} className="navbar--logout">
            Logout
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
