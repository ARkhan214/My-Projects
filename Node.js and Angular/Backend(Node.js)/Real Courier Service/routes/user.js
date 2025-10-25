const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



//  JWT Secret Key (you can store this in .env file)
const JWT_SECRET = 'your_super_secret_key_here';




//  Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/user');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


//  Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save to uploads/user
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now(); // unique timestamp
    const ext = path.extname(file.originalname);
    const userName = req.body.name ? req.body.name.replace(/\s+/g, '_') : 'user';
    cb(null, `${userName}_${uniqueSuffix}${ext}`); // e.g. emran_1729334221555.jpg
  }
});



const upload = multer({ storage: storage })





router.post('/save', upload.single('photo'), async (req, res) => {


 try {
    const { name, email, password, phone } = req.body;
    const activeStatus_value = true;
    const userRole = 'CONSUMER';
    const photo = req.file ? `user/${req.file.filename}` : null;

    //  Encrypt the password
    const hashedPassword =await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO user (name, email, password, phone, role, photo, activeStatus) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, email, hashedPassword, phone, userRole, photo, activeStatus_value], (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'User registered successfully!', id: result.insertId });
    });
  } catch (error) {
    res.status(500).send({ message: 'Error saving user', error });
  }
});



//  READ
router.get('/all', (req, res) => {
    const sql = 'SELECT * FROM user';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});




// UPDATE
router.put('/update/:id', upload.single('photo'), (req, res) => {
    const { name, email, password, phone } = req.body;
    const activeStatus_value = true;
    const userRole = 'CONSUMER';
    const { id } = req.params;
    const photo = req.file ? `user/${req.file.filename}` : req.body.oldPhoto;

    const sql = 'UPDATE user SET name = ?, email = ?,password=?, phone=?, role=?, photo=?, activeStatus=?    WHERE id = ?';
    db.query(sql, [name, email, password, phone, userRole, photo, activeStatus_value, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'User updated successfully!' });
    });
});


// DELETE
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM user WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'User deleted successfully!' });
  });
});





// LOGIN USER
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM user WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send({ message: 'Invalid email or password' });

    const user = results[0];

    //  Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send({ message: 'Invalid email or password' });



     //  Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' } // expires in 1 hour
    );





    res.send({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo
      }
    });
  });
});





//  Serve static files from uploads/user
router.use('/uploads/user', express.static(path.join(__dirname, '../uploads/user')));

module.exports = router;