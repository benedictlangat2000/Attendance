import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';

const AttendanceReport = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  useEffect(() => {
    // Fetch attendance records from the server
    setLoading(true);
    axios.get('http://localhost:3000/auth/attendance')
      .then((response) => {
        if (response.data.Status) {
          setAttendanceRecords(response.data.Result);
        } else {
          setError(response.data.Error);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleFilter = () => {
    const filteredRecords = attendanceRecords.filter(record => {
      const checkinDate = new Date(record.checkin_date);
      return (!startDate || checkinDate >= new Date(startDate)) &&
             (!endDate || checkinDate <= new Date(endDate));
    });
    setAttendanceRecords(filteredRecords);
    setCurrentPage(1); // Reset to the first page when filtering
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(attendanceRecords.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = attendanceRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(attendanceRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");
    XLSX.writeFile(workbook, "AttendanceReport.xlsx");
  };

  const downloadCSV = () => {
    const csvData = attendanceRecords.map(record => ({
      'Employee Name': record.employee_name,
      'Employee Email': record.employee_email,
      'Branch Name': record.branch_name,
      'Check-in Date': new Date(record.checkin_date).toLocaleString(),
      'Checkout Date': record.checkout_date ? new Date(record.checkout_date).toLocaleString() : 'N/A',
      'IP Address': record.ip_address,
    }));
    const csvString = [
      Object.keys(csvData[0]).join(','), // header row
      ...csvData.map(item => Object.values(item).join(',')) // data rows
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'AttendanceReport.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className='px-2 mt-1'>
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <div className='d-flex justify-content-center flex-grow-1'>
          <h6 className='text-center w-100'>Attendance Report</h6>
        </div>
        <div className='d-flex'>
          <button onClick={downloadExcel} className="btn btn-primary btn-sm me-2">Download Excel</button>
          <button onClick={downloadCSV} className="btn btn-secondary btn-sm">Download CSV</button>
        </div>
      </div>

      <div className='mb-3 d-flex justify-content-center'>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="form-control me-2" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="form-control me-2" />
        <button onClick={handleFilter} className="btn btn-info btn-sm">Filter</button>
      </div>

      <div className='mt-3'>
        {loading && <p className="text-info">Loading...</p>}
        {error && <p className="text-danger">Error: {error}</p>}
        {currentRecords.length === 0 && !loading && <p>No attendance records found.</p>}
        {currentRecords.length > 0 && (
          <>
            <table className='table table-striped'>
              <thead className="table-success">
                <tr>
                  <th>Employee Name</th>
                  <th>Employee Email</th>
                  <th>Branch Name</th>
                  <th>Check-in Date</th>
                  <th>Checkout Date</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map(record => (
                  <tr key={record.attendance_id}>
                    <td>{record.employee_name}</td>
                    <td>{record.employee_email}</td>
                    <td>{record.branch_name}</td>
                    <td>{new Date(record.checkin_date).toLocaleString()}</td>
                    <td>{record.checkout_date ? new Date(record.checkout_date).toLocaleString() : 'N/A'}</td>
                    <td>{record.ip_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="d-flex justify-content-center mt-3">
              <nav aria-label="Page navigation">
                <ul className="pagination">
                  <li className="page-item">
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, index) => (
                    <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className="page-item">
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AttendanceReport;
