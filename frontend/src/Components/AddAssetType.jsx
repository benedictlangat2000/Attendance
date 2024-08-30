import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddAssetType = () => {
  const [assetType, setAssetType] = useState({
    name: '', // Field for asset type name
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/auth/add/asset_type', assetType)
      .then(result => {
        if (result.data.Status) {
          navigate('/dashboard/asset_types_list'); // Redirect after successful addition
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  const handleNameChange = (e) => {
    setAssetType({ ...assetType, name: e.target.value });
  };

  return (
    <div className='d-flex justify-content-center align-items-center h-75'>
      <div className='p-3 rounded w-25 border'>
        <h4>Add Asset Type</h4>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="name"><strong>Asset Type Name:</strong></label>
            <input 
              type="text" 
              name='name' 
              placeholder='Enter Asset Type Name'
              value={assetType.name} 
              onChange={handleNameChange} 
              className='form-control rounded-0'
            />
          </div>
          <button className='btn btn-success w-100 rounded-0 mb-2'>Add Asset Type</button>
        </form>
      </div>
    </div>
  );
};

export default AddAssetType;
