// const express = require('express');
// const router = express.Router();
// const { PrismaClient } = require('@prisma/client');
// const path = require('path')
// const prisma = new PrismaClient();
// const multer  = require('multer')



// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const userId = req.user.id;
//     const rootFolder = req.body.rootFolder;
//     console.log(rootFolder)

//     // Create a folder structure based on user ID and rootFolder
//     const folderPath = `uploads/user_${userId}${rootFolder=='dashboard'?'':'/'+rootFolder}`;
//     console.log(folderPath)

//     // Check if folder exists, otherwise create it
//     const fs = require('fs').promises;
//     fs.access(folderPath)
//       .then(() => cb(null, folderPath)) // Folder exists, use it
//       .catch(() => {
//         console.log("Folder not exists")
//       }) // Create folder(s) if needed
//       .then(() => cb(null, folderPath));
//   },
//   filename: (req, file, cb) => {
//     const originalName = file.originalname;
//     const extension = path.extname(originalName); // Get the file extension
//     let baseName = path.basename(originalName, extension); // Remove extension
  
//     // Generate a unique filename with a counter if a file with the same name exists
//     let counter = 1;
//     const fs = require('fs').promises; // Use promises for asynchronous operations
  
//     const checkAndCreateFilename = async () => {
//       const filePath = path.join(req.user.id, req.path.startsWith('/dashboard') ? req.path.split('/dashboard')[1] : req.path.split('/dashboard')[2], `${baseName}${counter}${extension}`);
//       try {
//         await fs.access(filePath); // Check if a file with the current name exists
//         counter++;
//         checkAndCreateFilename(); // Try again with incremented counter
//       } catch (error) {
//         // File doesn't exist, use this filename
//         cb(null, filePath);
//       }
//     };
  
//     checkAndCreateFilename();
//   },
// });

// const upload = multer({ storage: storage })

// router.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     console.log("Upload called")
//     const userId = req.user.id; 
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const uploadedFile = req.file; // Contains details like filename, path, etc.

    
//     await prisma.file.create({
//       data: {
//         ownerId: userId,
//         name: uploadedFile.originalname, // Filename before upload
//         path: uploadedFile.path, // Temporary path (adjust if needed)
//         owner: { connect: { id: user.id } },
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     });

//     res.status(200).json({ message: 'File uploaded successfully' });
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Route to get all folders and files for the authenticated user
// router.get('/', async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // Fetch all folders belonging to the user
//     const folders = await prisma.folder.findMany({
//       where: { ownerId: userId },
//       include: {
//         allowedAccess: true, // Include users who have access to this folder
//       },
//     });

//     // Fetch all files belonging to the user
//     const files = await prisma.file.findMany({
//       where: { ownerId: userId },
//       include: {
//         allowedAccess: true, // Include users who have access to this file
//       },
//     });

//     res.status(200).json({ success: true, folders, files });
//   } catch (error) {
//     console.error('Error fetching user content:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const prisma = new PrismaClient();

// Configure multer storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const userId = req.user.id;
      const rootFolder = req.params.rootFolder; // Extract rootFolder from req.params

      // Create a folder structure based on user ID and rootFolder
      const folderPath = `uploads/user_${userId}/${rootFolder === 'dashboard' ? '' : rootFolder}`;

      // Check if folder exists, otherwise create it
      try {
        await fs.access(folderPath);
      } catch {
        await fs.mkdir(folderPath, { recursive: true });
      }

      cb(null, folderPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const extension = path.extname(originalName); // Get the file extension
    let baseName = path.basename(originalName, extension); // Remove extension

    // Generate a unique filename with a counter if a file with the same name exists
    let counter = 1;
    const folderPath = path.join('uploads', `user_${req.user.id}`, req.params.rootFolder === 'dashboard' ? '' : req.params.rootFolder);

    const checkAndCreateFilename = async () => {
      const filePath = path.join(folderPath, `${baseName}${counter==1?'':`_${counter-1}`}${extension}`);
      console.log(filePath)
      try {
        await fs.access(filePath); // Check if a file with the current name exists
        counter++;
        checkAndCreateFilename(); // Try again with incremented counter
      } catch {
        // File doesn't exist, use this filename
        cb(null, `${baseName}${counter==1?'':`_${counter-1}`}${extension}`);
      }
    };

    checkAndCreateFilename();
  },
});

const upload = multer({ storage: storage });

// router.post('/upload/:rootFolder', upload.single('file'), async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const rootFolder = req.params.rootFolder; // Extract rootFolder from req.params
//     console.log("Root Folder:", rootFolder); // Debug log
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const uploadedFile = req.file; // Contains details like filename, path, etc.

//     await prisma.file.create({
//       data: {
//         ownerId: userId,
//         name: uploadedFile.originalname, // Filename before upload
//         path: uploadedFile.path, // Temporary path (adjust if needed)
//         // owner: { connect: { id: userId } },
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     });

//     res.status(200).json({success:true, message: 'File uploaded successfully' });
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
router.post('/upload/:rootFolder', upload.single('file'), async (req, res) => {
  try {
    const userId = req.user.id;
    const rootFolder = req.params.rootFolder;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadedFile = req.file;
    const iv = JSON.parse(req.body.iv); // Parse the IV from the request body

    // Store the encrypted file details in the database
    await prisma.file.create({
      data: {
        ownerId: userId,
        name: req.body.fileName, // Original filename
        path: uploadedFile.path, // Encrypted file path
        iv: iv.join(','), // Store IV as a string
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    res.status(200).json({ success: true, message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Route to get all folders and files for the authenticated user
// router.get('/', async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // Fetch all folders belonging to the user
//     const folders = await prisma.folder.findMany({
//       where: { ownerId: userId },
//       include: {
//         allowedAccess: true, // Include users who have access to this folder
//       },
//     });

//     // Fetch all files belonging to the user
//     const files = await prisma.file.findMany({
//       where: { ownerId: userId },
//       include: {
//         allowedAccess: true, // Include users who have access to this file
//       },
//     });

//     res.status(200).json({ success: true, folders, files });
//   } catch (error) {
//     console.error('Error fetching user content:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all folders belonging to the user
    const folders = await prisma.folder.findMany({
      where: { ownerId: userId },
      include: {
        allowedAccess: true, // Include users who have access to this folder
      },
    });

    // Fetch all files belonging to the user
    const files = await prisma.file.findMany({
      where: { ownerId: userId },
      include: {
        allowedAccess: true, // Include users who have access to this file
      },
    });

    // Map through files to include encryption details
    const filesWithEncryptionDetails = files.map(file => ({
      ...file,
      iv: file.iv, // Initialization vector (IV) from the file object
      key: process.env.FILE_ENCRYPTION_KEY, // Key to decrypt the file (this should be handled securely)
      algorithm: 'aes-256-cbc' // Encryption algorithm used
    }));

    res.status(200).json({ success: true, folders, files: filesWithEncryptionDetails });
  } catch (error) {
    console.error('Error fetching user content:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


router.get('/getSharedData',async(req,res)=>{
  try {
    const { user } = req;
    const folders = await prisma.folderAccess.findMany({
      where: {
        userId: user.id,folder:{
          deleted:false
        }
      },
      include: {
        folder: true,
      }
    })
    
    const files = await prisma.fileAccess.findMany({
      where: {
        userId: user.id,file:{
          deleted:false
        }
      },
      include: {
        file: true,
      }
    })
    return res.status(200).json({ success: true, message: "Folders fetched successfully", folders,files })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
})

module.exports = router;
