import React, { useState } from 'react';
import './Authentication.css';
import AuthButtons from '../../components/authButtons/AuthButtons';
import { useNavigate } from 'react-router';
const BASE_URL = process.env.REACT_APP_BASE_URL;

function Signup() {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [token, setToken] = useState(null);
  const [errors, setErrors] = useState({});

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });

    const updatedErrors = { ...errors };
    delete updatedErrors[name];
    setErrors(updatedErrors);
  };

  const validateForm = () => {
    const updatedErrors = {};
    if (!signupData.name) {
      updatedErrors.name = 'Name is required';
    }
    if (!signupData.email) {
      updatedErrors.email = 'Email is required';
    } else if (!isValidEmail(signupData.email)) {
      updatedErrors.email = 'Invalid email address';
    }
    if (!signupData.password) {
      updatedErrors.password = 'Password is required';
    }
    if (signupData.password !== signupData.confirmPassword) {
      updatedErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(updatedErrors);
    return Object.keys(updatedErrors).length === 0;
  };

  const isValidEmail = (email) => {
    return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
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
          <AuthButtons current={'Signup'} />
          <form
            style={{ display: 'flex', flexDirection: 'column' }}
            onSubmit={handleSignupSubmit}
          >
            <div className="field-container">
              <label
                htmlFor="name"
                style={{
                  width: '10em',
                  marginRight: '1em',
                  textAlign: 'right',
                }}
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className={`AuthInput ${errors.name ? 'error' : ''}`}
                placeholder={errors.name ? errors.name : 'Name'}
                value={signupData.name}
                onChange={handleSignupChange}
              />
            </div>
            <div className="field-container">
              <label
                htmlFor="email"
                style={{
                  width: '10em',
                  marginRight: '1em',
                  textAlign: 'right',
                }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className={`AuthInput ${errors.email ? 'error' : ''}`}
                placeholder={errors.email ? errors.email : 'Email'}
                value={signupData.email}
                onChange={handleSignupChange}
              />
            </div>
            <div className="field-container">
              <label
                htmlFor="password"
                style={{
                  width: '10em',
                  marginRight: '1em',
                  textAlign: 'right',
                }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className={`AuthInput ${errors.password ? 'error' : ''}`}
                placeholder={errors.password ? errors.password : 'Password'}
                value={signupData.password}
                onChange={handleSignupChange}
              />
            </div>
            <div className="field-container">
              <label
                htmlFor="confirmPassword"
                style={{
                  width: '10em',
                  marginRight: '1em',
                  textAlign: 'right',
                }}
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className={`AuthInput ${errors.confirmPassword ? 'error' : ''}`}
                placeholder={
                  errors.confirmPassword
                    ? errors.confirmPassword
                    : 'Confirm Password'
                }
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
              />
            </div>
            <button className="AuthButton" type="submit">
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
