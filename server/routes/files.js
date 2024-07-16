const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs')
const prisma = new PrismaClient();
const path = require('path')

router.patch('/favourite/:fileId', async (req, res) => {
    try {
        const { user } = req;
        const fileId = parseInt(req.params.fileId, 10);
        
        if (!fileId) return res.status(400).send({ success: false, message: "File id is required" });
        
        // Check if file exists and user owns it
        const file = await prisma.file.findFirst({
            where: {
                id: fileId,
                ownerId: user.id
            }
        });
        
        if (!file) return res.status(400).json({ success: false, message: "No File found owned by you" });

        // Else mark favourite as true
        await prisma.file.update({
            where: {
                id: fileId
            },
            data: {
                favourite: !file.favourite
            }
        });
        const message = file.favourite==true ?"File removed from favourite" :"File marked as favourite";

        return res.status(200).json({ success: true, message: message });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
});

router.delete('/delete/:fileId', async (req, res) => {
    try {
        const { user } = req;
        const fileId = parseInt(req.params.fileId, 10);
        
        if (!fileId) return res.status(400).send({ success: false, message: "File id is required" });
        
        // Check if file exists and user owns it
        const file = await prisma.file.findFirst({
            where: {
                id: fileId,
                ownerId: user.id
            }
        });
        
        if (!file) return res.status(400).json({ success: false, message: "No File found owned by you" });

        // Else mark favourite as true
        await prisma.file.update({
            where: {
                id: fileId
            },
            data: {
                deleted: true
            }
        });

        return res.status(200).json({ success: true, message: 'File deleted' });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
});

router.delete('/deletePermanent/:fileId', async (req, res) => {
    try {
      const { user } = req;
      const fileId = parseInt(req.params.fileId, 10);
  
      if (!fileId) return res.status(400).send({ success: false, message: "File id and Folder id are required" });
  
      // Check if file exists and user owns it
      const file = await prisma.file.findFirst({
        where: {
          id: fileId,
          ownerId: user.id,
        },
      });

  
      if (!file) return res.status(400).json({ success: false, message: "No File found owned by you in the specified folder" });
      console.log(file.path)
  
      // Delete the file from the filesystem
      try {
        await fs.unlinkSync(path.resolve(__dirname, '..', file.path));
      } catch (fsError) {
        console.error('Error deleting file from filesystem:', fsError);
        return res.status(500).json({ success: false, message: "Failed to delete file from filesystem" });
      }
  
      // Mark the file as deleted in the database
      await prisma.file.delete({
        where: {
          id: fileId,
          ownerId: user.id,
        }
      });
  
      return res.status(200).json({ success: true, message: 'File deleted' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ success: false, message: "Something went wrong" });
    }
  });
router.patch('/restore/:fileId', async (req, res) => {
    try {
        const { user } = req;
        const fileId = parseInt(req.params.fileId, 10);
        
        if (!fileId) return res.status(400).send({ success: false, message: "File id is required" });
        
        // Check if file exists and user owns it
        const file = await prisma.file.findFirst({
            where: {
                id: fileId,
                ownerId: user.id
            }
        });
        if (!file) return res.status(400).json({ success: false, message: "No File found owned by you" });

        // Else mark favourite as true
        await prisma.file.update({
            where: {
                id: fileId
            },
            data: {
                deleted: false
            }
        });

        return res.status(200).json({ success: true, message: 'File Restored' });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
});

router.get('/download/:fileId', async (req, res) => {
    try {
      const { user } = req;
      const fileId = parseInt(req.params.fileId, 10);
  
      if (!fileId) return res.status(400).send({ success: false, message: "File Not Found" });
  
      // Check if file exists and user owns it
      const file = await prisma.file.findFirst({
        where: {
          id: fileId,
          OR: [
            { ownerId: user.id },
            {
              allowedAccess: {
                some: {
                  userId: user.id
                }
              }
            }
          ]
        },
      });
  
      if (!file) return res.status(400).json({ success: false, message: "No file found " });
  
    //   const filePath = path.resolve(file.path); // Ensure the file path is absolute
  
       // Ensure the file path is absolute
       const filePath = path.resolve(file.path); 
       const normalizedFilePath = path.normalize(filePath);
   
       console.log("Resolved file path:", normalizedFilePath);
      console.log(filePath)
      // Check if the file exists in the filesystem
      try {
        await fs.accessSync(normalizedFilePath);
      } catch (err) {
        console.error("File access error:", err);
        return res.status(404).json({ success: false, message: "File not found on server" });
      }
  
  console.log("Done")
      // Send the file to the client for download
      res.download(normalizedFilePath, file.name, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          return res.status(500).json({ success: false, message: "Failed to download file" });
        }
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ success: false, message: "Something went wrong" });
    }
  });

  router.post('/allowAccess', async (req, res) => {
    try {
      const { user } = req;
      const { fileId, email } = req.body;
  
      if (!fileId || !email) {
        return res.status(400).send({ success: false, message: "File ID and email are required" });
      }
  
      // Check if the file exists and the requesting user is the owner
      const file = await prisma.file.findFirst({
        where: {
          id: fileId,
          ownerId: user.id,
        },
      });
  
      if (!file) {
        return res.status(400).json({ success: false, message: "No file found owned by you" });
      }
  
      // Find the user to whom access is being granted
      const accessUser = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!accessUser) {
        return res.status(400).json({ success: false, message: "User not found" });
      }
  
      // Grant access to the file
      await prisma.fileAccess.create({
        data: {
          userId: accessUser.id,
          fileId: file.id,
        },
      });
  
      return res.status(200).json({ success: true, message: "Access granted to the file" });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ success: false, message: "Something went wrong" });
    }
  });
  
// router.get('/getSharedFiles',async(req,res)=>{
//   try {
//     const { user } = req;
//     const files = await prisma.fileAccess.findMany({
//       where: {
//         userId: user.id,file:{
//           deleted:false
//         }
//       },
//       include: {
//         file: true,
//       }
//     })
//     return res.status(200).json({ success: true, message: "Files fetched successfully", data: files })
//   } catch (error) {
//     console.log("OOps gadbad hai")
//     return res.status(500).json({ success: false, message: "Something went wrong" });
//   }
// })

module.exports = router;
