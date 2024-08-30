import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AssetTypesList = () => {
    const [assetTypes, setAssetTypes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [assetTypesPerPage] = useState(10); // Number of asset types per page
    const [maxPageLinks] = useState(5); // Number of page links to display

    useEffect(() => {
        fetchAssetTypes();
    }, []);

    const fetchAssetTypes = async () => {
        try {
            const result = await axios.get('http://localhost:3000/auth/asset_types');
            if (result.data.Status) {
                setAssetTypes(result.data.Result);
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            alert("An error occurred while fetching asset types.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this asset type?')) {
            try {
                const result = await axios.delete(`http://localhost:3000/auth/delete/asset_types/${id}`);
                if (result.data.Status) {
                    fetchAssetTypes(); // Refresh the asset type list after deletion
                } else {
                    alert(result.data.Error);
                }
            } catch (err) {
                console.error("Delete Error:", err);
                alert("An error occurred while deleting the asset type.");
            }
        }
    };

    const handleEdit = (id, currentName) => {
        const newName = prompt("Enter the new asset type name:", currentName);
        if (newName) {
            axios.put(`http://localhost:3000/auth/update/asset_types/${id}`, { name: newName })
                .then(result => {
                    if (result.data.Status) {
                        fetchAssetTypes(); // Refresh the asset type list after update
                    } else {
                        alert(result.data.Error);
                    }
                })
                .catch(err => {
                    console.error("Update Error:", err);
                    alert("An error occurred while updating the asset type.");
                });
        } else {
            alert("Name is required.");
        }
    };

    const indexOfLastAssetType = currentPage * assetTypesPerPage;
    const indexOfFirstAssetType = indexOfLastAssetType - assetTypesPerPage;
    const currentAssetTypes = assetTypes.slice(indexOfFirstAssetType, indexOfLastAssetType);

    const totalPages = Math.ceil(assetTypes.length / assetTypesPerPage);

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
                <h3>Asset Types List</h3>
            </div>
            <Link to="/dashboard/add_asset_type" className='btn btn-success btn-sm'>Add Asset Type</Link>
            <div className='mt-3'>
                <table className='table'>
                    <thead className='table-dark'>
                        <tr>
                            <th className="small">ID</th>
                            <th className="small">Name</th>
                            <th className="small">Actions</th>
                        </tr>
                    </thead>
                    <tbody className='table-secondary small'>
                        {currentAssetTypes.map((type, index) => (
                            <tr key={type.id}>
                                <td>{indexOfFirstAssetType + index + 1}</td>
                                <td>{type.name}</td>
                                <td>
                                    <button onClick={() => handleEdit(type.id, type.name)} className="btn btn-success btn-sm me-2">Edit</button>
                                    <button onClick={() => handleDelete(type.id)} className="btn btn-warning btn-sm">Delete</button>
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

export default AssetTypesList;
