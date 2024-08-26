import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    axios.post("http://localhost:3000/auth/admin/bulk_upload", formData)
      .then((result) => {
        if (result.data.message) {
          alert(result.data.message); // Display success message
          navigate("/dashboard/employee");
        } else {
          alert(`Error: ${result.data.error}`);
        }
      })
      .catch((err) => {
        console.error("Upload Error:", err);
        const errorMessage = err.response?.data?.error || "An unexpected error occurred.";
        alert(errorMessage);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border bg-dark-subtle">
        <h5 className="text-center">Bulk Upload Staff</h5>
        <form>
          <div className="col-12">
            <label htmlFor="file" className="form-label fw-bolder">
              Select File
            </label>
            <input
              type="file"
              className="form-control rounded-0"
              id="file"
              onChange={handleFileChange}
            />
          </div>
          <div className="col-12">
            <button type="button" className="btn btn-success w-100" onClick={handleUpload}>
              Upload File
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkUpload;
