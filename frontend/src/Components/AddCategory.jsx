import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AddCategory = () => {
    const [category, setCategory] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            // Check if the category already exists
            const checkResult = await axios.get(`http://localhost:3000/auth/category?name=${category}`)
            if (checkResult.data.Status && checkResult.data.Exists) {
                alert('Category already exists');
                return;
            }

            // If the category does not exist, proceed with adding it
            const result = await axios.post('http://localhost:3000/auth/add_category', { category })
            if (result.data.Status) {
                navigate('/dashboard/category')
            } else {
                alert(result.data.Error)
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='d-flex justify-content-center align-items-center h-75'>
            <div className='p-3 rounded w-25 border'>
                <h5 className="text-center">Add Category</h5>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="category"><strong>Category:</strong></label>
                        <input 
                            type="text" 
                            name='category' 
                            placeholder='Enter Category'
                            onChange={(e) => setCategory(e.target.value)} 
                            className='form-control rounded-0'
                        />
                    </div>
                    <button className='btn btn-success w-100 rounded-0 mb-2'>Add Category</button>
                </form>
            </div>
        </div>
    )
}

export default AddCategory
