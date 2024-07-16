"use client";

import Link from "next/link";
import { FileUp, FolderPlus, LayoutGrid, LogOut, User, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useTokenStore from '@/store/store';
import toast from "react-hot-toast";
import FilePicker from "@/app/(demo)/dashboard/_components/FilePicker";

export function UserNav() {
  const { token ,userInfo ,clearToken} = useTokenStore();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [showUpload,setShowUpload]=useState(true);
  const {  files,folders,fetchDataIfEmpty } = useTokenStore();
  const pathname=usePathname();

  const [folderName,setFolderName]=useState("")
  const router=useRouter();
  const handleNewFolder = async()=>{
    if(folderName.trim().length===0){
      toast.error("Enter Folder Name");
      return;
    }
    const response = await fetch(`${process.env.SEVER_HOST}api/folder/create-folder`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name:folderName,
      })
    })
    const data = await response.json();
    if(data.success===true){
      toast.success(`${data.message}`);
      setFolderName("");
      router.refresh();
      fetchDataIfEmpty();
    }else{
      toast.error(`${data.message}`);
    }
  }

  useEffect(()=>{
    if(pathname.endsWith('bin') || pathname.endsWith('favourite') || pathname.endsWith('sharedwithyou'))setShowUpload(false)
  },[])

  const handleLogout = () => {
    clearToken();
    router.push('/auth/login'); // Redirect to login page after logout
  };
  return (<>
  {
    showUpload &&  <div className="">
    <Dialog>
         <DialogTrigger asChild>
           <Button size={"sm"} variant="outline"><FolderPlus /></Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-md">
           <DialogHeader>
             <DialogTitle>Folder Name</DialogTitle>
             <DialogDescription>
               Enter Name to create a new folder
             </DialogDescription>
           </DialogHeader>
           <div className="flex items-center space-x-2">
             <div className="grid flex-1 gap-2">
               <Label htmlFor="link" className="sr-only">
                 Link
               </Label>
               <Input
                 id="link" value={folderName} onChange={(e)=>setFolderName(e.target.value)}
                 defaultValue="https://ui.shadcn.com/docs/installation"
               />
             </div>
           </div>
           <DialogFooter className="sm:justify-start">
             <DialogClose asChild>
              
               <Button onClick={handleNewFolder} type="button" variant="secondary">
                 Create
               </Button>
              
             </DialogClose>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
         <DialogTrigger asChild>
           <Button variant="outline"><FileUp /></Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-md">
         <DialogTitle>Upload New file</DialogTitle>
         <DialogDescription >Select file you want to upload or just drag and drop</DialogDescription>
           <DialogHeader>
             <FilePicker closeModal={() => setIsUploadDialogOpen(false)} />
           </DialogHeader>
         </DialogContent>
       </Dialog>
    </div>
  }
  <DropdownMenu>
  {/* <Button variant="outline">Upload File</Button> */}
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="#" alt="Avatar" />
                  <AvatarFallback className="bg-transparent">
                    <UserRound />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userInfo?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userInfo?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/dashboard" className="flex items-center">
              <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/account" className="flex items-center">
              <User className="w-4 h-4 mr-3 text-muted-foreground" />
              Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem  className="hover:cursor-pointer" onClick={handleLogout}>
          <LogOut  className="w-4 h-4 mr-3 text-muted-foreground" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu></>
  );
}
