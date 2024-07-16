'use client'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import useTokenStore from '@/store/store';
import React, { useEffect, useState } from 'react'
import Files from '../_components/File';
import Folders from '../_components/Folders';

const SharedWithYou = () => {
  const [SharedFolders, setSharedFolders] = useState([]);
  const [SharedFiles, setSharedFiles] = useState([]);
  const {token}=useTokenStore();

  useEffect(()=>{
    const fetchData = async () => {
      const response = await fetch(`${process.env.SEVER_HOST}api/userContent/getSharedData`,{
        headers:{
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setSharedFiles(data.files)
    }
    fetchData();
  },[])
  
  return ( 
  <ContentLayout title='Shared With You' >
     <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-">
      {/* {SharedWithYou.length >0 && JSON.stringify(SharedWithYou[1])} */}
      {SharedFiles.length >0 && 
        SharedFiles.map((item:any)=>(
          <Files deleted={item.file.deleted} path={item.file.path} id={item.file.id} key={item.file.id} name={item.file.name}  />
        ))
      }
      
     
    </div>
  </ContentLayout>
  )
}

export default SharedWithYou