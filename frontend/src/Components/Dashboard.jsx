import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const Dashboard = () => {
  const anvigate = useNavigate()
  axios.defaults.withCredentials = true
  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout')
    .then(result => {
      if(result.data.Status) { 
        localStorage.removeItem("valid")
        anvigate('/')
      }
    })
  }
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-2 col-xl-2 px-sm-2 px-0 bg-success">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <Link
              to="/dashboard"
              className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
            >
              <span className="fs-5 fw-bold">AA HR</span>
            </Link>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li className="nav-item w-100">
                <Link
                  to="/dashboard"
                  className="nav-link text-white px-0 py-2 rounded hover-bg-dark"
                >
                  <i className="fs-5 bi-speedometer2 me-2"></i>
                  <span className="d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li className="nav-item w-100">
                <Link
                  to="/dashboard/employee"
                  className="nav-link text-white px-0 py-2 rounded hover-bg-dark"
                >
                  <i className="fs-5 bi-people me-2"></i>
                  <span className="d-none d-sm-inline">Manage Staff</span>
                </Link>
              </li>
              <li className="nav-item w-100">
                <Link
                  to="/dashboard/category"
                  className="nav-link text-white px-0 py-2 rounded hover-bg-dark"
                >
                  <i className="fs-5 bi-columns me-2"></i>
                  <span className="d-none d-sm-inline">Category</span>
                </Link>
              </li>
              <li className="nav-item w-100">
                <Link
                  to="/dashboard/branch"
                  className="nav-link text-white px-0 py-2 rounded hover-bg-dark"
                >
                  <i className="fs-5 bi-bank me-2"></i>
                  <span className="d-none d-sm-inline">Branches</span>
                </Link>
              </li>
              <li className="nav-item w-100">
                <Link
                  to="/dashboard/user_report"
                  className="nav-link text-white px-0 py-2 rounded hover-bg-dark"
                >
                  <i className="fs-5 bi-file-earmark-text me-2"></i>
                  <span className="d-none d-sm-inline">Reports</span>
                </Link>
              </li>
              <li className="nav-item w-100">
                <Link
                  to="/dashboard/reportattendance"
                  className="nav-link text-white px-0 py-2 rounded hover-bg-dark"
                >
                  <i className="fs-5 bi-receipt me-2"></i>
                  <span className="d-none d-sm-inline">Attendance</span>
                </Link>
              </li>
              <li className="nav-item w-100">
                <Link
                  to="/dashboard/bulk_upload"
                  className="nav-link text-white px-0 py-2 rounded hover-bg-dark"
                >
                  <i className="fs-5 bi-file-earmark-arrow-down-fill me-2"></i>
                  <span className="d-none d-sm-inline">Upload Staff</span>
                </Link>
              </li>
              <li className="nav-item w-100">
                <Link
                  to="/dashboard/assets_dashboard"
                  className="nav-link text-white px-0 py-2 rounded hover-bg-dark"
                >
                  <i className="fs-5 bi-laptop me-2"></i>
                  <span className="d-none d-sm-inline">Asset Management</span>
                </Link>
              </li>
              <li className="nav-item w-100">
                <Link
                  to="#"
                  onClick={handleLogout}
                  className="nav-link text-white px-0 py-2 rounded hover-bg-dark"
                >
                  <i className="fs-5 bi-power me-2"></i>
                  <span className="d-none d-sm-inline">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-center bg-success-subtle">
            <h5 className="text-dark">AA Attendance System</h5>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
