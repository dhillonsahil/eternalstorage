// 'use client'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import useTokenStore from '@/store/store'
// import { usePathname } from 'next/navigation'
// import { useRouter } from 'next/navigation'
// import React, { useState } from 'react'
// import toast from 'react-hot-toast'

// const FilePicker = ({closeModal }:{closeModal: () => void}) => {
//   const pathname = usePathname();
//   const [selectedFile, setSelectedFile] = useState(null);
//   const { token,fetchDataIfEmpty } = useTokenStore();
//   const rootFolder = pathname.endsWith('dashboard') ? "dashboard" : pathname.split('/')[2];

//   const handleFileChange = (event:any) => {
//     const file = event.target.files[0];
//     setSelectedFile(file);
//   };

//   const router = useRouter();
//   const handleSubmit = async (event:any) => {
//     event.preventDefault();
//     if (!selectedFile) {
//       // Handle no file selected case (optional: display an error message)
//       console.error('No file selected');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', selectedFile);
//     formData.append('rootFolder', rootFolder);

//     try {
//       const response = await fetch(`${process.env.SEVER_HOST}api/userContent/upload/${rootFolder}`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Upload failed');
//       }

//       const data = await response.json();

//       // Handle successful upload (e.g., redirect, display success message)
//       if (data.success) {
//         toast.success('File uploaded successfully');
//         fetchDataIfEmpty();
//         router.refresh(); closeModal(); 
        
        
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       // Handle upload errors (e.g., display an error message)
//     } finally {
//       setSelectedFile(null); // Reset selected file after upload attempt
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} encType="multipart/form-data">
//       <div className="flex items-center justify-center w-full">
//         <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
//           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//             <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
//               <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
//             </svg>
//             <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
//           </div>
//           <input id="dropzone-file" type="file" onChange={handleFileChange} className="hidden" />
//           <p>{selectedFile?.name}</p>
//           <Button type='submit'>Upload</Button>
//         </label>
//       </div>
//     </form>
//   );
// }

// export default FilePicker;
'use client'
import { Button } from '@/components/ui/button'
import useTokenStore from '@/store/store'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const FilePicker = ({ closeModal }: { closeModal: () => void }) => {
  const pathname = usePathname();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { token, fetchDataIfEmpty } = useTokenStore();
  const rootFolder = pathname.endsWith('dashboard') ? "dashboard" : pathname.split('/')[2];
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  // Helper function to derive encryption key from user's password
  const deriveKeyFromPassword = async (password: string) => {
    const encoder = new TextEncoder();
    const salt = encoder.encode("unique-salt-per-user"); // Unique salt per user
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    return key;
  };

  // Helper function to encrypt the file
  const encryptFile = async (file: File, key: CryptoKey) => {
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate a random IV
  
    const fileData = await file.arrayBuffer();

    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      fileData
    );

    return { encryptedData, iv };
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    try {
      // Prompt user for their password to derive encryption key
      const password = "Sahil123@";
      if (!password) return;

      const key = await deriveKeyFromPassword(password);
      const fileName= await selectedFile.name;

      // Encrypt the file
      const { encryptedData, iv } = await encryptFile(selectedFile, key);

      const formData = new FormData();
      formData.append('file', new Blob([encryptedData])); // Encrypted file blob
      formData.append('iv', JSON.stringify(Array.from(iv))); // Send IV for decryption
      formData.append('rootFolder', rootFolder);
      formData.append('fileName', fileName);

      const response = await fetch(`${process.env.SEVER_HOST}api/userContent/upload/${rootFolder}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('File uploaded successfully');
        fetchDataIfEmpty();
        router.refresh();
        closeModal();
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setSelectedFile(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="flex items-center justify-center w-full">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
          </div>
          <input id="dropzone-file" type="file" onChange={handleFileChange} className="hidden" />
          <p>{selectedFile?.name}</p>
          <Button type='submit'>Upload</Button>
        </label>
      </div>
    </form>
  );
}

export default FilePicker;
