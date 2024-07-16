
const express = require('express');
const router = express.Router();
const { RegisterSchema, LoginSchema } = require('../schemas/user');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');


const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input against RegisterSchema
    RegisterSchema.parse({ email, password, name });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if(existingUser){
      return res.status(401).json({success:false,message:"User Already Exists",token:null});
    }

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
       email: email.toLowerCase(),
        password: hashedPassword,
        name
      }
    });

    // Remove password from user object before sending back
    newUser.password = null;
    const userFolderPath = path.join(__dirname, '..', 'uploads', `user_${newUser.id}`);
    fs.mkdirSync(userFolderPath, { recursive: true });

    // Generate JWT token
    const token = jwt.sign({ 
        name:newUser.name,id:newUser.id,email:newUser.email
     }, process.env.AUTH_SECRET);

     
    // Set token as a cookie
    // Respond with success message
    return res.status(200).json({success:true,message:"Account created successfully",token,name:newUser.name,email:newUser.email});
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input against RegisterSchema
    LoginSchema.parse({ email, password });

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if(!existingUser){
      return res.status(401).json({success:false,message:"User not found",token:null});
    }
    // Hash the password
    const passwordsMatch =await bcrypt.compare(password,existingUser.password);
    if(!passwordsMatch){
      return res.status(401).json({success:false,message:"Invalid Credentials",token:null});
    }


    // Generate JWT token
    const token = jwt.sign({ 
        name:existingUser.name,id:existingUser.id,email:existingUser.email
     }, process.env.AUTH_SECRET);

    // Set token as a cookie
    res.cookie('mytoken', token);
    // Respond with success message
    return res.status(200).json({success:true,message:"Login in Successfully",token,name:existingUser.name,email:existingUser.email});
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
