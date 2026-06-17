"use client";
import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';

interface ProtectRouterProps {
  children: React.ReactNode;
}

export default function ProtectRouter({ children }: ProtectRouterProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const token = localStorage.getItem('accessToken');
        setIsAuth(!!token);
    }, []);

    if (!isMounted) return null;
    if (!isAuth) return notFound();
    return children;
}