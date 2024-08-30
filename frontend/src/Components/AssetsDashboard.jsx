import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Card } from 'react-bootstrap'; // Ensure react-bootstrap is installed

const AssetsDashboard = () => {
  // Placeholder data for totals (replace with actual data from your state or props)
  const assetTotal = 120; // Example value
  const categoryTotal = 15; // Example value
  const branchTotal = 10; // Example value

  

  return (
    <div className="container mt-5">
      {/* Stats Cards */}
      <div className="p-3 d-flex justify-content-around mt-3">
        <div className="px-4 pt-2 pb-3 border shadow-sm bg-danger-subtle" style={{ width: '24%' }}>
          <div className="text-center pb-1">
            <h5>Total Assets</h5>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{assetTotal}</h5>
          </div>
        </div>
        <div className="px-4 pt-2 pb-3 border shadow-sm bg-info-subtle" style={{ width: '24%' }}>
          <div className="text-center pb-1">
            <h5>Assets Categories</h5>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{categoryTotal}</h5>
          </div>
        </div>
        <div className="px-4 pt-2 pb-3 border shadow-sm bg-warning-subtle" style={{ width: '24%' }}>
          <div className="text-center pb-1">
            <h5>Assets Assigned</h5>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{branchTotal}</h5>
          </div>
        </div>
      </div>

      {/* Navigation Card */}
      <div className="mt-3">
        <Card className="text-center">
          <Card.Header>
            <h4>Asset Management</h4>
          </Card.Header>
          <Card.Body>
            <Card.Title>Manage Your Assets</Card.Title>
            <Card.Text>
              Use the options below to manage assets effectively.
            </Card.Text>
            <div className="d-grid gap-2">
              <Link to="/dashboard/asset_types_list" className="btn btn-primary btn-lg">
                View Assets Categories
              </Link>
              <Link to="/dashboard/assets" className="btn btn-warning btn-lg">
                View Assets
              </Link>
              <Link to="/view-categories" className="btn btn-info btn-lg">
                View Asset Categories
              </Link>
            </div>
          </Card.Body>
          <Card.Footer className="text-muted">
            Manage all your assets from this dashboard.
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default AssetsDashboard;
