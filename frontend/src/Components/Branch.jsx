import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Branch = () => {
    const [branch, setBranch] = useState([]);

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

    return (
        <div className='px-5 mt-3'>
            <div className='d-flex justify-content-center'>
                <h3>Branch List</h3>
            </div>
            <Link to="/dashboard/add_branch" className='btn btn-success'>Add Branch</Link>
            <div className='mt-3'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                        </tr>
                    </thead>
                    <tbody>
                        {branch.map(b => (
                            <tr key={b.id}>
                                <td>{b.branch}</td>
                                <td>{b.latitude}</td>
                                <td>{b.longitude}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Branch;