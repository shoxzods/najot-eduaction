"use client";
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import { useGroupsStore } from '@/store/groupsStore';
import styles from '@/views/Groups/Groups.module.scss';

export default function GroupsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const openModal = useGroupsStore((s) => s.openModal);

    const searchParams = useSearchParams();
    const actualIsArchive = searchParams.get('tab') === 'archive';
    const [optimisticIsArchive, setOptimisticIsArchive] = useState(actualIsArchive);

    useEffect(() => {
        setOptimisticIsArchive(actualIsArchive);
    }, [actualIsArchive]);

    const isArchive = optimisticIsArchive;
    const isList = pathname === '/dashboard/groups';

    const tabsRef = useRef<HTMLDivElement>(null);
    const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0, ready: false });

    useEffect(() => {
        if (!tabsRef.current) return;
        // Decrease timeout for faster response
        const timer = setTimeout(() => {
            const activeBtn = tabsRef.current?.querySelector(`.${styles.activeTab}`) as HTMLElement;
            if (activeBtn && tabsRef.current) {
                const container = tabsRef.current.getBoundingClientRect();
                const btn = activeBtn.getBoundingClientRect();
                setSliderStyle({ left: btn.left - container.left, width: btn.width, ready: true });
            }
        }, 10);
        return () => clearTimeout(timer);
    }, [pathname, isArchive]);

    if (!isList) return <>{children}</>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <h1 className={styles.title}>
                        {isArchive ? 'Guruhlar Archive' : 'Guruhlar'}
                    </h1>
                    <button 
                        className={styles.addBtn} 
                        onClick={openModal}
                        style={{ visibility: isArchive ? 'hidden' : 'visible' }}
                    >
                        <AddRoundedIcon fontSize="small" />
                        <span className={styles.addBtnText}>Guruh qo'shish</span>
                    </button>
                </div>
                <p className={styles.subtitle} style={{ minHeight: '45px' }}>
                    {isArchive
                        ? "Arxivlangan guruhlar ro'yxati. Bu yerda o'chirilgan yoki arxivga ko'chirilgan guruhlarni ko'rishingiz mumkin."
                        : "Ushbu sahifada siz guruhlar ro'yxatini va ularning ma'lumotlarini topasiz. Har bir guruhning nomi, kursi va dars vaqti ma'lumotlari keltirilgan."
                    }
                </p>
            </div>

            <div className={styles.tabs} ref={tabsRef}>
                {sliderStyle.ready && (
                    <div 
                        className={styles.tabSlider} 
                        style={{ left: sliderStyle.left, width: sliderStyle.width }} 
                    />
                )}
                <Link
                    href="/dashboard/groups"
                    onClick={() => setOptimisticIsArchive(false)}
                    className={`${styles.tab} ${!isArchive ? styles.activeTab : ''}`}
                    style={{ textDecoration: 'none' }}
                >
                    <GroupsRoundedIcon fontSize="small" />
                    Guruhlar
                </Link>
                <Link
                    href="/dashboard/groups?tab=archive"
                    onClick={() => setOptimisticIsArchive(true)}
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
