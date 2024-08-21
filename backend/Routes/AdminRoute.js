import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'




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

router.post('/add_category', (req, res) => {
    const sql = "INSERT INTO category (`name`) VALUES (?)"
    con.query(sql, [req.body.category], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

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
        a.ip_address,
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
  
router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
});

export { router as adminRouter };
