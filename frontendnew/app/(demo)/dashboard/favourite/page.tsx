'use client'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import useTokenStore from '@/store/store';
import React, { useEffect } from 'react'
import Files from '../_components/File';

const FavouritePage = () => {
    const {  files,folders,fetchDataIfEmpty } = useTokenStore(); // Corrected function name to 
    useEffect(()=>{
      fetchDataIfEmpty();
    },[fetchDataIfEmpty])
    const filteredFiles = files.filter((file:any)=>file.favourite==true);
    
  return (
    <ContentLayout title='Favorited Files' >
      <div id="" className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
      {
        filteredFiles.map((file:any)=>( 
        <Files path={file.path} id={file.id} key={file.id} name={file.name}  />
        ))
      }
      </div>
  </ContentLayout>
  )
}

export default FavouritePage