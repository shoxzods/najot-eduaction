"use client";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import { useGroupsStore } from '@/store/groupsStore';
import styles from '@/views/Groups/Groups.module.scss';

export default function GroupsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const openModal = useGroupsStore((s) => s.openModal);

    const isListOrArchive =
        pathname === '/dashboard/groups' ||
        pathname === '/dashboard/groups/archive';

    if (!isListOrArchive) return <>{children}</>;

    const isArchive = pathname === '/dashboard/groups/archive';

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <h1 className={styles.title}>
                        {isArchive ? 'Guruhlar Archive' : 'Guruhlar'}
                    </h1>
                    {!isArchive && (
                        <button className={styles.addBtn} onClick={openModal}>
                            <AddRoundedIcon fontSize="small" />
                            <span className={styles.addBtnText}>Guruh qo'shish</span>
                        </button>
                    )}
                </div>
                <p className={styles.subtitle}>
                    {isArchive
                        ? "Arxivlangan guruhlar ro'yxati. Bu yerda o'chirilgan yoki arxivga ko'chirilgan guruhlarni ko'rishingiz mumkin."
                        : "Ushbu sahifada siz guruhlar ro'yxatini va ularning ma'lumotlarini topasiz. Har bir guruhning nomi, kursi va dars vaqti ma'lumotlari keltirilgan."
                    }
                </p>
            </div>

            <div className={styles.tabs}>
                <Link
                    href="/dashboard/groups"
                    className={`${styles.tab} ${!isArchive ? styles.activeTab : ''}`}
                    style={{ textDecoration: 'none' }}
                >
                    <GroupsRoundedIcon fontSize="small" />
                    Guruhlar
                </Link>
                <Link
                    href="/dashboard/groups/archive"
                    className={`${styles.tab} ${isArchive ? styles.activeTab : ''}`}
                    style={{ textDecoration: 'none' }}
                >
                    <ArchiveOutlinedIcon fontSize="small" />
                    Arxiv
                </Link>
            </div>

            {children}
        </div>
    );
}
