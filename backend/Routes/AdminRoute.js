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
    const sql = "SELECT * FROM employee WHERE id = ?";
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

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
});

export { router as adminRouter };
