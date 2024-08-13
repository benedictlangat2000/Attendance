import React, { useState } from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
      <div className='p-3 rounded w-25 border loginForm'>
        <div className='text-warning'>
          {error && error}
        </div>
        <h2>Login Page</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="email"><strong>Email:</strong></label>
            <input type="email" name='email' autoComplete='off' placeholder='Enter Email'
              value={values.email} onChange={handleChange} className='form-control rounded-0' required/>
          </div>
          <div className='mb-3'> 
            <label htmlFor="password"><strong>Password:</strong></label>
            <input type="password" name='password' placeholder='Enter Password'
              value={values.password} onChange={handleChange} className='form-control rounded-0' required/>
          </div>
          <button className='btn btn-success w-100 rounded-0 mb-2' disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
          <div className='mb-1'> 
            <input type="checkbox" name="tick" id="tick" className='me-2'/>
            <label htmlFor="tick">You agree with terms & conditions</label>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;
