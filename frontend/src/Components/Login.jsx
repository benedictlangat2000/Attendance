import React, { useState } from 'react';
import '../css/style.css';  // Ensure the correct path to your CSS file
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);  // Clear previous errors
    axios.post('http://localhost:3000/auth/adminlogin', values)
      .then(result => {
        setLoading(false);
        if (result.data.loginStatus) {
          localStorage.setItem("valid", true);
          navigate('/dashboard');
        } else {
          setError(result.data.Error);
        }
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
        setError("An error occurred. Please try again.");
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className='loginPage'>
      <div className='curve'></div>
      <div className='loginContainer'>
        <div className='loginForm'>
          {error && <div className='text-danger mb-3'>{error}</div>}
          <h4 className="text-center text-success">Admin Login </h4>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor="email"><strong>Email:</strong></label>
              <input 
                type="email" 
                name='email' 
                autoComplete='off' 
                placeholder='Enter Email'
                value={values.email} 
                onChange={handleChange} 
                className='form-control bg-dark-subtle' 
                required
              />
            </div>
            <div className='mb-3'>
              <label htmlFor="password"><strong>Password:</strong></label>
              <div className="input-group">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name='password' 
                  placeholder='Enter Password'
                  value={values.password} 
                  onChange={handleChange} 
                  className='form-control bg-dark-subtle' 
                  required
                />
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button className='btn btn-success w-100 rounded-0 mb-2' disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
            <div className='mb-1'>
              <input 
                type="checkbox" 
                name="tick" 
                id="tick" 
                className='me-2 text-success'
              />
              <label htmlFor="tick">You agree with terms & conditions</label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
