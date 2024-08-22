import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const MarkAttendance = () => {
  const { id } = useParams();
  const [branch, setBranch] = useState({});
  const [employee, setEmployee] = useState({});
  const [attendance, setAttendance] = useState({});
  const [error, setError] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch employee details
    axios.get(`http://localhost:3000/employee/detail/${id}`)
      .then(result => {
        console.log('Employee Data:', result.data);
        if (result.data.length > 0) {
          setEmployee(result.data[0]);
          axios.get(`http://localhost:3000/auth/branch/${result.data[0].branch_id}`)
            .then(branchResult => {
              console.log('Branch Data:', branchResult.data);
              if (branchResult.data.Status) {
                setBranch(branchResult.data.Result);
              } else {
                setError(branchResult.data.Error);
              }
            })
            .catch(err => {
              console.log('Error fetching branch details:', err);
              setError('Error fetching branch details: ' + err.message);
            });
        } else {
          setError('Employee not found');
        }
      })
      .catch(err => {
        console.log('Error fetching employee details:', err);
        setError('Error fetching employee details: ' + err.message);
      });

    // Fetch attendance details
    axios.get(`http://localhost:3000/auth/attendance`)
      .then(result => {
        console.log('Attendance Data:', result.data);
        if (result.data.Status) {
          const attendanceData = result.data.Result.find(a => a.employee_id === id);
          if (attendanceData) {
            setAttendance(attendanceData);
            setIsCheckedIn(attendanceData.checkout_date === null);
          }
        } else {
          setError(result.data.Error);
        }
      })
      .catch(err => {
        console.log('Error fetching attendance details:', err);
        setError('Error fetching attendance details: ' + err.message);
      });
  }, [id]);

  const getIPAddress = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch (error) {
      console.log('Error fetching IP address:', error);
      return 'unknown';
    }
  };

  const handleCheckin = async () => {
    setLoading(true);
    const ipAddress = await getIPAddress();

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const distance = calculateDistance(latitude, longitude, branch.latitude, branch.longitude);

      console.log('Geolocation Check-in:', { latitude, longitude, distance });

      if (distance <= 500) { // Adjust the distance as needed
        axios.post(`http://localhost:3000/attendance/checkin`, {
          employee_id: id,
          branch_id: branch.id,
          checkin_date: new Date(),
          ip_address: ipAddress
        })
          .then((response) => {
            console.log('Check-in Response:', response.data);
            setIsCheckedIn(true);
            setError(null);
            setLoading(false);
          })
          .catch((error) => {
            console.log('Check-in Error:', error);
            setError(error.message);
            setLoading(false);
          });
      } else {
        setError('You are not within the branch coordinates.');
        setLoading(false);
      }
    }, (error) => {
      console.log('Geolocation Error:', error);
      setError('Geolocation error: ' + error.message);
      setLoading(false);
    });
  };

  const handleCheckout = async () => {
    setLoading(true);
    const ipAddress = await getIPAddress();

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const distance = calculateDistance(latitude, longitude, branch.latitude, branch.longitude);

      console.log('Geolocation Check-out:', { latitude, longitude, distance });

      if (distance <= 100) { // Adjust the distance as needed
        axios.post(`http://localhost:3000/attendance/checkout`, {
          employee_id: id,
          branch_id: branch.id,
          checkout_date: new Date(),
          ip_address: ipAddress
        })
          .then((response) => {
            console.log('Check-out Response:', response.data);
            setIsCheckedIn(false);
            setError(null);
            setLoading(false);
          })
          .catch((error) => {
            console.log('Check-out Error:', error);
            setError(error.message);
            setLoading(false);
          });
        } else {
          setError('You are not within the branch coordinates.');
          setLoading(false);
        }
      }, (error) => {
        console.log('Geolocation Error:', error);
        setError('Geolocation error: ' + error.message);
        setLoading(false);
      });
    };
  
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const lat1Rad = lat1 * Math.PI / 180;
      const lat2Rad = lat2 * Math.PI / 180;
  
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    };
  
    return (
      <div className="container mt-4">
        <h2>Mark Attendance</h2>
        {loading && <p className="text-info">Loading...</p>}
        {error && <p className="text-danger">{error}</p>}
  
        <div className="card mb-4">
          <div className="card-header bg-success text-white">Employee and Branch Details</div>
          <div className="card-body">
            <p><strong>Name:</strong> {employee.name || 'N/A'}</p>
            <p><strong>Email:</strong> {employee.email || 'N/A'}</p>
            <p><strong>Branch:</strong> {branch.branch || 'N/A'}</p>
            <p><strong>Latitude:</strong> {branch.latitude || 'N/A'}</p>
            <p><strong>Longitude:</strong> {branch.longitude || 'N/A'}</p>
          </div>
        </div>
  
        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-success btn-sm" onClick={handleCheckin} disabled={isCheckedIn}>Checkin</button>
          <button className="btn btn-danger btn-sm" onClick={handleCheckout} disabled={!isCheckedIn}>Checkout</button>
        </div>
      </div>
    );
  };
  
  export default MarkAttendance;