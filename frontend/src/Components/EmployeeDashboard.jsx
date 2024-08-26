import React from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the dynamic ID from the URL
  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout')
      .then(result => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate('/');
        }
      });
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-0 bg-success" style={{ minHeight: '100vh' }}>
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white">
            <Link
              to={`/employee_dashboard/${id}`} // Update the link to include the ID
              className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
            >
              <span className="fs-6 fw-bolder d-none d-sm-inline">
                Employee Dashboard
              </span>
            </Link>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li className="w-100">
                <Link
                  to={`/employee_dashboard/${id}`} // Update the link to include the ID
                  className="nav-link text-white px-3 py-2 d-flex align-items-center"
                  style={{ borderRadius: '0.25rem' }}
                >
                  <i className="fs-5 bi-speedometer2 ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to={`/employee_dashboard/${id}/mark_attendance`} // Update the link to include the ID
                  className="nav-link text-white px-3 py-2 d-flex align-items-center"
                  style={{ borderRadius: '0.25rem' }}
                >
                  <i className="fs-5 bi-clipboard-check ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Mark Attendance</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to={`/employee_dashboard/${id}/staff_report`} // Update the link to include the ID
                  className="nav-link text-white px-3 py-2 d-flex align-items-center"
                  style={{ borderRadius: '0.25rem' }}
                >
                  <i className="fs-5 bi-receipt ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Attendance Report</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="#"
                  onClick={handleLogout}
                  className="nav-link text-white px-3 py-2 d-flex align-items-center"
                  style={{ borderRadius: '0.25rem' }}
                >
                  <i className="fs-5 bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-center bg-success-subtle">
            <h5 className="mb-0">Employee Attendance System</h5>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
  
};

export default EmployeeDashboard;
