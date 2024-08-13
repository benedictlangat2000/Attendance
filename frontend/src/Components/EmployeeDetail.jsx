import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EmployeeDetail = () => {
  const [employee, setEmployee] = useState({});
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch employee details
    axios.get(`http://localhost:3000/employee/detail/${id}`)
      .then(result => {
        console.log('Employee Details Response:', result.data); // Log the response data
        if (result.data.Result && result.data.Result.length > 0) {
          setEmployee(result.data.Result[0]); // Access the first element of the array
        } else {
          setError('Employee not found.');
        }
      })
      .catch(err => {
        console.error('Error fetching employee details:', err);
        setError('Failed to fetch employee details.');
      });

    // Fetch branches
    axios.get('http://localhost:3000/auth/branch')
      .then(result => {
        console.log('Branches Response:', result.data); // Log the branches response data
        if (result.data.Status) {
          setBranches(result.data.Result);
        } else {
          setError(result.data.Error);
        }
      })
      .catch(err => {
        console.error('Error fetching branches:', err);
        setError('Failed to fetch branches.');
      });
  }, [id]); // Only id is required as a dependency

  const handleLogout = () => {
    axios.get('http://localhost:3000/employee/logout')
      .then(result => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate('/');
        }
      })
      .catch(err => {
        console.error('Error logging out:', err);
        setError('Failed to logout.');
      });
  };

  // Function to get branch name by ID
  const getBranchName = (branchId) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.branch : "Unknown"; // Ensure correct field names
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className='d-flex justify-content-center flex-column align-items-center mt-0'>
        <div className='d-flex align-items-center flex-column mt-1'>
          <h3>Name: {employee.name || 'N/A'}</h3>
          <h3>Email: {employee.email || 'N/A'}</h3>
          <h3>Branch: {employee.branch_id ? getBranchName(employee.branch_id) : 'Unknown'}</h3>
        </div>
        <div>
          <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
