"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectRouter({ children }) {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const token = sessionStorage.getItem('accessToken');
        if (!token) {
            router.replace('/login');
        }
    }, [router]);

    if (!isMounted) return null;
    return children;
}