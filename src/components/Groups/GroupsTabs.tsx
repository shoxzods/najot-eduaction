"use client";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import styles from '@/views/Groups/Groups.module.scss';

export default function GroupsTabs() {
    const pathname = usePathname();
    const basePath = pathname?.startsWith('/teacher') ? '/teacher/groups' : '/dashboard/groups';

    const isArchive = pathname === `${basePath}/archive`;

    return (
        <div className={styles.tabs}>
            <Link
                href={basePath}
                className={`${styles.tab} ${!isArchive ? styles.activeTab : ''}`}
                style={{ textDecoration: 'none' }}
            >
                <GroupsRoundedIcon fontSize="small" />
                Guruhlar
            </Link>
            <Link
                href={`${basePath}/archive`}
                className={`${styles.tab} ${isArchive ? styles.activeTab : ''}`}
                style={{ textDecoration: 'none' }}
            >
                <ArchiveOutlinedIcon fontSize="small" />
                Arxiv
            </Link>
        </div>
    );
}
