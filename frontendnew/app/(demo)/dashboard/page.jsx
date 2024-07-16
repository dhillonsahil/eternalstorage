'use client'
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import FilePicker from "./_components/FilePicker";
import useTokenStore from '@/store/store';
import { useEffect, useState } from "react";
import Folders from "./_components/Folders";
import Files from "./_components/File";

export default function DashboardPage() {
  const {  files,folders,fetchDataIfEmpty } = useTokenStore(); // Corrected function name to 
  useEffect(()=>{
    fetchDataIfEmpty();
  },[fetchDataIfEmpty])
  
  useEffect(()=>{
    fetchDataIfEmpty();
  },[])
  
  const filteredFolders=folders.filter((folder)=>folder.deleted==false)
  const filteredFiles=files.filter((file)=>file.deleted==false)
  
  
  return (
    <ContentLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {filteredFolders && filteredFolders.map((folder) => (
          <Folders key={folder.id} name={folder.name} pathString={folder.randomString} />
        ))}
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-">
        {filteredFiles && filteredFiles.map((file) => (
          file.path.split('\\')[3] === undefined && <Files deleted={file.deleted} favourite={file.favourite} id={file.id} key={file.id} name={file.name} pathString={file.path} />
        ))}
      </div>
    </ContentLayout>
  );
}
