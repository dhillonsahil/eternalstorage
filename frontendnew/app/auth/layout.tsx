'use client'
import React from 'react'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import useTokenStore from "@/store/store"

const AuthLayout = ({children}:{children:React.ReactNode}) => {
  const {token}= useTokenStore();
  const router=useRouter();
  useEffect(() => {
    if(token){
      router.push('/dashboard')
    }
  },[token])
  return (
    <div className='h-full flex items-center justify-center  bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
        {children}
    </div>
  )
}

export default AuthLayout