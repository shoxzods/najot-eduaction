"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface GuestRouteProps {
  children: React.ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsAuth(true);
            router.replace('/dashboard');
        }
    }, [router]);

    if (!isMounted) return null;
    if (isAuth) return null;
    return children;
}
