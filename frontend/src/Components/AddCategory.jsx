import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
    const [category, setCategory] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!category) {
            alert('Category name cannot be empty');
            return;
        }
    
        try {
            const result = await axios.post('http://localhost:3000/auth/add_category', { category });
            
            if (result.data.Status) {
                navigate('/dashboard/category');
            } else {
                alert(result.data.Error);
            }
        } catch (err) {
            console.error('Error while adding category:', err);
            alert('An error occurred while adding the category. Please try again.');
        }
    };
    
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
                            value={category}
                            onChange={(e) => setCategory(e.target.value)} 
                            className='form-control rounded-0'
                        />
                    </div>
                    <button type="submit" className='btn btn-success w-100 rounded-0 mb-2'>Add Category</button>
                </form>
            </div>
        </div>
    );
};

export default AddCategory;
