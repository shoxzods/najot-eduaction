"use client";
import { useSearchParams } from 'next/navigation';
import Courses from '@/views/management/Courses/Courses';
import Rooms from '@/views/management/Rooms/Rooms';
import Staff from '@/views/management/Staff/Staff';

export default function ManagementPage() {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') || 'courses';

    return (
        <>
            {tab === 'courses' && <Courses />}
            {tab === 'rooms' && <Rooms />}
            {tab === 'staff' && <Staff />}
        </>
    );
}