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
import {   EllipsisVertical,  Trash, UndoDot, UserPlus} from "lucide-react";
import useTokenStore from '@/store/store';
import toast from 'react-hot-toast';
import {  usePathname, useRouter } from 'next/navigation';
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


const Bin = ({name,path,id,favourite,deleted}:{name:string,path:string,id:number,favourite:boolean,deleted:boolean}) => {

  const {token,fetchDataIfEmpty} = useTokenStore();
  const [Favourite,setFavourite]=useState<boolean>(favourite);

  const pathname=usePathname();
const router=useRouter()

const RestoreFile = async()=>{
  const response = await fetch(`${process.env.SEVER_HOST}api/files/restore/${id}`, {
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

const folderId= path.split('\\')[3]==undefined?"dashboard":path.split('\\')[2];
  const DeletePermanently = async()=>{
    const response = await fetch(`${process.env.SEVER_HOST}api/files/deletePermanent/${id}`, {
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
    
    <div className="h-[15vh] md:h-[20vh] mt-2 p-2 bg-white rounded-lg mr-2 ">
    <div className="flex mt-2 mx-2 flex-row justify-between">
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
        <DropdownMenuItem onClick={RestoreFile} className="hover:cursor-pointer" asChild>
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
    <div className="w-full  h-full flex justify-center items-center">
      <div className="text-3xl h-20">
        {name.split('.')[1].toLowerCase() =='png' || name.split('.')[1].toUpperCase() =='jpg' ? <img src={`${process.env.SEVER_HOST}${path}`} className="w-full h-full object-cover rounded-lg"/>  : <div className='text-red-400 '>
          {name.split('.')[1].toUpperCase()}
          </div>}
        
      </div>
    </div>
  </div>  
  </div>
  
  )
}

export default Bin