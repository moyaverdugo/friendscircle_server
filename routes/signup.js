import express from 'express';
import knex from '../db/knex.js'; // Database connection
import twilio from 'twilio'; // Twilio SDK
import crypto from 'crypto';

const router = express.Router();

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/', async (req, res) => {
  const { phoneNumber } = req.body;
  console.log(phoneNumber);
  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required." });
  }

  try {
    const verificationCode = generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); //time for verification to expire

   // Check if the phone number already exists
   const existingEntry = await knex('verification_codes')
   .where({ phone_number: phoneNumber })
   .first();

 if (existingEntry) {
   // Update the existing record
   await knex('verification_codes')
     .where({ phone_number: phoneNumber })
     .update({
       code: verificationCode,
       created_at: new Date(),
       expires_at: expiresAt,
       verified: false,
     });
 } else {
   // Insert a new record
   await knex('verification_codes').insert({
     phone_number: phoneNumber,
     code: verificationCode,
     created_at: new Date(),
     expires_at: expiresAt,
     verified: false,
   });
 }

    // Send SMS using Twilio
    await twilioClient.messages.create({
      body: `Your verification code is: ${verificationCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    res.status(200).json({ message: "Verification code sent." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send SMS. Please try again later." });
  }
});

export default router;