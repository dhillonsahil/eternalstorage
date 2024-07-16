import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from "@/components/ui/tooltip";
import { ArrowDownToLine, EllipsisVertical, Star, Trash, UserPlus } from "lucide-react";
import useTokenStore from '@/store/store';
import toast from 'react-hot-toast';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Files = ({ name, path, id, favourite, deleted }:{name:string,path:string,id:number,favourite:boolean,deleted:boolean}) => {
    const { token, fetchDataIfEmpty } = useTokenStore();
    const [Favourite, setFavourite] = useState<boolean>(favourite);
    const [accessUser, setAccessUser] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const pathname = usePathname();
    const router = useRouter();

    const handleFavourite = async () => {
        const response = await fetch(`${process.env.SEVER_HOST}api/files/favourite/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        const data = await response.json();
        if (data.success) {
            toast.success(`${data.message}`);
            setFavourite(!Favourite);
            fetchDataIfEmpty();
        } else {
            toast.error(`${data.message}`);
        }
    };

    const handleDelete = async () => {
        const response = await fetch(`${process.env.SEVER_HOST}api/files/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        const data = await response.json();
        if (data.success) {
            toast.success(`${data.message}`);
            fetchDataIfEmpty();
            router.refresh();
        } else {
            toast.error(`${data.message}`);
        }
    };

    const handleAllowUser = async (e:any) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.SEVER_HOST}api/files/allowAccess`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ fileId: id, email: accessUser }),
            });

            const result = await response.json();
            if (result.success) {
                toast.success('Access granted successfully');
                setDialogOpen(false);
            } else {
                toast.error(`${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred');
        }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(`${process.env.SEVER_HOST}api/files/download/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            const contentDisposition = response.headers.get('content-disposition');
            let filename = 'downloaded_file';
            if (contentDisposition && contentDisposition.includes('filename=')) {
                filename = contentDisposition.split('filename=')[1].trim();
            }
            link.setAttribute('download', filename);

            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <>
            <div className="h-[15vh] md:h-[20vh] mt-2 p-2 bg-white rounded-lg mr-2">
                <div className="flex mt-2 mx-2 flex-row justify-between">
                    <div className="font-bold overflow-hidden">{name}</div>
                    <DropdownMenu>
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
                                <DropdownMenuItem onClick={handleDownload} className="hover:cursor-pointer" asChild>
                                    <div className="">
                                        <ArrowDownToLine className="w-4 h-4 mr-3 text-muted-foreground" />
                                        Download
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDelete} className="hover:cursor-pointer" asChild>
                                    <div className="">
                                        <Trash className="w-4 h-4 mr-3 text-muted-foreground" />
                                        Delete
                                    </div>
                                </DropdownMenuItem>
                                {pathname.endsWith('/favourite') == false ?
                                    <DropdownMenuItem onClick={handleFavourite} className="hover:cursor-pointer" asChild>
                                        <div className="">
                                            <Star fill={Favourite ? 'yellow' : 'none'} className="w-4 h-4 mr-3 text-muted-foreground" />
                                            {Favourite ? 'Unfavourite' : 'Favourite'}
                                        </div>
                                    </DropdownMenuItem> :
                                    <DropdownMenuItem onClick={handleFavourite} className="hover:cursor-pointer" asChild>
                                        <div className="">
                                            <Star fill={Favourite ? 'yellow' : 'none'} className="w-4 h-4 mr-3 text-muted-foreground" />
                                            {'Unfavourite'}
                                        </div>
                                    </DropdownMenuItem>
                                }
                                <DropdownMenuItem onClick={() => setDialogOpen(true)} className="hover:cursor-pointer" asChild>
                                    <div className="">
                                        <UserPlus className="w-4 h-4 mr-3 text-muted-foreground" />
                                        Allow Access
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="w-full  h-full flex justify-center items-center">
                    <div className="text-3xl h-20">
                        {name.split('.')[1].toLowerCase() === 'png' || name.split('.')[1].toUpperCase() === 'jpg' ?
                            <img src={`${process.env.SEVER_HOST}${path}`} className="w-full h-full object-cover rounded-lg" /> :
                            <div className='text-red-400 '>
                                {name.split('.')[1].toUpperCase()}
                            </div>}
                    </div>
                </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Allow Access</DialogTitle>
                        <DialogDescription>
                            Enter the email of the user to grant access to the file
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="email" className="sr-only">Email</Label>
                            <Input
                                id="email"
                                value={accessUser}
                                onChange={(e) => setAccessUser(e.target.value)}
                                placeholder="user@example.com"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <Button onClick={handleAllowUser} type="button" variant="secondary">
                            Grant Access
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Files;
