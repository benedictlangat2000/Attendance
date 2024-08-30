import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0)
  const [employeeTotal, setemployeeTotal] = useState(0)
  const [branchTotal, setBranchTotal] = useState(0)
  const [categoryTotal, setCategoryTotal] = useState(0)
  const [admins, setAdmins] = useState([])

  useEffect(() => {
    adminCount();
    employeeCount();
    BranchCount();
    CategoryCount();
    AdminRecords();
  }, [])

  const AdminRecords = () => {
    axios.get('http://localhost:3000/auth/admin_records')
    .then(result => {
      if(result.data.Status) {
        setAdmins(result.data.Result)
      } else {
         alert(result.data.Error)
      }
    })
  }

  const adminCount = () => {
    axios.get('http://localhost:3000/auth/admin_count')
    .then(result => {
      if(result.data.Status) {
        setAdminTotal(result.data.Result[0].admin)
      }
    })
  }

  const employeeCount = () => {
    axios.get('http://localhost:3000/auth/employee_count')
    .then(result => {
      if(result.data.Status) {
        setemployeeTotal(result.data.Result[0].employee)
      } else {
        alert(result.data.Error)
      }
    })
  }
  
  const BranchCount = () => {
    axios.get('http://localhost:3000/auth/branch_count')
    .then(result => {
      if(result.data.Status) {
        setBranchTotal(result.data.Result[0].branch)
      } else {
        alert(result.data.Error)
      }
    })
  }

  const CategoryCount = () => {
    axios.get('http://localhost:3000/auth/category_count')
    .then(result => {
      if(result.data.Status) {
        setCategoryTotal(result.data.Result[0].category)
      } else {
        alert(result.data.Error)
      }
    })
  };


  return (
    <div>
      <div className='p-3 d-flex justify-content-around mt-3'>
        <div
          className='px-4 pt-2 pb-3 border shadow-sm bg-danger-subtle'
          style={{ width: '24%' }}
        >
          <div className='text-center pb-1'>
            <h5>Admin</h5>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{adminTotal}</h5>
          </div>
        </div>
        <div
          className='px-4 pt-2 pb-3 border shadow-sm bg-info-subtle'
          style={{ width: '24%' }}
        >
          <div className='text-center pb-1'>
            <h5>Staff</h5>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{employeeTotal}</h5>
          </div>
        </div>
        <div
          className='px-4 pt-2 pb-3 border shadow-sm bg-warning-subtle'
          style={{ width: '24%' }}
        >
          <div className='text-center pb-1'>
            <h5>Branches</h5>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{branchTotal}</h5>
          </div>
        </div>
        <div
          className='px-4 pt-2 pb-3 border shadow-sm bg-dark-subtle'
          style={{ width: '24%' }}
        >
          <div className='text-center pb-1'>
            <h5>Category</h5>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{categoryTotal}</h5>
          </div>
        </div>
      </div>
      <div className='mt-3 px-5 pt-3'>
        <h5>List of Admins</h5>
        <table className='table'>
          <thead>
            <tr>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.email}>
                <td>{a.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  
};

export default Home