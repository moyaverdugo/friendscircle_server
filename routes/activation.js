import express from 'express';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import knex from '../db/knex.js';

dotenv.config(); // Load environment variables

const router = express.Router();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/send-link', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }

    try {
        // Generate a token with expiration (1 hour)
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Construct the activation link
        const activationLink = `http://localhost:5173/activation?token=${token}`;

        // Send the email using SendGrid
        const msg = {
            to: email, // Recipient email
            from: { email: process.env.SENDGRID_SENDER_EMAIL, name: 'Friends Circle' }, // Ensure this is verified
            subject: 'Activate Your Account',
            html: `<p>Click <a href="${activationLink}">here</a> to activate your account.</p>`,
        };

        await sgMail.send(msg);

        res.status(200).json({ message: "Activation link sent successfully." });
    } catch (error) {
        console.error("Error sending activation link:", error.response?.body?.errors || error.message);
        res.status(500).json({ error: "Failed to send activation link. Please try again later." });
    }
});

router.post('/verify-token', async (req, res) => {
    const { token } = req.body;
    console.log("Received token:", token);

    if (!token) {
        return res.status(400).json({ error: "Token is required." });
    }

    try {
        const { email } = jwt.verify(token, process.env.JWT_SECRET);

        const updatedRows = await knex('users').where({ user_email: email }).update({ user_status: 'active' });

        if (updatedRows === 0) {
            return res.status(404).json({ error: "User not found or already activated." });
        }

        res.status(200).json({ message: "Account activated successfully." });
    } catch (error) {
        console.error("Token verification failed:", error.message);
        res.status(400).json({ error: "Invalid or expired token." });
    }
});

export default router;