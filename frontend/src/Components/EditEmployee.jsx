import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EditEmployee = () => {
    const {id} = useParams();
    const [employee, setEmployee] = useState({
        name: "",
        email: "",
        location: "",
        branch_id: "",  
        category_id: "",
    });

    const [category, setCategory] = useState([]);
    const [branches, setBranches] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch categories
        axios.get('http://localhost:3000/auth/category')
            .then(result => {
                if (result.data.Status) {
                    setCategory(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            }).catch(err => console.log(err));

        // Fetch employee data
        axios.get(`http://localhost:3000/auth/employee/${id}`)
            .then(result => {
                setEmployee({
                    ...employee,
                    name: result.data.Result[0].name,
                    email: result.data.Result[0].email,
                    branch_id: result.data.Result[0].branch_id,
                    location: result.data.Result[0].location,
                    category_id: result.data.Result[0].category_id,
                });
            }).catch(err => console.log(err));

        // Fetch branches
        axios.get('http://localhost:3000/auth/branch')
            .then(result => {
                if (result.data.Status) {
                    setBranches(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            }).catch(err => console.log(err));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3000/auth/edit_employee/${id}`, employee)
            .then(result => {
                if (result.data.Status) {
                    navigate('/dashboard/employee');
                } else {
                    alert(result.data.Error);
                }
            }).catch(err => console.log(err));
    }

    return (
        <div className="d-flex justify-content-center align-items-center mt-3">
            <div className="p-3 rounded w-50 border">
                <h3 className="text-center">Edit Employee</h3>
                <form className="row g-1" onSubmit={handleSubmit}>
                    <div className="col-12">
                        <label htmlFor="inputName" className="form-label">
                            Name
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-0"
                            id="inputName"
                            placeholder="Enter Name"
                            value={employee.name}
                            onChange={(e) =>
                                setEmployee({ ...employee, name: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputEmail4" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control rounded-0"
                            id="inputEmail4"
                            placeholder="Enter Email"
                            autoComplete="off"
                            value={employee.email}
                            onChange={(e) =>
                                setEmployee({ ...employee, email: e.target.value })
                            }
                        />
                    </div>
                    <div className='col-12'>
                        <label htmlFor="inputLocation" className="form-label">
                            Location
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-0"
                            id="inputLocation"
                            placeholder="Enter Location"
                            autoComplete="off"
                            value={employee.location}
                            onChange={(e) =>
                                setEmployee({ ...employee, location: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="category" className="form-label">
                            Category
                        </label>
                        <select name="category" id="category" className="form-select"
                            value={employee.category_id}
                            onChange={(e) => setEmployee({ ...employee, category_id: e.target.value })}
                        >
                            <option value="" disabled>Select Category</option>
                            {category.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12">
                        <label htmlFor="branch" className="form-label">
                        Branch
                        </label>
                        <select
                        name="branch"
                        id="branch"
                        className="form-select"
                        style={{ color: '#000', backgroundColor: '#fff' }} // Inline styles for text color and background
                        value={employee.branch_id}
                        onChange={(e) => setEmployee({ ...employee, branch_id: e.target.value })}
                        >
                        <option value="" disabled>Select Branch</option>
                        {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                            {b.branch}
                            </option>
                        ))}
                        </select>
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary w-100">
                            Edit Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditEmployee;
