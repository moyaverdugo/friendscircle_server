import express from 'express';
import knex from '../db/knex.js'; // Assuming you're exporting the knex instance from a db file
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Phone number and password are required." });
  }

  try {
    // Fetch user by phone number
    const user = await knex('users').where({ user_phonenumber: username }).first();

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Compare password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.user_password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid phone number or password." });
    }

    // Generate an authentication token (using JWT)
    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '1h' }
    );

    // Include user data in the response
    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user.user_id,
        name: user.user_name,
        email: user.user_email,
        phoneNumber: user.user_phonenumber,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error, please try again later." });
  }
});

export default router;