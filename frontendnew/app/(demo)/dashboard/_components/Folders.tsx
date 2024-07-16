import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { EllipsisVertical, Folder, Trash, UserPlus } from 'lucide-react';
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
import toast from 'react-hot-toast';
import useTokenStore from '@/store/store';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogDescription } from '@radix-ui/react-dialog';

const Folders = ({ pathString, name,deleted }: { deleted: boolean, pathString: string, name: string }) => {
    const router = useRouter();
    const { fetchDataIfEmpty, token } = useTokenStore();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [accessUser, setAccessUser] = useState('');

    const handleDelete = async () => {
        try {
            const response = await fetch(`${process.env.SEVER_HOST}api/folder/delete/${pathString}`, {
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
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred');
        }
    };

    return (
        <>
            <Card className='m-1'>
                <CardHeader className='p-2'>
                    <CardTitle className='text-lg font-normal flex justify-between items-center'>
                        <div onClick={() => router.push(`/dashboard/${pathString}`)} className="py-3 px-2 h-full w-[80%]">
                            <div className="flex flex-row">
                                <Folder className='mr-2' />
                                <div className="">{name}</div>
                            </div>
                        </div>
                        <DropdownMenu>
                            <TooltipProvider disableHoverableContent>
                                <Tooltip delayDuration={100}>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger onClick={(event) => event.stopPropagation()} asChild>
                                            <EllipsisVertical />
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">Menu</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={handleDelete} className="hover:cursor-pointer" asChild>
                                        <div className="">
                                            <Trash className="w-4 h-4 mr-3 text-muted-foreground" />
                                            Delete
                                        </div>
                                    </DropdownMenuItem>

                                   
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardTitle>
                </CardHeader>
            </Card>

            
        </>
    );
};

export default Folders;
