import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [pageNumbersLimit] = useState(10); // Number of visible page numbers

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await axios.get("http://localhost:3000/auth/category");
        if (categoriesResponse.data.Status) {
          setCategories(categoriesResponse.data.Result);
        } else {
          alert(categoriesResponse.data.Error);
        }

        // Fetch branches
        const branchesResponse = await axios.get("http://localhost:3000/auth/branch");
        if (branchesResponse.data.Status) {
          setBranches(branchesResponse.data.Result);
        } else {
          alert(branchesResponse.data.Error);
        }

        // Fetch employees
        const employeesResponse = await axios.get("http://localhost:3000/auth/employee");
        if (employeesResponse.data.Status) {
          setEmployees(employeesResponse.data.Result);
          setFilteredEmployees(employeesResponse.data.Result); // Initialize with all employees
        } else {
          alert(employeesResponse.data.Error);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await axios.delete(`http://localhost:3000/auth/delete_employee/${id}`);
      if (result.data.Status) {
        setEmployees(employees.filter((e) => e.id !== id));
        setFilteredEmployees(filteredEmployees.filter((e) => e.id !== id)); // Update filtered list
      } else {
        alert(result.data.Error);
      }
    } catch (err) {
      console.log(err);
    }
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

  // Filter employees based on selected category and branch
  useEffect(() => {
    let filtered = employees;
    if (categoryFilter) {
      filtered = filtered.filter(e => e.category_id === parseInt(categoryFilter));
    }
    if (branchFilter) {
      filtered = filtered.filter(e => e.branch_id === parseInt(branchFilter));
    }
    setFilteredEmployees(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [categoryFilter, branchFilter, employees]);

  // Calculate the current employees to display
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  // Handle pagination navigation
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers with limits
  const pageNumbers = [];
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const startPage = Math.max(1, currentPage - Math.floor(pageNumbersLimit / 2));
  const endPage = Math.min(totalPages, startPage + pageNumbersLimit - 1);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h5 className="text-success">Employee List</h5>
      </div>
      <Link to="/dashboard/add_employee" className="btn btn-success btn-sm mb-3">
        Add Employee
      </Link>
      <div>
      <div className="row mb-3">
          <div className="col-6">
            <select
              className="form-select"
              onChange={(e) => setCategoryFilter(e.target.value)}
              value={categoryFilter}
            >
              <option value="">Filter by Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <select
              className="form-select"
              onChange={(e) => setBranchFilter(e.target.value)}
              value={branchFilter}
            >
              <option value="">Filter by Branch</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.branch}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="table table-sm">
          <thead>
            <tr className="table-dark">
              <th className="small">Name</th>
              <th className="small">Email</th>
              <th className="small">Town</th>
              <th className="small">Category</th>
              <th className="small">Branch</th>
              <th className="small">Action</th>
            </tr>
          </thead>
          <tbody className="table-secondary">
            {currentEmployees.length > 0 ? (
              currentEmployees.map((e) => (
                <tr key={e.id}>
                  <td className="small">{e.name}</td>
                  <td className="small">{e.email}</td>
                  <td className="small">{e.location}</td>
                  <td className="small">{getCategoryName(e.category_id)}</td>
                  <td className="small">{getBranchName(e.branch_id)}</td>
                  <td>
                    <Link
                      to={`/dashboard/edit_employee/${e.id}`}
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
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No employees found</td>
              </tr>
            )}
          </tbody>
        </table>
        <nav>
          <ul className="pagination justify-content-center">
            {currentPage > 1 && (
              <li className="page-item">
                <button onClick={() => paginate(currentPage - 1)} className="page-link">
                  &laquo;
                </button>
              </li>
            )}
            {pageNumbers.map(number => (
              <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                <button onClick={() => paginate(number)} className="page-link">
                  {number}
                </button>
              </li>
            ))}
            {currentPage < totalPages && (
              <li className="page-item">
                <button onClick={() => paginate(currentPage + 1)} className="page-link">
                  &raquo;
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Employee;
