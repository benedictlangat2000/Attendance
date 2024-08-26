import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import multer from 'multer';
import xlsx from 'xlsx';




const router = express.Router();

router.post("/adminlogin", (req, res) => {
    const sql = "SELECT * from admin WHERE email = ?";
    con.query(sql, [req.body.email], (err, result) => {
      if (err) return res.json({ loginStatus: false, Error: "Query error" });
      if (result.length > 0) {
        // Compare the hashed password
        bcrypt.compare(req.body.password, result[0].password, (err, isMatch) => {
          if (err) return res.json({ loginStatus: false, Error: "Error comparing passwords" });
          if (isMatch) {
            const email = result[0].email;
            const token = jwt.sign(
              { role: "admin", email: email, id: result[0].id },
              "jwt_secret_key",
              { expiresIn: "1d" }
            );
            res.cookie('token', token, { httpOnly: true, secure: true });
            return res.json({ loginStatus: true });
          } else {
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
          }
        });
      } else {
        return res.json({ loginStatus: false, Error: "Wrong email or password" });
      }
    });
  });

router.get('/category', (req, res) => {
    const sql = "SELECT * FROM category";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

// Route to add a new category
router.post('/add_category', (req, res) => {
  const categoryName = req.body.category;

  // First, check if the category already exists
  const checkSql = "SELECT COUNT(*) AS count FROM category WHERE name = ?";
  con.query(checkSql, [categoryName], (err, result) => {
      if (err) {
          return res.json({ Status: false, Error: "Query Error" });
      }

      if (result[0].count > 0) {
          // If the category already exists, return an error response
          return res.json({ Status: false, Error: "Category already exists" });
      }

      // If the category does not exist, proceed with inserting it
      const insertSql = "INSERT INTO category (`name`) VALUES (?)";
      con.query(insertSql, [categoryName], (err, result) => {
          if (err) {
              return res.json({ Status: false, Error: "Query Error" });
          }
          return res.json({ Status: true });
      });
  });
});


// Route to update a category
router.put('/update_category/:id', (req, res) => {
  const sql = "UPDATE category SET name = ? WHERE id = ?";
  con.query(sql, [req.body.name, req.params.id], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error" });
      return res.json({ Status: true });
  });
});

// Route to delete a category
router.delete('/delete_category/:id', (req, res) => {
  const sql = "DELETE FROM category WHERE id = ?";
  con.query(sql, [req.params.id], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error" });
      return res.json({ Status: true });
  });
});


router.get('/branch', (req, res) => {
    const sql = "SELECT * FROM branch";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

// Route to get a specific branch by ID
router.get('/branch/:id', (req, res) => {
    const branchId = req.params.id;
    const sql = "SELECT * FROM branch WHERE id = ?";
    con.query(sql, [branchId], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"});
        if(result.length > 0) {
            return res.json({Status: true, Result: result[0]});
        } else {
            return res.status(404).json({Status: false, Error: "Branch not found"});
        }
    });
});
router.post('/add_branch', (req, res) => {
    const sql = "INSERT INTO branch (`branch`, `latitude`, `longitude`) VALUES (?, ?, ?)";
    con.query(sql, [req.body.branch, req.body.latitude, req.body.longitude], (err, result) => {
        if (err) {
            console.error("Query Error:", err.message); // Log the exact SQL error
            return res.json({ Status: false, Error: "Query Error: " + err.message });
        }
        return res.json({ Status: true });
    });
});


// Fetch all branches
router.get('/branch', (req, res) => {
  const sql = "SELECT * FROM branch";
  con.query(sql, (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error" });
      return res.json({ Status: true, Result: result });
  });
});

// Update an existing branch
router.put('/update_branch/:id', (req, res) => {
  const { id } = req.params;
  const { branch, latitude, longitude } = req.body;

  const sql = "UPDATE branch SET branch = ?, latitude = ?, longitude = ? WHERE id = ?";
  con.query(sql, [branch, latitude, longitude, id], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Failed to update branch" });
      return res.json({ Status: true, Message: "Branch updated successfully" });
  });
});

// Delete a branch
router.delete('/delete_branch/:id', (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM branch WHERE id = ?";
  con.query(sql, [id], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Failed to delete branch" });
      return res.json({ Status: true, Message: "Branch deleted successfully" });
  });
});

router.post('/add_employee', (req, res) => {
    const sql = `INSERT INTO employee 
                (name, email, password, branch_id, location, category_id) 
                VALUES (?, ?, ?, ?, ?, ?)`;
  
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) return res.status(500).json({ Status: false, Error: 'Password hashing error' });
  
      const values = [
        req.body.name,
        req.body.email,
        hash,
        req.body.branch_id,
        req.body.location,
        req.body.category_id
      ];
  
      con.query(sql, values, (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ Status: false, Error: 'Database error' });
        }
        return res.status(201).json({ Status: true, Message: 'Employee added successfully' });
      });
    });
  });


  // Multer configuration to store the file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Upload endpoint for handling employee data upload
router.post('/admin/bulk_upload', upload.single('file'), (req, res) => {
  try {
      // Parse the uploaded Excel file
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet);

      // Map JSON data to the required format for the database
      const employees = jsonData.map((row) => ({
          name: row.Name,
          email: row.Email,
          password: row.Password,
          branch_id: row['Branch ID'],
          location: row.Location,
          category_id: row['Category ID'],
      }));

      // Log the JSON data (optional, for debugging)
      console.log('Parsed employee data:', employees);

      // Prepare SQL query for bulk insert
      const sql = `INSERT INTO employee (name, email, password, branch_id, location, category_id) VALUES ?`;
      const values = employees.map((employee) => [
          employee.name,
          employee.email,
          employee.password,
          employee.branch_id,
          employee.location,
          employee.category_id,
      ]);

      // Execute the SQL query
      con.query(sql, [values], (err, result) => {
          if (err) {
              console.error('Database error:', err.code, err.sqlMessage);
              return res.status(500).json({ error: `Database error: ${err.sqlMessage}` });
          }

          // Send success response
          res.status(201).json({ message: 'Employees added successfully', result });
      });

  } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).json({ error: 'Failed to process the uploaded file' });
  }
});


router.get('/employee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})



router.get('/employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = `
        SELECT e.*, b.branch AS branch_name 
        FROM employee e
        JOIN branch b ON e.branch_id = b.id
        WHERE e.id = ?
    `;
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/edit_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE employee 
        SET name = ?, email = ?, location = ?, category_id = ?, branch_id = ? 
        WHERE id = ?`;
    
    const values = [
        req.body.name,
        req.body.email,
        req.body.location,     
        req.body.category_id,
        req.body.branch_id,
    ];

    con.query(sql, [...values, id], (err, result) => {
        if (err) {
            console.error("Query Error:", err); // Log the error for debugging
            return res.json({ Status: false, Error: "Query Error: " + err.message });
        }
        return res.json({ Status: true, Result: result });
    });
});


router.delete('/delete_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "delete from employee where id = ?"
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/admin_count', (req, res) => {
    const sql = "select count(id) as admin from admin";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/employee_count', (req, res) => {
    const sql = "select count(id) as employee from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/branch_count', (req, res) => {
    const sql = "select count(id) as branch from branch";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})


router.get('/category_count', (req, res) => {
  const sql = "select count(id) as category from category";
  con.query(sql, (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"+err})
      return res.json({Status: true, Result: result})
  })
})



router.get('/admin_records', (req, res) => {
    const sql = "select * from admin"
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

// Route for fetching attendance records
// Route for fetching attendance records based on employee and branch IDs
router.get('/attendance', (req, res) => {
    const sql = `
      SELECT 
        a.id AS attendance_id,
        a.checkin_date,
        a.checkout_date,
        a.checkin_ip,
        a.checkout_ip,  
        e.name AS employee_name,
        e.email AS employee_email,
        b.branch AS branch_name
      FROM 
        attendance a
      INNER JOIN 
        employee e ON a.employee_id = e.id
      INNER JOIN 
        branch b ON a.branch_id = b.id
      WHERE
        a.employee_id = e.id AND a.branch_id = b.id
      ORDER BY 
        a.checkin_date DESC
    `;
  
    con.query(sql, (err, result) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ Status: false, Error: "Query Error" });
      }
      return res.status(200).json({ Status: true, Result: result });
    });
  });


 // Route for fetching attendance records for the logged-in user without date filtering
router.get('/attendance/report/:id', (req, res) => {
  const userId = req.params.id; // Get the user ID from the URL parameter

  let sql = `
    SELECT 
      a.id AS attendance_id,
      a.checkin_date,
      a.checkout_date,
      a.checkin_ip,
      a.checkout_ip,  
      e.name AS employee_name,
      e.email AS employee_email,
      b.branch AS branch_name
    FROM 
      attendance a
    INNER JOIN 
      employee e ON a.employee_id = e.id
    INNER JOIN 
      branch b ON a.branch_id = b.id
    WHERE
      a.employee_id = ?
    ORDER BY a.checkin_date DESC
  `;

  con.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }
    return res.status(200).json({ Status: true, Result: result });
  });
});



 
// Function to get IP address from request headers
const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown IP';
};

// Route for handling employee check-in
router.post('/attendance/checkin', (req, res) => {
  const { employee_id, branch_id, checkin_date } = req.body;
  const checkin_ip = getClientIP(req);

  if (!employee_id || !branch_id || !checkin_date) {
    return res.status(400).json({ Status: false, Error: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO attendance (employee_id, branch_id, checkin_date, checkin_ip)
    VALUES (?, ?, ?, ?)
  `;

  con.query(sql, [employee_id, branch_id, checkin_date, checkin_ip], (err, result) => {
    if (err) {
      console.error('Error inserting check-in record:', err.message);
      return res.status(500).json({ Status: false, Error: 'Error checking in', Details: err.message });
    }
    return res.status(201).json({
      Status: true,
      Message: 'Attendance submitted successfully',
      id: result.insertId,
      employee_id,
      branch_id,
      checkin_date,
      checkin_ip
    });
  });
});

// Route for handling employee check-out
router.post('/attendance/checkout', (req, res) => {
  const { employee_id, branch_id, checkout_date } = req.body;
  const checkout_ip = getClientIP(req);

  if (!employee_id || !branch_id || !checkout_date) {
    return res.status(400).json({ Status: false, Error: 'Missing required fields' });
  }

  // Extract only the date part from checkout_date
  const checkinDate = new Date(checkout_date).toISOString().split('T')[0];

  const sql = `
    UPDATE attendance 
    SET checkout_date = ?, checkout_ip = ? 
    WHERE employee_id = ? AND branch_id = ? AND DATE(checkin_date) = ? AND checkout_date IS NULL
  `;

  con.query(sql, [checkout_date, checkout_ip, employee_id, branch_id, checkinDate], (err, result) => {
    if (err) {
      console.error('Error updating checkout record:', err.message);
      return res.status(500).json({ Status: false, Error: 'Error updating checkout record', Details: err.message });
    }
  
    if (result.affectedRows === 0) {
      console.warn('No matching check-in record found to update.', {
        employee_id,
        branch_id,
        checkinDate
      });
      return res.status(404).json({ Status: false, Error: 'No matching check-in record found to update.' });
    }
  
    return res.status(200).json({
      Status: true,
      employee_id,
      branch_id,
      checkout_date,
      checkout_ip,
      Message: 'Checkout successfully recorded'
    });
  });
});




router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
});

export { router as adminRouter };
