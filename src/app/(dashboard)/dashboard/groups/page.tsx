"use client";
import { useSearchParams } from 'next/navigation';
import Groups from '@/views/Groups/Groups';
import ArchiveGroups from '@/views/Groups/ArchiveGroups';

export default function GroupsPage() {
    const searchParams = useSearchParams();
    const isArchive = searchParams.get('tab') === 'archive';
    return isArchive ? <ArchiveGroups /> : <Groups />;
}