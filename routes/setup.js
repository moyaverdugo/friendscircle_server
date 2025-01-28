import express from 'express';
import knex from '../db/knex.js'; // Assuming you're exporting the knex instance from a db file
import bcrypt from 'bcrypt';
import { format } from 'date-fns';

const router = express.Router();

// Post request to insert the data into the users table
router.post('/', async (req, res) => {
  console.log('Request body:', req.body);
  const {
    phone, firstName, lastName, address, zipcode, email, password, birthdate, profileImage,
  } = req.body;

  if (!firstName || !lastName || !address || !zipcode || !email ||!password || !birthdate ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {

    // Check if phone number already exists for an active user
    const existingUser = await knex('users')
      .where({ user_phonenumber: phone, user_status: 'active' })
      .first();

    if (existingUser) {
      return res.status(409).json({ error: 'Phone number is already in use by an active user.' });
    }
    
    // Hash password before saving for security
    const hashedPassword = await bcrypt.hash(password, 10); 

    // Format the birthdate to 'YYYY-MM-DD'
    const formattedBirthdate = format(new Date(birthdate), 'yyyy-MM-dd');

    // Insert the user into the database
    await knex('users').insert({
      user_phonenumber: phone,
      user_name: firstName,
      user_lastname: lastName,
      user_address: address,
      user_postalcode: zipcode,
      user_email: email,
      user_password: hashedPassword,
      user_birthdate: formattedBirthdate, // formatted date
      user_profileimage: profileImage, // Make sure this is a URL if uploaded externally
      user_status: 'new', 
    });

    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Server error, try again later'  });
  }
});

export default router;

