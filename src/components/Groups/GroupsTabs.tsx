"use client";
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import styles from '@/views/Groups/Groups.module.scss';

export default function GroupsTabs() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const basePath = pathname?.startsWith('/teacher') ? '/teacher/groups' : '/dashboard/groups';
    
    const tabsRef = useRef<HTMLDivElement>(null);
    const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0, ready: false });

    const isArchiveUrl = searchParams.get('tab') === 'archive';
    const [optimisticIsArchive, setOptimisticIsArchive] = useState(isArchiveUrl);

    useEffect(() => {
        setOptimisticIsArchive(isArchiveUrl);
    }, [isArchiveUrl]);

    const isArchive = optimisticIsArchive;

    useEffect(() => {
        if (!tabsRef.current) return;
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

    return (
        <div className={styles.tabs} ref={tabsRef}>
            {sliderStyle.ready && (
                <div 
                    className={styles.tabSlider} 
                    style={{ left: sliderStyle.left, width: sliderStyle.width }} 
                />
            )}
            <Link
                href={basePath}
                onClick={() => setOptimisticIsArchive(false)}
                className={`${styles.tab} ${!isArchive ? styles.activeTab : ''}`}
                style={{ textDecoration: 'none' }}
            >
                <GroupsRoundedIcon fontSize="small" />
                Guruhlar
            </Link>
            <Link
                href={`${basePath}?tab=archive`}
                onClick={() => setOptimisticIsArchive(true)}
                className={`${styles.tab} ${isArchive ? styles.activeTab : ''}`}
                style={{ textDecoration: 'none' }}
            >
                <ArchiveOutlinedIcon fontSize="small" />
                Arxiv
            </Link>
        </div>
    );
}
