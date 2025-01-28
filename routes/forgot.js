import express from 'express';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import knex from '../db/knex.js';

dotenv.config(); // Load environment variables

const router = express.Router();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
  
    try {
      // Check if user exists in the database
      const user = await knex('users').where({ user_email: email }).first();
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      // Generate a token with expiration (1 hour)
      const token = jwt.sign({ user_email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Construct the reset link
      const resetLink = `http://localhost:5173/reset/reset-password?token=${token}`;
  
      // Send the email using SendGrid
      const msg = {
        to: email, // Recipient email
        from: { email: process.env.SENDGRID_SENDER_EMAIL, name: 'Friends Circle' }, // Corrected 'from' field
        subject: 'Reset Your Password',
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
      };
  
      await sgMail.send(msg);
  
      res.status(200).json({ message: "Password reset link sent successfully." });
    } catch (error) {
      console.error("Error sending password reset link:", error.response?.body?.errors || error.message);
      res.status(500).json({ error: "Failed to send password reset link. Please try again later." });
    }
  });

export default router;