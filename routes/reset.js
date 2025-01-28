import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import knex from '../db/knex.js';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const router = express.Router();

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and new password are required." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { user_email } = decoded;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const updatedRows = await knex('users').where({ user_email }).update({ user_password: hashedPassword });

    if (updatedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(400).json({ error: "Invalid or expired token." });
  }
});

export default router;