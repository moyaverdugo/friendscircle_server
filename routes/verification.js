import express from 'express';
import knex from '../db/knex.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { phoneNumber, code } = req.body;
  console.log("Received payload:", { phoneNumber, code });
  
  if (!phoneNumber || !code) {
    return res.status(400).json({ error: "Phone number and code are required." });
  }

  try {
    const record = await knex('verification_codes')
      .where({ phone_number: phoneNumber, code })
      .orderBy('created_at', 'desc')
      .first();

    if (!record) {
      console.log(`No record found for phoneNumber: ${phoneNumber}, code: ${code}`);
      return res.status(400).json({ error: "Invalid verification code." });
    }

    const currentTime = new Date();
    if (new Date(record.expires_at) < currentTime) {
      return res.status(400).json({ error: "Verification code has expired." });
    }

    if (record.verified) {
      return res.status(400).json({ error: "Verification code has already been used." });
    }

    await knex('verification_codes')
      .where({ id: record.id })
      .update({ verified: true });

    res.status(200).json({ 
      message: "Verification successful.", 
      phoneNumber: record.phone_number 
    });
  } catch (error) {
    console.error("Error validating verification code:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
});

export default router;