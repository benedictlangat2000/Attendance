import express from 'express'
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const router = express.Router()
router.post("/employee_login", (req, res) => {
  const sql = "SELECT * from employee WHERE email = ?";
  con.query(sql, [req.body.email], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      bcrypt.compare(req.body.password, result[0].password, (err, response) => {
        if (err) return res.json({ loginStatus: false, Error: "Error comparing passwords" });
        if (response) {
          const email = result[0].email;
          const token = jwt.sign(
            { role: "employee", email: email, id: result[0].id },
            "jwt_secret_key",
            { expiresIn: "1d" }
          );
          res.cookie('token', token, { httpOnly: true, secure: true });
          return res.json({ loginStatus: true, id: result[0].id });
        } else {
          return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
      });
    } else {
      return res.json({ loginStatus: false, Error: "Wrong email or password" });
    }
  });
});


  router.get('/detail/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?"
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Status: false});
        return res.json(result)
    })
  })

  router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
  })


  // Checkin Route
router.post('/attendance/checkin', async (req, res) => {
  const { employee_id, branch_id, checkin_date } = req.body;
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    const [result] = await pool.query(
      'INSERT INTO attendance (employee_id, branch_id, checkin_date, ip_address) VALUES (?, ?, ?, ?)',
      [employee_id, branch_id, checkin_date, ipAddress]
    );
    res.status(201).json({
      id: result.insertId,
      employee_id,
      branch_id,
      checkin_date,
      ip_address: ipAddress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Checkout Route
router.post('/attendance/checkout', async (req, res) => {
  const { employee_id, branch_id, checkout_date } = req.body;
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    const [result] = await pool.query(
      'UPDATE attendance SET checkout_date = ?, ip_address = ? WHERE employee_id = ? AND branch_id = ? AND checkout_date IS NULL',
      [checkout_date, ipAddress, employee_id, branch_id]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'No check-in record found to update.' });
    } else {
      res.status(200).json({
        employee_id,
        branch_id,
        checkout_date,
        ip_address: ipAddress
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/employee_signup", (req, res) => {
  const { name, email, password, branchId, categoryId, location } = req.body;

  // Check if email already exists
  const checkEmailQuery = "SELECT * FROM employee WHERE email = ?";
  con.query(checkEmailQuery, [email], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });
    if (result.length > 0) {
      return res.json({ Status: false, Error: "Email already exists" });
    } else {
      // Hash the password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.json({ Status: false, Error: "Error hashing password" });

        // Insert new employee record
        const insertEmployeeQuery = `INSERT INTO employee (name, email, password, branch_id, category_id, location) VALUES (?, ?, ?, ?, ?, ?)`;
        con.query(
          insertEmployeeQuery,
          [name, email, hashedPassword, branchId, categoryId, location],
          (err, result) => {
            if (err) return res.json({ Status: false, Error: "Insert query error" });
            return res.json({ Status: true, Message: "Employee registered successfully" });
          }
        );
      });
    }
  });
});

export {router as EmployeeRouter}