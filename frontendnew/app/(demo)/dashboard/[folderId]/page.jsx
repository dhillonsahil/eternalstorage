'use client'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import useTokenStore from '@/store/store';
import React, { useEffect } from 'react'
import Files from '../_components/File';

const FolderPage = ({params}) => {
    const folderId= params.folderId;
    const {  files,folders,fetchDataIfEmpty } = useTokenStore(); // Corrected function name to 
    useEffect(()=>{
      fetchDataIfEmpty();
    },[fetchDataIfEmpty])
    const filteredFiles = files.filter((file) => file.path.split('\\')[2] === folderId && file.deleted === false);

    
  return (
    <ContentLayout >
      <div id="" className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
      {
        filteredFiles.map((file)=>( 
        <Files path={file.path} id={file.id} key={file.id} name={file.name}  />
        ))
      }
      </div>
  </ContentLayout>
  )
}

export default FolderPage