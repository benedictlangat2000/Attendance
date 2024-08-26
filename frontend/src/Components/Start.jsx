import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/startpage.css'; // Import the updated CSS file

const Start = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:3000/verify')
      .then(result => {
        if (result.data.Status) {
          if (result.data.role === "admin") {
            navigate('/dashboard');
          } else {
            navigate('/employee_detail/' + result.data.id);
          }
        }
      }).catch(err => console.log(err));
  }, [navigate]);

  return (
    <div className="startPage">
      <div className="curve"></div>
      <div className="startContainer">
        <div className="startForm">
          <h2 className="text-dark">Login As</h2>
          <div className="d-flex justify-content-between mt-5 mb-2">
            <button type="button" className="btn btn-success" onClick={() => navigate('/employee_login')}>
              Staff
            </button>
            <button type="button" className="btn btn-success" onClick={() => navigate('/adminlogin')}>
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;
