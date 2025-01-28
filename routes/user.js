import express from 'express';
import jwt from 'jsonwebtoken';
import knex from '../db/knex.js'; // Your database connection

const router = express.Router(); // Use Router, not app

// Add this route for fetching the logged-in user's details
router.get('/', async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token
  
  if (!token) {
    return res.status(401).json({ error: "Authorization token is missing." });
  }

  try {
    // Verify the token and get the decoded data
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');

    // Fetch the user data from the database using userId from the token
    const user = await knex('users').where({ user_id: decoded.userId }).first();

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Return the user data
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to authenticate token." });
  }
});

export default router;