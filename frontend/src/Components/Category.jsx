import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [categoriesPerPage] = useState(10); // Number of categories per page
    const [maxPageLinks] = useState(5); // Number of page links to display

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const result = await axios.get('http://localhost:3000/auth/category');
            if (result.data.Status) {
                setCategories(result.data.Result);
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            alert("An error occurred while fetching categories.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                const result = await axios.delete(`http://localhost:3000/auth/delete_category/${id}`);
                if (result.data.Status) {
                    fetchCategories(); // Refresh the category list after deletion
                } else {
                    alert(result.data.Error);
                }
            } catch (err) {
                console.error("Delete Error:", err);
                alert("An error occurred while deleting the category.");
            }
        }
    };

    const handleEdit = (id, currentName) => {
        const newName = prompt("Enter the new category name:", currentName);
        if (newName && newName.trim()) {
            axios.put(`http://localhost:3000/auth/update_category/${id}`, { name: newName })
                .then(result => {
                    if (result.data.Status) {
                        fetchCategories(); // Refresh the category list after update
                    } else {
                        alert(result.data.Error);
                    }
                })
                .catch(err => {
                    console.error("Update Error:", err);
                    alert("An error occurred while updating the category.");
                });
        } else if (newName !== null) {
            alert("Category name cannot be empty.");
        }
    };

    // Calculate pagination
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

    const totalPages = Math.ceil(categories.length / categoriesPerPage);

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

    // Create rows every two items with actions and numbering
    const rows = [];
    for (let i = 0; i < currentCategories.length; i += 2) {
        rows.push(
            <tr key={i}>
                <td>
                    {(indexOfFirstCategory + i + 1) + '.'} {currentCategories[i]?.name || ''}
                    {currentCategories[i] && (
                        <div className="mt-1">
                            <button onClick={() => handleEdit(currentCategories[i].id, currentCategories[i].name)} className="btn btn-success btn-sm me-2">Edit</button>
                            <button onClick={() => handleDelete(currentCategories[i].id)} className="btn btn-warning btn-sm">Delete</button>
                        </div>
                    )}
                </td>
                <td>
                    {(indexOfFirstCategory + i + 2) + '.'} {currentCategories[i + 1]?.name || ''}
                    {currentCategories[i + 1] && (
                        <div className="mt-1">
                            <button onClick={() => handleEdit(currentCategories[i + 1].id, currentCategories[i + 1].name)} className="btn btn-success btn-sm me-2">Edit</button>
                            <button onClick={() => handleDelete(currentCategories[i + 1].id)} className="btn btn-warning btn-sm">Delete</button>
                        </div>
                    )}
                </td>
            </tr>
        );
    }

    return (
        <div className='px-5 mt-3'>
            <div className='d-flex justify-content-center'>
                <h3>Category List</h3>
            </div>
            <Link to="/dashboard/add_category" className='btn btn-success mb-3 btn-sm'>Add Category</Link>
            <div className='card'>
                <div className='card-body'>
                    <div className='table-responsive'>
                        <table className='table'>
                            <thead className='table-dark'>
                                <tr>
                                    <th className="small">Name</th>
                                    <th className="small">Name</th>
                                </tr>
                            </thead>
                            <tbody className='table-secondary small'>
                                {rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
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
    );
};

export default Category;
