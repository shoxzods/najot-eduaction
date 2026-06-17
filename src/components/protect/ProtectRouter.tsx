"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectRouterProps {
  children: React.ReactNode;
}

export default function ProtectRouter({ children }: ProtectRouterProps) {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.replace('/login');
        }
    }, [router]);

    if (!isMounted) return null;
    return children;
}