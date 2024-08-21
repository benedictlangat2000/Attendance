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
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-body bg-success">
              <h5 className="card-header text-light">Staff Details</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Name: {employee.name || 'N/A'}</li>
                <li className="list-group-item">Email: {employee.email || 'N/A'}</li>
                <li className="list-group-item">Branch: {branch.branch || 'N/A'}</li>
                <li className="list-group-item">Payroll No: {employee.location || 'N/A'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetail;

