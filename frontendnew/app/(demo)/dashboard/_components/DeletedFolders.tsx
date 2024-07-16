import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
  } from "@/components/ui/dropdown-menu";

  import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
  } from "@/components/ui/tooltip";
import {   EllipsisVertical,  Folder,  Trash, UndoDot, UserPlus} from "lucide-react";
import useTokenStore from '@/store/store';
import toast from 'react-hot-toast';
import {  useRouter } from 'next/navigation';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';


const DeletedFolders = ({pathString,id,name}:{name:string,pathString:string,id:number}) => {

  const {token,fetchDataIfEmpty} = useTokenStore();

const router=useRouter()

const RestoreFolder = async()=>{
  const response = await fetch(`${process.env.SEVER_HOST}api/folder/restore/${pathString}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  const data=await response.json();
  if(data.success){
    toast.success(`${data.message}`);
    fetchDataIfEmpty();
    router.refresh()
  }else{
    toast.error(`${data.message}`);
  }
}

  const DeletePermanently = async()=>{
    const response = await fetch(`${process.env.SEVER_HOST}api/folder/deletePermanent/${pathString}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    const data=await response.json();
    if(data.success){
      toast.success(`${data.message}`);
      fetchDataIfEmpty();
      router.refresh()
    }else{
      toast.error(`${data.message}`);
    }
  }


  return (<div className="">
    
    <div className="mt-2 p-4 bg-white rounded-lg mr-2 ">
    <div className="flex mt-2 mx-2 flex-row justify-between">
      <Folder />
      <div className="font-bold overflow-hidden">{name}</div>
      <DropdownMenu>
{/* <Button variant="outline">Upload File</Button> */}
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
              <EllipsisVertical />
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Menu</TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <DropdownMenuContent className="w-56" align="end" forceMount>
     
      <DropdownMenuGroup>
        <DropdownMenuItem onClick={RestoreFolder} className="hover:cursor-pointer" asChild>
            <div className="">
            <UndoDot className="w-4 h-4 mr-3 text-muted-foreground" />
            Restore
            </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={DeletePermanently} className="hover:cursor-pointer" asChild>
           <div className="">
           <Trash className="w-4 h-4 mr-3 text-muted-foreground" />
           Delete Permanently
           </div>
         
        </DropdownMenuItem>
      </DropdownMenuGroup>
     
    </DropdownMenuContent>
  </DropdownMenu>
      
    </div>
  </div>  
  </div>
  
  )
}

export default DeletedFolders