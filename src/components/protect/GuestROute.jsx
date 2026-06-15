"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GuestRoute({ children }) {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const auth = sessionStorage.getItem('accessToken');
        if (auth) {
            router.replace('/dashboard');
        }
    }, [router]);

    if (!isMounted) return null;
    return children;
}