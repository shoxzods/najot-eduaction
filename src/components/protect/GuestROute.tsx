"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface GuestRouteProps {
  children: React.ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const auth = localStorage.getItem('accessToken');
        if (auth) {
            router.replace('/dashboard');
        }
    }, [router]);

    if (!isMounted) return null;
    return children;
}