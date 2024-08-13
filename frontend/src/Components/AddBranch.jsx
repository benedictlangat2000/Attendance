import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddBranch = () => {
  const [branch, setBranch] = useState({
    branch: '', // Change 'name' to 'branch' to match database schema
    latitude: 0.0,
    longitude: 0.0,
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/auth/add_branch', branch)
      .then(result => {
        if (result.data.Status) {
          navigate('/dashboard/branch');
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  const handleBranchChange = (e) => {
    setBranch({ ...branch, branch: e.target.value }); // Change 'name' to 'branch'
  };

  const handleLatitudeChange = (e) => {
    setBranch({ ...branch, latitude: parseFloat(e.target.value) });
  };

  const handleLongitudeChange = (e) => {
    setBranch({ ...branch, longitude: parseFloat(e.target.value) });
  };

  return (
    <div className='d-flex justify-content-center align-items-center h-75'>
      <div className='p-3 rounded w-25 border'>
        <h2>Add Branch</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="branch"><strong>Branch:</strong></label>
            <input type="text" name='branch' placeholder='Enter Branch Name'
              value={branch.branch} onChange={handleBranchChange} className='form-control rounded-0'/>
          </div>
          <div className='mb-3'>
            <label htmlFor="latitude"><strong>Latitude:</strong></label>
            <input type="number" name='latitude' placeholder='Enter Latitude'
              value={branch.latitude} onChange={handleLatitudeChange} className='form-control rounded-0'/>
          </div>
          <div className='mb-3'>
            <label htmlFor="longitude"><strong>Longitude:</strong></label>
            <input type="number" name='longitude' placeholder='Enter Longitude'
              value={branch.longitude} onChange={handleLongitudeChange} className='form-control rounded-0'/>
          </div>
          <button className='btn btn-success w-100 rounded-0 mb-2'>Add Branch</button>
        </form>
      </div>
    </div>
  );
};

export default AddBranch;
