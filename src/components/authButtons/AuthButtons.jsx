import React, { useEffect, useState } from 'react';
import './AuthButtons.css';
import { useNavigate } from 'react-router';

const AuthButtons = ({ current }) => {
  const navigate = useNavigate();
  const [selectedButton, setSelectedButton] = useState('Signup');
  useEffect(() => {
    setSelectedButton(current);
  }, []);
  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  return (
    <div className="AuthButtons">
      <button
        className={`AuthButton2 ${
          selectedButton === 'Signup' ? 'selected' : ''
        }`}
        onClick={() => {
          handleButtonClick('Signup');
          navigate('/signup');
        }}
      >
        Signup
      </button>
      <button
        className={`AuthButton2 ${
          selectedButton === 'Login' ? 'selected' : ''
        }`}
        onClick={() => {
          handleButtonClick('Login');
          navigate('/login');
        }}
      >
        Login
      </button>
    </div>
  );
};

export default AuthButtons;
