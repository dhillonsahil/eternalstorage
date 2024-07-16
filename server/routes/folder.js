
const express = require('express');
const router = express.Router();
const { RegisterSchema, LoginSchema } = require('../schemas/user');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto')

const prisma = new PrismaClient();


router.post('/create-folder', async (req, res) => {
    const { user } = req;
    
  
    // Generate a random string for the folder
    const randomString = crypto.randomBytes(16).toString('hex');
  
    // Create folder entry in the database
    const folder = await prisma.folder.create({
      data: {
        name: req.body.name,
        randomString: randomString,
        owner: { connect: { id: user.id } },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  
    // Create the actual folder in the uploads directory
    const folderPath = path.resolve(__dirname, '..', 'uploads', `user_${user.id}`, randomString);
    fs.mkdirSync(folderPath, { recursive: true });
  
    res.status(201).json({ success:true,message: 'Folder created', folderId: folder.id, randomString: randomString });
});

router.delete('/delete/:folderId', async (req, res) => {
  try {
      const { user } = req;
      const folderId = req.params.folderId
      if (!folderId) return res.status(400).send({ success: false, message: "Folder id is required" });
      
      const folder = await prisma.folder.findFirst({
          where: {
              randomString: folderId,
              ownerId: user.id
          }
      });
      
      if (!folder) return res.status(400).json({ success: false, message: "No Folder found" });

      // Else mark favourite as true
      await prisma.folder.update({
          where: {
              randomString: folderId
          },
          data: {
              deleted: true
          }
      });

      return res.status(200).json({ success: true, message: 'Folder deleted' });

  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

router.patch('/restore/:folderId', async (req, res) => {
  try {
      const { user } = req;
      const folderId = req.params.folderId
      
      if (!folderId) return res.status(400).send({ success: false, message: "Folder id is required" });
      
      const folder = await prisma.folder.findFirst({
          where: {
              randomString: folderId,
              ownerId: user.id
          }
      });
      if (!folder) return res.status(400).json({ success: false, message: "No Folder found owned by you" });

      // Else mark favourite as true
      await prisma.folder.update({
          where: {
              randomString: folderId
          },
          data: {
              deleted: false
          }
      });

      return res.status(200).json({ success: true, message: 'Folder Restored' });

  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

router.delete('/deletePermanent/:folderId', async (req, res) => {
  try {
      const { user } = req;
      const folderId = req.params.folderId;
      
      if (!folderId) return res.status(400).send({ success: false, message: "Folder id is required" });
      
      
      const folderPath = path.resolve(__dirname, '..', 'uploads', `user_${user.id}`, folderId);
      fs.rmdirSync(folderPath, { recursive: true });
      
      await prisma.folder.delete({
          where: {
              randomString: folderId,
              ownerId: user.id
          }
      })
      
      
      return res.status(200).json({ success: true, message: 'Folder Deleted Permanently' });

  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

router.post('/allowAccess', async (req, res) => {
    const { folderId, email } = req.body;

    try {
        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { 
                email:email
             }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if the folder exists
        const folder = await prisma.folder.findUnique({
            where: { 
                randomString:folderId
             }
        });

        if (!folder) {
            return res.status(404).json({ success: false, message: 'Folder not found' });
        }

        // Grant access to the folder
        await prisma.folderAccess.create({
            data: {
                userId: user.id,
                folderId: folder.id
            }
        });

        res.status(200).json({ success: true, message: 'Access granted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

// router.get('/getSharedFolders',async(req,res)=>{
//     try {
//       const { user } = req;
//       const files = await prisma.folderAccess.findMany({
//         where: {
//           userId: user.id,folder:{
//             deleted:false
//           }
//         },
//         include: {
//           folder: true,
//         }
//       })
//       return res.status(200).json({ success: true, message: "Folders fetched successfully", data: folders })
//     } catch (error) {
//       return res.status(500).json({ success: false, message: "Something went wrong" });
//     }
//   })

module.exports = router;
