import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [assetsPerPage] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [pageNumbersLimit] = useState(10); // Number of visible page numbers

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await axios.get("http://localhost:3000/auth/category");
        if (categoriesResponse.data.Status) {
          setCategories(categoriesResponse.data.Result);
        } else {
          alert(categoriesResponse.data.Error);
        }

        // Fetch branches
        const branchesResponse = await axios.get("http://localhost:3000/auth/branch");
        if (branchesResponse.data.Status) {
          setBranches(branchesResponse.data.Result);
        } else {
          alert(branchesResponse.data.Error);
        }

        // Fetch assets
        const assetsResponse = await axios.get("http://localhost:3000/auth/asset");
        if (assetsResponse.data.Status) {
          setAssets(assetsResponse.data.Result);
          setFilteredAssets(assetsResponse.data.Result); // Initialize with all assets
        } else {
          alert(assetsResponse.data.Error);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await axios.delete(`http://localhost:3000/auth/delete_asset/${id}`);
      if (result.data.Status) {
        setAssets(assets.filter((a) => a.id !== id));
        setFilteredAssets(filteredAssets.filter((a) => a.id !== id)); // Update filtered list
      } else {
        alert(result.data.Error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Function to get category name by ID
  const getCategoryName = (id) => {
    const category = categories.find((c) => c.id === id);
    return category ? category.name : "Unknown";
  };

  // Function to get branch name by ID
  const getBranchName = (id) => {
    const branch = branches.find((b) => b.id === id);
    return branch ? branch.branch : "Unknown";
  };

  // Filter assets based on selected category and branch
  useEffect(() => {
    let filtered = assets;
    if (categoryFilter) {
      filtered = filtered.filter(a => a.category_id === parseInt(categoryFilter));
    }
    if (branchFilter) {
      filtered = filtered.filter(a => a.branch_id === parseInt(branchFilter));
    }
    setFilteredAssets(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [categoryFilter, branchFilter, assets]);

  // Calculate the current assets to display
  const indexOfLastAsset = currentPage * assetsPerPage;
  const indexOfFirstAsset = indexOfLastAsset - assetsPerPage;
  const currentAssets = filteredAssets.slice(indexOfFirstAsset, indexOfLastAsset);

  // Handle pagination navigation
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers with limits
  const pageNumbers = [];
  const totalPages = Math.ceil(filteredAssets.length / assetsPerPage);
  const startPage = Math.max(1, currentPage - Math.floor(pageNumbersLimit / 2));
  const endPage = Math.min(totalPages, startPage + pageNumbersLimit - 1);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h5 className="text-success">Asset List</h5>
      </div>
      <Link to="/dashboard/add_asset" className="btn btn-success btn-sm mb-3">
        Add Asset
      </Link>
      <div>
        <div className="row mb-3">
          <div className="col-6">
            <select
              className="form-select"
              onChange={(e) => setCategoryFilter(e.target.value)}
              value={categoryFilter}
            >
              <option value="">Filter by Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <select
              className="form-select"
              onChange={(e) => setBranchFilter(e.target.value)}
              value={branchFilter}
            >
              <option value="">Filter by Branch</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.branch}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="table table-sm">
          <thead>
            <tr className="table-dark">
              <th className="small">Asset Type</th>
              <th className="small">Asset Name</th>
              <th className="small">Asset Tag</th>
              <th className="small">Serial No</th>
              <th className="small">Category</th>
              <th className="small">Branch</th>
              <th className="small">Year of Purchase</th>
              <th className="small">Condition</th>
              <th className="small">Action</th>
            </tr>
          </thead>
          <tbody className="table-secondary">
            {currentAssets.length > 0 ? (
              currentAssets.map((a) => (
                <tr key={a.id}>
                  <td className="small">{a.asset_type}</td>
                  <td className="small">{a.asset_name}</td>
                  <td className="small">{a.asset_tag}</td>
                  <td className="small">{a.serial_no}</td>
                  <td className="small">{getCategoryName(a.category_id)}</td>
                  <td className="small">{getBranchName(a.branch_id)}</td>
                  <td className="small">{a.year_of_purchase}</td>
                  <td className="small">{a.condition}</td>
                  <td>
                    <Link
                      to={`/dashboard/edit_asset/${a.id}`}
                      className="btn btn-success btn-sm me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleDelete(a.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">No assets found</td>
              </tr>
            )}
          </tbody>
        </table>
        <nav>
          <ul className="pagination justify-content-center">
            {currentPage > 1 && (
              <li className="page-item">
                <button onClick={() => paginate(currentPage - 1)} className="page-link">
                  &laquo;
                </button>
              </li>
            )}
            {pageNumbers.map(number => (
              <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                <button onClick={() => paginate(number)} className="page-link">
                  {number}
                </button>
              </li>
            ))}
            {currentPage < totalPages && (
              <li className="page-item">
                <button onClick={() => paginate(currentPage + 1)} className="page-link">
                  &raquo;
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Assets;
