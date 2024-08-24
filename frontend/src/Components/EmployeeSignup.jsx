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
    <div className="d-flex pt-2 vh-100 align-items-center justify-content-center">
      <div className="d-flex flex-column justify-content-center align-items-start w-25 p-4">
        <h4 className="mb-3">Already have an account?</h4>
        <Link to="/employee_login" className="btn btn-link text-success fw-bold">Login</Link>
      </div>
      <div className="d-flex flex-column w-50">
        <div
          className="p-4 rounded border border-success shadow-sm"
          style={{ fontSize: '0.9rem', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}
        >
          <h5 className="text-center text-success mb-1" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Staff Signup</h5>
          {successMessage && (
            <div className="alert alert-success mb-1">
              {successMessage}
            </div>
          )}
          <form className="row g-3" onSubmit={handleSignup}>
            <div className="col-12">
              <label htmlFor="inputName" className="form-label">Name <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                id="inputName"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ padding: '0.5rem', backgroundColor: '#e9ecef', border: '1px solid #ced4da', borderRadius: '0.25rem', height: '2rem' }}
              />
            </div>
            <div className="col-12">
              <label htmlFor="inputEmail" className="form-label">Email <span className="text-danger">*</span></label>
              <input
                type="email"
                className="form-control"
                id="inputEmail"
                placeholder="Enter Email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: '0.5rem', backgroundColor: '#e9ecef', border: '1px solid #ced4da', borderRadius: '0.25rem', height: '2rem' }}
              />
            </div>
            <div className="col-12">
              <label htmlFor="inputPassword" className="form-label">Password <span className="text-danger">*</span></label>
              <input
                type="password"
                className="form-control"
                id="inputPassword"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ padding: '0.5rem', backgroundColor: '#e9ecef', border: '1px solid #ced4da', borderRadius: '0.25rem', height: '2rem' }}
              />
            </div>
            <div className="col-12">
              <label htmlFor="inputLocation" className="form-label">Location (Nearest Town) <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                id="inputLocation"
                placeholder="Enter Location"
                autoComplete="off"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                style={{ padding: '0.5rem', backgroundColor: '#e9ecef', border: '1px solid #ced4da', borderRadius: '0.25rem', height: '2rem' }}
              />
            </div>
            <div className="row g-3">
              <div className="col-6">
                <label htmlFor="branch" className="form-label">Branch <span className="text-danger">*</span></label>
                <select
                  name="branch"
                  id="branch"
                  className="form-select"
                  style={{ padding: '0.5rem', backgroundColor: '#e9ecef', border: '1px solid #ced4da', height: '2.5rem' }}
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
              <div className="col-6">
                <label htmlFor="category" className="form-label">Category <span className="text-danger">*</span></label>
                <select
                  name="category"
                  id="category"
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  style={{ padding: '0.5rem', backgroundColor: '#e9ecef', border: '1px solid #ced4da', height: '2.5rem' }}
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-success w-100 py-2" style={{ fontSize: '1rem', fontWeight: 'bold' }}>Sign Up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
  
  
};

export default EmployeeSignup;
