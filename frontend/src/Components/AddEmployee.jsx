import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    branch_id: "",
    location: "",
    category_id: "",
  });
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories
    axios
      .get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategories(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    // Fetch branches
  axios
      .get("http://localhost:3000/auth/branch")
      .then((result) => {
        if (result.data.Status) {
          setBranches(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: employee.name,
      email: employee.email,
      password: employee.password,
      location: employee.location,
      branch_id: employee.branch_id,
      category_id: employee.category_id
    };
  
    axios.post('http://localhost:3000/auth/add_employee', data)
      .then(result => {
        if (result.data.Status) {
          navigate('/dashboard/employee');
        } else {
          alert(`Error: ${result.data.Error}`);
        }
      })
      .catch(err => {
        console.error("Submit Error:", err); // Log the complete error object
        const errorMessage = err.response?.data?.Error || "An unexpected error occurred.";
        alert(errorMessage);
      });
  };
  

  

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Employee</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              value={employee.name}
              onChange={(e) =>
                setEmployee({ ...employee, name: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputEmail4" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail4"
              placeholder="Enter Email"
              autoComplete="off"
              value={employee.email}
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputPassword4" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control rounded-0"
              id="inputPassword4"
              placeholder="Enter Password"
              value={employee.password}
              onChange={(e) =>
                setEmployee({ ...employee, password: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputLocation" className="form-label">
              Location
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputLocation"
              placeholder="1234 Ngong Lane"
              autoComplete="off"
              value={employee.location}
              onChange={(e) =>
                setEmployee({ ...employee, location: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="branch" className="form-label">
              Branch
            </label>
            <select
              name="branch"
              id="branch"
              className="form-select"
              value={employee.branch_id} // Updated to match the state
              onChange={(e) => setEmployee({ ...employee, branch_id: e.target.value })}
            >
              <option value="" disabled>Select Branch</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.branch} {/* Adjust according to your branch schema */}
                </option>
              ))}
            </select>
          </div>
         
          <div className="col-12">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              name="category"
              id="category"
              className="form-select"
              value={employee.category_id}
              onChange={(e) => setEmployee({ ...employee, category_id: e.target.value })}
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
            <button type="submit" className="btn btn-primary w-100">
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
