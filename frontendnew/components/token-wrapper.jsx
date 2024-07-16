'use client'
import React, { useEffect } from 'react'
import useTokenStore from '@/store/store'

const TokenWrapper = () => {
  useEffect(() => {
    // Initialize Zustand token state from localStorage on client-side
    const tokenFromStorage = localStorage.getItem('token');
    if (tokenFromStorage) {
      useTokenStore.getState().setToken(tokenFromStorage);
    }
  }, []);
  return (
    <></>
  )
}

export default TokenWrapper