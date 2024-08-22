import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const EmployeeSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branchId, setBranchId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [location, setLocation] = useState("");
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/auth/branch")
      .then((result) => {
        if (result.data.Status) {
          setBranches(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    axios.get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategories(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSignup = (e) => {
    e.preventDefault();

    axios.post("http://localhost:3000/employee/employee_signup", {
      name,
      email,
      password,
      branchId,
      categoryId,
      location,
    })
    .then((result) => {
      if (result.data.Status) {
        setSuccessMessage(result.data.Message);
        setTimeout(() => {
          navigate('/employee_login');
        }, 2000);
      } else {
        alert(result.data.Message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  };

  return (
    <div className="d-flex pt-3 vh-100">
      <div className="d-flex flex-column justify-content-center align-items-start w-25 p-3 ms-5">
        <h4 className="mb-2">Already have an account?</h4>
        <Link to="/employee_login" className="btn btn-link text-success fw-500">Login</Link>
      </div>
      <div className="d-flex flex-column w-50">
        <div
          className="p-4 rounded border w-100 green-border shadow"
          style={{ fontSize: '0.7rem', fontWeight: 'bold' }}
        >
          <h5 className="text-center text-success mb-2" style={{ fontSize: '1.2rem' }}>Employee Signup</h5>
          {successMessage && (
            <div className="alert alert-success">
              {successMessage}
            </div>
          )}
          <form className="row g-2" onSubmit={handleSignup}>
            <div className="col-12">
              <label htmlFor="inputName" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="inputName"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ padding: '0.3rem', backgroundColor: '#f0f0f0', height: '1.8rem' }}
              />
            </div>
            <div className="col-12">
              <label htmlFor="inputEmail" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="inputEmail"
                placeholder="Enter Email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: '0.3rem', backgroundColor: '#f0f0f0', height: '1.8rem' }}
              />
            </div>
            <div className="col-12">
              <label htmlFor="inputPassword" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="inputPassword"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ padding: '0.3rem', backgroundColor: '#f0f0f0', height: '1.8rem' }}
              />
            </div>
            <div className="col-12">
              <label htmlFor="branch" className="form-label">Branch</label>
              <select
                name="branch"
                id="branch"
                className="form-select"
                style={{ color: '#000', backgroundColor: '#f0f0f0', padding: '0.3rem', height: '2.1rem' }}
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                required
              >
                <option value="" disabled>Select Branch</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.branch}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                name="category"
                id="category"
                className="form-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                style={{ padding: '0.3rem', backgroundColor: '#f0f0f0', height: '2.1rem' }}
              >
                <option value="" disabled>Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label htmlFor="inputLocation" className="form-label">Location (Nearest Town)</label>
              <input
                type="text"
                className="form-control"
                id="inputLocation"
                placeholder="Enter Location"
                autoComplete="off"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                style={{ padding: '0.3rem', backgroundColor: '#f0f0f0', height: '1.8rem' }}
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-success w-100" style={{ padding: '0.5rem' }}>Sign Up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSignup;
