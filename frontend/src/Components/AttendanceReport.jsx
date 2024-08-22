import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';

const AttendanceReport = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [visiblePageCount] = useState(5); // Number of visible pages in pagination

  useEffect(() => {
    // Fetch attendance records from the server
    setLoading(true);
    axios.get('http://localhost:3000/auth/attendance')
      .then((response) => {
        if (response.data.Status) {
          setAttendanceRecords(response.data.Result);
          setFilteredRecords(response.data.Result);
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
    const filtered = attendanceRecords.filter(record => {
      const checkinDate = new Date(record.checkin_date);
      return (!startDate || checkinDate >= new Date(startDate)) &&
             (!endDate || checkinDate <= new Date(endDate));
    });
    setFilteredRecords(filtered);
    setCurrentPage(1); // Reset to the first page when filtering
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");
    XLSX.writeFile(workbook, "AttendanceReport.xlsx");
  };

  const downloadCSV = () => {
    const csvData = filteredRecords.map(record => ({
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

  // Calculate the range of pages to show
  const halfVisiblePages = Math.floor(visiblePageCount / 2);
  let startPage = Math.max(1, currentPage - halfVisiblePages);
  let endPage = Math.min(totalPages, currentPage + halfVisiblePages);

  if (endPage - startPage + 1 < visiblePageCount) {
    if (startPage === 1) {
      endPage = Math.min(visiblePageCount, totalPages);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - visiblePageCount + 1);
    }
  }

  return (
    <div className='px-2 mt-1'>
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <div className='d-flex justify-content-center flex-grow-1'>
          <h3 className='text-center w-100'>Attendance Report</h3>
        </div>
        <div className='d-flex'>
          <button onClick={downloadExcel} className="btn btn-success btn-sm me-2">Download Excel</button>
          <button onClick={downloadCSV} className="btn btn-dark btn-sm">Download CSV</button>
        </div>
      </div>

      <div className='mb-3 d-flex justify-content-center'>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="form-control me-2" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="form-control me-2" />
        <button onClick={handleFilter} className="btn btn-success btn-sm">Filter</button>
      </div>

      <div className='mt-3'>
        {loading && <p className="text-info">Loading...</p>}
        {error && <p className="text-danger">Error: {error}</p>}
        {currentRecords.length === 0 && !loading && <p>No attendance records found.</p>}
        {currentRecords.length > 0 && (
          <>
            <table className='table table-striped'>
              <thead className="table-dark">
                <tr>
                  <th className="small">Employee Name</th>
                  <th className="small">Employee Email</th>
                  <th className="small">Branch Name</th>
                  <th className="small">Check-in Date</th>
                  <th className="small">Checkout Date</th>
                  <th className="small">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map(record => (
                  <tr key={record.attendance_id}>
                    <td className="small">{record.employee_name}</td>
                    <td className="small">{record.employee_email}</td>
                    <td className="small">{record.branch_name}</td>
                    <td className="small">{new Date(record.checkin_date).toLocaleString()}</td>
                    <td className="small">{record.checkout_date ? new Date(record.checkout_date).toLocaleString() : 'N/A'}</td>
                    <td className="small">{record.ip_address}</td>
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
                  {startPage > 1 && (
                    <li className="page-item">
                      <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
                    </li>
                  )}
                  {startPage > 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                  {[...Array(endPage - startPage + 1)].map((_, index) => (
                    <li key={startPage + index} className={`page-item ${currentPage === startPage + index ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(startPage + index)}>
                        {startPage + index}
                      </button>
                    </li>
                  ))}
                  {endPage < totalPages - 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                  {endPage < totalPages && (
                    <li className="page-item">
                      <button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                    </li>
                  )}
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
