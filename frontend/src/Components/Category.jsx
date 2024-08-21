import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Category = () => {

    const [category, setCategory] = useState([])

    useEffect(()=> {
        axios.get('http://localhost:3000/auth/category')
        .then(result => {
            if(result.data.Status) {
                setCategory(result.data.Result);
            } else {
                alert(result.data.Error)
            }
        }).catch(err => console.log(err))
    }, [])


    return (
        <div className='px-5 mt-3'>
            <div className='card'>
                <div className='card-header text-black text-center'>
                    <h5>Category List</h5>
                </div>
                <div className='card-body'>
                    <Link to="/dashboard/add_category" className='btn btn-success btn-sm mb-3'>Add Category</Link>
                    <div className='table-responsive'>
                        <table className='table'>
                            <thead className='text-white bg-danger-subtle'>
                                <tr>
                                    <th>Name</th>
                                    <th>Name</th>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {
                                    category.map((c, index) => {
                                        // Create a new row every three items
                                        if (index % 3 === 0) {
                                            return (
                                                <tr key={index}>
                                                    <td>{c.name}</td>
                                                    <td>{category[index + 1]?.name || ''}</td>
                                                    <td>{category[index + 2]?.name || ''}</td>
                                                </tr>
                                            );
                                        }
                                        return null;
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Category
