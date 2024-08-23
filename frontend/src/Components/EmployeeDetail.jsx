import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EmployeeDetail = () => {
  const [employee, setEmployee] = useState({});
  const [branch, setBranch] = useState({}); 
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/employee/detail/${id}`)
      .then(result => {
        if (result.data.length > 0) {
          setEmployee(result.data[0]);
          axios.get(`http://localhost:3000/auth/branch/${result.data[0].branch_id}`)
            .then(branchResult => {
              if (branchResult.data.Status) {
                setBranch(branchResult.data.Result);
              } else {
                console.error(branchResult.data.Error);
              }
            })
            .catch(err => console.error(err));
        } else {
          console.error('Employee not found');
        }
      })
      .catch(err => console.log(err));
  }, [id]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-dark text-white text-center">
              <h6 className="mb-0">Staff Details</h6>
            </div>
            <div className="card-body bg-light">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Name:</strong> {employee.name || 'N/A'}
                </li>
                <li className="list-group-item">
                  <strong>Email:</strong> {employee.email || 'N/A'}
                </li>
                <li className="list-group-item">
                  <strong>Branch:</strong> {branch.branch || 'N/A'}
                </li>
                <li className="list-group-item">
                  <strong>Latitude:</strong> {branch.latitude || 'N/A'}
                </li>
                <li className="list-group-item">
                  <strong>Longitude:</strong> {branch.longitude || 'N/A'}
                </li>
                <li className="list-group-item">
                  <strong>Town:</strong> {employee.location || 'N/A'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default EmployeeDetail;

