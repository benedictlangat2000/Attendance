import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployeeSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branchId, setBranchId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [location, setLocation] = useState("");
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch branches
    axios.get("http://localhost:3000/auth/branch")
      .then((result) => {
        if (result.data.Status) {
          setBranches(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    // Fetch categories
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
        localStorage.setItem("valid", true); // Store a value in localStorage
        navigate('/employee_dashboard/' + result.data.id); 
      } else {
        alert(result.data.Error);
      }
    })
    .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 rounded border w-50">
        <h5 className="text-center text-success mb-4">Employee Signup</h5>
        <form className="row g-3" onSubmit={handleSignup}>
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
            />
          </div>
          <div className="col-12">
            <label htmlFor="branch" className="form-label">Branch</label>
            <select
              name="branch"
              id="branch"
              className="form-select"
              style={{ color: '#000', backgroundColor: '#fff' }} 
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
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-success w-100">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeSignup;
