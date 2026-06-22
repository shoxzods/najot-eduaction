"use client";
import { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import { fetchMyProfile, getFileUrl } from '../../api/api';

export default function Header() {
    const [user, setUser] = useState<{ full_name?: string; name?: string; photo?: string | null } | null>(null);

    useEffect(() => {
        fetchMyProfile()
            .then(data => setUser(data))
            .catch(err => console.error("Failed to load user in header:", err));
    }, []);

    const displayName = user?.full_name || user?.name || 'A';
    const initial = displayName.charAt(0).toUpperCase();
    const photoUrl = user?.photo ? getFileUrl(user.photo) : null;

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <button className={styles.iconBtn}>
                    <CalendarTodayRoundedIcon fontSize="small" />
                </button>
                <button className={styles.addBtn}>
                    <AddRoundedIcon fontSize="small" /> 
                    <span>Qo'shish</span> 
                    <ExpandMoreRoundedIcon fontSize="small" />
                </button>
                <div className={styles.searchBox}>
                    <input className={styles.searchIcon} type="text" placeholder="Qidirish..." />
                </div>
            </div>

            <div className={styles.right}>
                <div className={styles.language}>
                    <span>O'zbekcha</span>
                    <ExpandMoreRoundedIcon className={styles.langIcon} fontSize="small" />
                </div>
                <button className={styles.iconBtn}>
                    <NotificationsNoneRoundedIcon />
                </button>
                <button className={styles.iconBtn}>
                    <DarkModeRoundedIcon />
                </button>
                <div className={styles.avatar}>
                    {photoUrl ? (
                        <img src={photoUrl} alt={displayName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                        initial
                    )}
                </div>
            </div>
        </header>
    );
}
