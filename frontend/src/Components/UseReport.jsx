import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';

const UserReport = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(15);
  const [visiblePageCount] = useState(10); // Number of visible pages in pagination

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3000/auth/attendance')
      .then((response) => {
        if (response.data.Status) {
          setAttendanceRecords(response.data.Result);
          const distinctBranches = [...new Set(response.data.Result.map(record => record.branch_name))];
          const distinctEmployees = [...new Set(response.data.Result.map(record => record.employee_email))];
          setBranches(distinctBranches);
          setEmployees(distinctEmployees);
        } else {
          setError(response.data.Error);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(`Error fetching attendance records: ${error.message}`);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    handleFilter(); // Apply filters when dependencies change
  }, [selectedBranch, selectedEmail, startDate, endDate, attendanceRecords]);

  const handleFilter = () => {
    const filtered = attendanceRecords.filter(record => {
      const checkinDate = new Date(record.checkin_date);
      return (
        (selectedBranch === '' || record.branch_name === selectedBranch) &&
        (selectedEmail === '' || record.employee_email === selectedEmail) &&
        (!startDate || checkinDate >= new Date(startDate)) &&
        (!endDate || checkinDate <= new Date(endDate))
      );
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

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Report");
    XLSX.writeFile(workbook, "UserReport.xlsx");
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
    a.setAttribute('download', 'UserReport.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className='px-2 mt-1'>
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <div className='d-flex justify-content-center flex-grow-1'>
          <h3 className='text-center w-100'>User Report</h3>
        </div>
        <div className='d-flex'>
          <button onClick={downloadExcel} className="btn btn-success btn-sm me-2">Download Excel</button>
          <button onClick={downloadCSV} className="btn btn-dark btn-sm">Download CSV</button>
        </div>
      </div>

      <div className='mb-3'>
        <div className='row'>
          <div className='col-md-3 mb-2'>
            <select 
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="form-select"
            >
              <option value=''>All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
          <div className='col-md-3 mb-2'>
            <select 
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              className="form-select"
            >
              <option value=''>All Employees</option>
              {employees.map(email => (
                <option key={email} value={email}>{email}</option>
              ))}
            </select>
          </div>
          <div className='col-md-3 mb-2 d-flex align-items-center'>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              className="form-control me-2" 
            />
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              className="form-control" 
            />
          </div>
        </div>
        <button onClick={handleFilter} className="btn btn-success btn-sm mt-2">Apply Filters</button>
      </div>

      {loading ? (
        <div className='text-center'>Loading...</div>
      ) : error ? (
        <div className='text-danger'>{error}</div>
      ) : (
        <div>
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
              {currentRecords.map((record, index) => (
                <tr key={index}>
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

          <nav>
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
              {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
                <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
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
      )}
    </div>
  );
};

export default UserReport;
