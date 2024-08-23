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


router.post("/employee_signup", (req, res) => {
  const { name, email, password, branchId, categoryId, location } = req.body;

  // Check if email already exists
  const checkEmailQuery = "SELECT * FROM employee WHERE email = ?";
  con.query(checkEmailQuery, [email], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });
    if (result.length > 0) {
      return res.json({ Status: false, Error: "User already exists" });
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