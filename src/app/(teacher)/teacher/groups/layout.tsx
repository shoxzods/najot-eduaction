"use client";
import { usePathname } from 'next/navigation';
import GroupsTabs from '@/components/Groups/GroupsTabs';

export default function TeacherGroupsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isListOrArchive =
        pathname === '/teacher/groups' ||
        pathname === '/teacher/groups/archive';

    if (!isListOrArchive) return <>{children}</>;

    return (
        <>
            <GroupsTabs />
            {children}
        </>
    );
}
