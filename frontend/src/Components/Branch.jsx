import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Branch = () => {
    const [branch, setBranch] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [branchesPerPage] = useState(10); // Number of branches per page

    useEffect(() => {
        axios.get('http://localhost:3000/auth/branch')
            .then(result => {
                console.log("API Response:", result.data); // Log the response data
                if (result.data.Status) {
                    setBranch(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => {
                console.error("Fetch Error:", err);
                alert("An error occurred while fetching branches.");
            });
    }, []);

    const indexOfLastBranch = currentPage * branchesPerPage;
    const indexOfFirstBranch = indexOfLastBranch - branchesPerPage;
    const currentBranches = branch.slice(indexOfFirstBranch, indexOfLastBranch);

    const totalPages = Math.ceil(branch.length / branchesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className='px-5 mt-3'>
            <div className='d-flex justify-content-center'>
                <h3>Branch List</h3>
            </div>
            <Link to="/dashboard/add_branch" className='btn btn-success'>Add Branch</Link>
            <div className='mt-3'>
                <table className='table'>
                    <thead className='table-dark'>
                        <tr>
                            <th>Name</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                        </tr>
                    </thead>
                    <tbody className='table-secondary'>
                        {currentBranches.map(b => (
                            <tr key={b.id}>
                                <td>{b.branch}</td>
                                <td>{b.latitude}</td>
                                <td>{b.longitude}</td>
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
            </div>
        </div>
    );
};

export default Branch;
