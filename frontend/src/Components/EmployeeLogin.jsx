import React, { useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const EmployeeLogin = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3000/employee/employee_login', values)
      .then(result => {
        if (result.data.loginStatus) {
          localStorage.setItem("valid", true);
          navigate('/employee_dashboard/' + result.data.id);
        } else {
          setError(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className='loginPage'>
      <div className='curve'></div>
      <div className='loginContainer'>
        <div className='p-4 rounded loginForm'>
          <div className='text-danger'>
            {error && error}
          </div>
          <h4 className="text-center text-success">Staff Login </h4>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor="email"><strong>Email:</strong></label>
              <input 
                type="email" 
                name='email' 
                autoComplete='off' 
                placeholder='Enter Email'
                onChange={(e) => setValues({ ...values, email: e.target.value })} 
                required
                className='form-control bg-dark-subtle'/>
            </div>
            <div className='mb-3'>
              <label htmlFor="password"><strong>Password:</strong></label>
              <div className="input-group">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name='password' 
                  placeholder='Enter Password'
                  onChange={(e) => setValues({ ...values, password: e.target.value })} 
                  required
                  className='form-control bg-dark-subtle'/>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button className='btn btn-success w-100 mb-2'>Log in</button>
            <div className='mb-1'>
              <input type="checkbox" name="tick" id="tick" className='me-2'/>
              <label htmlFor="tick">You agree with terms & conditions</label>
            </div>
          </form>
          <div className="mt-3 text-center">
            <span>Don't have an account? </span>
            <Link to="/employee_signup" className="text-success fw-bold" style={{ fontSize: '1.1rem' }}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
