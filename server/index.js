const express = require('express');
const app = express();
const port = 3002;
const cors = require('cors');
var cookieParser = require('cookie-parser')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')
const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
// Load environment variables from .env file
dotenv.config();

// Middleware setup
app.use(express.json());
app.use(cookieParser())
// Middleware to serve static files from the uploads folder

// Middleware to serve static files from the uploads folder
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));


// CORS setup
const corsOptions = {
  origin: 'http://localhost:3001', // Allow requests from this origin
  optionsSuccessStatus: 200 // Some legacy browsers (e.g., IE11) may require this option
};
app.use(cors(corsOptions));


const jwtMiddleware = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token not provided' });
  }

  jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Token is not valid' });
    }

    // Attach the decoded data to the request object
    req.user = decoded;
    next();
  });
};


// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/folder', jwtMiddleware,require('./routes/folder'));
app.use('/api/userContent', jwtMiddleware, require('./routes/userContent'));
app.use('/api/files', jwtMiddleware, require('./routes/files'));


// Root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});



// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
