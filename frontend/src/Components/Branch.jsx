import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Branch = () => {
    const [branch, setBranch] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [branchesPerPage] = useState(10); // Number of branches per page
    const [maxPageLinks] = useState(5); // Number of page links to display

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const result = await axios.get('http://localhost:3000/auth/branch');
            console.log("API Response:", result.data); // Log the response data
            if (result.data.Status) {
                setBranch(result.data.Result);
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            alert("An error occurred while fetching branches.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this branch?')) {
            try {
                const result = await axios.delete(`http://localhost:3000/auth/delete_branch/${id}`);
                if (result.data.Status) {
                    fetchBranches(); // Refresh the branch list after deletion
                } else {
                    alert(result.data.Error);
                }
            } catch (err) {
                console.error("Delete Error:", err);
                alert("An error occurred while deleting the branch.");
            }
        }
    };

    const handleEdit = (id, currentName, currentLatitude, currentLongitude) => {
        const newName = prompt("Enter the new branch name:", currentName);
        const newLatitude = prompt("Enter the new latitude:", currentLatitude);
        const newLongitude = prompt("Enter the new longitude:", currentLongitude);
        if (newName && newLatitude && newLongitude) {
            axios.put(`http://localhost:3000/auth/update_branch/${id}`, {
                branch: newName,
                latitude: newLatitude,
                longitude: newLongitude
            })
            .then(result => {
                if (result.data.Status) {
                    fetchBranches(); // Refresh the branch list after update
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => {
                console.error("Update Error:", err);
                alert("An error occurred while updating the branch.");
            });
        } else {
            alert("All fields are required.");
        }
    };

    const indexOfLastBranch = currentPage * branchesPerPage;
    const indexOfFirstBranch = indexOfLastBranch - branchesPerPage;
    const currentBranches = branch.slice(indexOfFirstBranch, indexOfLastBranch);

    const totalPages = Math.ceil(branch.length / branchesPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const startPage = Math.max(1, currentPage - Math.floor(maxPageLinks / 2));
        const endPage = Math.min(totalPages, startPage + maxPageLinks - 1);

        if (startPage > 1) {
            pageNumbers.push(1);
            if (startPage > 2) pageNumbers.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pageNumbers.push('...');
            pageNumbers.push(totalPages);
        }

        return pageNumbers.map((number, index) =>
            number === '...' ? (
                <li key={index} className="page-item disabled">
                    <span className="page-link">...</span>
                </li>
            ) : (
                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </button>
                </li>
            )
        );
    };

    return (
        <div className='px-5 mt-3'>
            <div className='d-flex justify-content-center'>
                <h3>Branch List</h3>
            </div>
            <Link to="/dashboard/add_branch" className='btn btn-success btn-sm'>Add Branch</Link>
            <div className='mt-3'>
                <table className='table'>
                    <thead className='table-dark'>
                        <tr>
                            <th className="small">Number</th>
                            <th className="small">Name</th>
                            <th className="small">Latitude</th>
                            <th className="small">Longitude</th>
                            <th className="small">Actions</th>
                        </tr>
                    </thead>
                    <tbody className='table-secondary small'>
                        {currentBranches.map((b, index) => (
                            <tr key={b.id}>
                                <td>{indexOfFirstBranch + index + 1}</td>
                                <td>{b.branch}</td>
                                <td>{b.latitude}</td>
                                <td>{b.longitude}</td>
                                <td>
                                    <button onClick={() => handleEdit(b.id, b.branch, b.latitude, b.longitude)} className="btn btn-success btn-sm me-2">Edit</button>
                                    <button onClick={() => handleDelete(b.id)} className="btn btn-warning btn-sm">Delete</button>
                                </td>
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
                            {renderPageNumbers()}
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
            </div>
        </div>
    );
};

export default Branch;
