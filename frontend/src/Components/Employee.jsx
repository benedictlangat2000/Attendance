import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(10); // Change this number to set employees per page
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
          console.log("Branches fetched:", result.data.Result); // Add this line
          setBranches(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    // Fetch employees
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployees(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3000/auth/delete_employee/" + id)
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  // Function to get category name by ID
  const getCategoryName = (id) => {
    const category = categories.find((c) => c.id === id);
    return category ? category.name : "Unknown";
  };

  // Function to get branch name by ID
  const getBranchName = (id) => {
    const branch = branches.find((b) => b.id === id);
    return branch ? branch.branch : "Unknown";
  };

  // Calculate the current employees to display
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  // Handle pagination navigation
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Employee List</h3>
      </div>
      <Link to="/dashboard/add_employee" className="btn btn-success btn-sm">
        Add Employee
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr className="table-dark">
              <th>Name</th>
              <th>Email</th>
              <th>Payroll No.</th>
              <th>Category</th>
              <th>Branch</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="table-secondary">
            {currentEmployees.map((e) => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.location}</td>
                <td>{getCategoryName(e.category_id)}</td>
                <td>{getBranchName(e.branch_id)}</td>
                <td>
                  <Link
                    to={`/dashboard/edit_employee/` + e.id}
                    className="btn btn-success btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(e.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav>
          <ul className="pagination justify-content-center">
            {Array.from({ length: Math.ceil(employees.length / employeesPerPage) }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <a onClick={() => paginate(i + 1)} className="page-link" href="#">
                  {i + 1}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Employee;
