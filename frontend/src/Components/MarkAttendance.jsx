import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MarkAttendance = () => {
  const { id } = useParams();
  const [branch, setBranch] = useState({});
  const [attendance, setAttendance] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the branch details
    axios.get(`http://localhost:3000/branch/${id}`)
      .then((response) => {
        setBranch(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [id]);

  const handleMarkAttendance = () => {
    // Get the user's location
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
  
      // Check if the user is within the branch coordinates
      const distance = calculateDistance(latitude, longitude, branch.latitude, branch.longitude);
      if (distance <= 100) { // adjust the distance as needed
        // Mark attendance
        axios.post(`http://localhost:3000/attendance`, {
          employee_id: id,
          branch_id: branch.id,
          attendance_date: new Date(),
        })
          .then((response) => {
            setAttendance(response.data);
            setTimeout(() => {
              setAttendance({});
            }, 3000); // clear the attendance state after 3 seconds
          })
          .catch((error) => {
            setError(error.message);
          });
      } else {
        setError('You are not within the branch coordinates.');
      }
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
    <div>
      <h2>Mark Attendance</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {attendance && <p>Attendance marked successfully!</p>}
      <button onClick={handleMarkAttendance}>Mark Attendance</button>
    </div>
  );
};

export default MarkAttendance;