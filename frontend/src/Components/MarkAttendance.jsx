import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const MarkAttendance = () => {
  const { id } = useParams();
  const [branch, setBranch] = useState({});
  const [employee, setEmployee] = useState({});
  const [error, setError] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({});
  const [ipAddress, setIpAddress] = useState('');

  // Function to get the IP address
  const getIPAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org/?format=json');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error.message);
      return 'unknown'; // Handle failure gracefully
    }
  };

  // Function to get current EAT time
  const getEATDateTime = () => {
    const now = new Date();
    const offset = 3 * 60; // EAT is UTC+3
    const eatDateTime = new Date(now.getTime() + (offset * 60 * 1000));
    return eatDateTime.toISOString();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employee details
        const employeeResult = await fetch(`http://localhost:3000/employee/detail/${id}`);
        const employeeData = await employeeResult.json();
        if (employeeData.length > 0) {
          setEmployee(employeeData[0]);

          // Fetch branch details
          const branchResult = await fetch(`http://localhost:3000/auth/branch/${employeeData[0].branch_id}`);
          const branchData = await branchResult.json();
          if (branchData.Status) {
            setBranch(branchData.Result);
          } else {
            throw new Error(branchData.Error);
          }
        } else {
          throw new Error('Employee not found');
        }

        // Fetch current location and IP address
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });

          try {
            const ip = await getIPAddress();
            setIpAddress(ip);
          } catch (ipError) {
            setError('Error fetching IP address: ' + ipError.message);
          }
        }, (geoError) => {
          setError('Geolocation error: ' + geoError.message);
        });
      } catch (fetchError) {
        setError('Error fetching data: ' + fetchError.message);
      }
    };

    fetchData();
  }, [id]);

  const handleCheckin = async () => {
    setLoading(true);
  
    try {
      // Fetch IP address
      const ipAddress = await getIPAddress();
      console.log('IP Address for Check-in:', ipAddress); // Log IP address for debugging
  
      // Get current location
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
  
        // Calculate distance to branch coordinates
        const distanceToBranch = calculateDistance(latitude, longitude, branch.latitude, branch.longitude);
  
        console.log('Current Location:', { latitude, longitude });
        console.log('Branch Coordinates:', { latitude: branch.latitude, longitude: branch.longitude });
        console.log('Distance to Branch:', distanceToBranch);
  
        if (distanceToBranch <= 500) {
          alert('You are within the branch coordinates.');
  
          const checkinData = {
            employee_id: id,
            branch_id: branch.id,
            checkin_date: getEATDateTime(), // Use EAT datetime
            checkin_ip: ipAddress
          };
  
          console.log('Check-In Data:', checkinData);
  
          try {
            const result = await axios.post('http://localhost:3000/auth/attendance/checkin', checkinData);
            if (result.data.Status) {
              setIsCheckedIn(true);
              setError(null);
              alert('Attendance submitted successfully.');
            } else {
              setError(result.data.Error || 'Error checking in');
            }
          } catch (err) {
            console.error('Error checking in:', err);
            setError('Error checking in: ' + err.message);
          }
        } else {
          setError('You are not within the branch coordinates.');
        }
        setLoading(false);
      }, (geoError) => {
        setError('Geolocation error: ' + geoError.message);
        setLoading(false);
      });
    } catch (error) {
      setError('Error fetching IP address for check-in: ' + error.message);
      setLoading(false);
    }
  };
  
  const handleCheckout = async () => {
    setLoading(true);
  
    try {
      // Fetch IP address
      const ipAddress = await getIPAddress();
      console.log('IP Address for Checkout:', ipAddress); // Log IP address for debugging
  
      // Get current location
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
  
        // Calculate distance to branch coordinates
        const distanceToBranch = calculateDistance(latitude, longitude, branch.latitude, branch.longitude);
  
        console.log('Current Location:', { latitude, longitude });
        console.log('Branch Coordinates:', { latitude: branch.latitude, longitude: branch.longitude });
        console.log('Distance to Branch:', distanceToBranch);
  
        if (distanceToBranch <= 800) {
          alert('You are within the branch coordinates.');
  
          const checkoutData = {
            employee_id: id,
            branch_id: branch.id,
            checkout_date: getEATDateTime(), // Use EAT datetime
            checkout_ip: ipAddress
          };
  
          console.log('Check-Out Data:', checkoutData);
  
          try {
            const result = await axios.post('http://localhost:3000/auth/attendance/checkout', checkoutData);
            if (result.data.Status) {
              setIsCheckedIn(false);
              setError(null);
              alert('Attendance checkout submitted successfully.');
            } else {
              setError(result.data.Error || 'Error checking out');
            }
          } catch (err) {
            console.error('Error checking out:', err);
            setError('Error checking out: ' + err.message);
          }
        } else {
          setError('You are not within the branch coordinates.');
        }
        setLoading(false);
      }, (geoError) => {
        setError('Geolocation error: ' + geoError.message);
        setLoading(false);
      });
    } catch (error) {
      setError('Error fetching IP address for checkout: ' + error.message);
      setLoading(false);
    }
  };
  
  

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance * 1000; // Convert to meters
  };
  
  return (
    <div className="container mt-4">
      <h4 className="text-center mb-4">Mark Attendance</h4>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row mb-3">
        {branch && (
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Branch Details</h5>
                <p className="card-text">Branch: {branch.branch}</p><br />
                <p className="card-text">Branch Coordinates</p>
                <h6>Latitude: {branch.latitude}</h6>
                <h6>Longitude: {branch.longitude}</h6>
              </div>
            </div>
          </div>
        )}
        
        {employee && (
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Employee Details</h5>
                <p className="card-text">Employee: {employee.name}</p>
                <p className="card-text">Current Location  </p>
                <p>Latitude {currentLocation.latitude}</p>
                <p>Longitude {currentLocation.longitude}</p>
                <p className="card-text">IP Address: {ipAddress}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-primary me-2"
          onClick={handleCheckin}
          disabled={loading}
        >
          {isCheckedIn ? 'Checked In' : 'Check In'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleCheckout}
          disabled={loading || !isCheckedIn}
        >
          Check Out
        </button>
      </div>
    </div>
  );
};

export default MarkAttendance;
