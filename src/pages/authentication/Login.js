import React, { useState } from 'react';
import './Authentication.css';
import AuthButtons from '../../components/authButtons/AuthButtons';
import { useNavigate } from 'react-router';
const BASE_URL = process.env.REACT_APP_BASE_URL;

function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [token, setToken] = useState(null);
  const [errors, setErrors] = useState({});

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });

    const updatedErrors = { ...errors };
    delete updatedErrors[name];
    setErrors(updatedErrors);
  };

  const validateForm = () => {
    const updatedErrors = {};
    if (!loginData.email) {
      updatedErrors.email = 'Email is required';
    } else if (!isValidEmail(loginData.email)) {
      updatedErrors.email = 'Invalid email address';
    }
    if (!loginData.password) {
      updatedErrors.password = 'Password is required';
    }
    setErrors(updatedErrors);
    return Object.keys(updatedErrors).length === 0;
  };

  const isValidEmail = (email) => {
    return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        navigate('/analytics');
      } else {
        alert(data.message);
      }
    }
  };

  return (
    <div className="Authentication">
      <div className="Authentication--container">
        <div className="Authentication--container--content">
          <h2 className="--authLogo">Quizze</h2>
          <AuthButtons current={'Login'} />
          <form
            style={{ display: 'flex', flexDirection: 'column' }}
            onSubmit={handleLoginSubmit}
          >
            <div className="field-container">
              <label
                style={{ width: '8em', marginRight: '1em', textAlign: 'right' }}
                htmlFor=""
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                className={`AuthInput ${errors.email ? 'error' : ''}`}
                placeholder={errors.email ? errors.email : 'Email'}
                value={loginData.email}
                onChange={handleLoginChange}
              />
            </div>
            <div className="field-container">
              <label
                style={{ width: '8em', marginRight: '1em', textAlign: 'right' }}
                htmlFor=""
              >
                Password
              </label>
              <input
                className={`AuthInput ${errors.password ? 'error' : ''}`}
                type="password"
                name="password"
                placeholder={errors.password ? errors.password : 'Password'}
                value={loginData.password}
                onChange={handleLoginChange}
              />
            </div>
            <button className="AuthButton" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
