'use client'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import useTokenStore from '@/store/store';
import React, { useEffect } from 'react'
import Bin from '../_components/Bin';
import DeletedFolders from '../_components/DeletedFolders';

const BinPage = () => {
    const {  files,folders,fetchDataIfEmpty } = useTokenStore(); // Corrected function name to 
    useEffect(()=>{
      fetchDataIfEmpty();
    },[fetchDataIfEmpty])
    const filteredFiles = files.filter((file:any)=>file.deleted==true);
    const filteredFolders = folders.filter((folder:any)=>folder.deleted==true);

    
  return (
    <ContentLayout title='Bin' >
      <div id="" className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
      {
        filteredFiles.map((file:any)=>( 
        <Bin path={file.path} id={file.id} key={file.id} name={file.name}  />
        ))
      }
      </div>
      <div id="" className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
      {
        filteredFolders.map((folder:any)=>( 
        <DeletedFolders pathString={folder.randomString} id={folder.id} key={folder.id} name={folder.name}  />
        ))
      }
      {
        filteredFiles.length==0 && filteredFolders.length==0 && <div className=' flex items-center text-center'>
        <p className='text-xl font-bold text-center w-full'>  Nothing in bin</p>
        </div>
      }
      </div>
  </ContentLayout>
  )
}

export default BinPage