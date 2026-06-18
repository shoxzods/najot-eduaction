"use client";
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from "./Sidebar.module.scss";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import DiamondRoundedIcon from '@mui/icons-material/DiamondRounded';
import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import React, { useState, useEffect } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import ConfirmDialog from '../UI/ConfirmDialog/ConfirmDialog';

interface MenuItem {
    label: string;
    icon: React.ReactNode;
    path: string;
}

const menuItems: MenuItem[] = [
    { label: "Asosiy", icon: <HomeRoundedIcon />, path: "/dashboard" },
    { label: "O'qituvchilar", icon: <PersonRoundedIcon />, path: "/dashboard/teachers" },
    { label: "Guruhlar", icon: <GroupRoundedIcon />, path: "/dashboard/groups" },
    { label: "Talabalar", icon: <DiamondRoundedIcon />, path: "/dashboard/students" },
    { label: "Sovg'alar", icon: <CardGiftcardRoundedIcon />, path: "/dashboard/gifts" },
    { label: "Boshqarish", icon: <SettingsRoundedIcon />, path: "/management" },
];

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    isSubSidebarOpen: boolean;
    toggleSubSidebar: () => void;
}

export default function Sidebar({ isCollapsed, toggleSidebar, isSubSidebarOpen, toggleSubSidebar }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname() || '';
    const [optimisticPath, setOptimisticPath] = useState(pathname);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

    const handleLogout = () => {
        setIsLogoutConfirmOpen(false);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.replace('/login');
    };

    useEffect(() => {
        setOptimisticPath(pathname);
    }, [pathname]);

    return (
        <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
            <div className={styles.logo}>
                <img className={styles.logo_icon} src="/najot_edu.svg" alt="" />
                {!isCollapsed && <p className={styles.logo_title}>Najot Edu</p>}
                <button className={styles.toggleBtn} onClick={toggleSidebar}>
                    <ChevronLeftRoundedIcon
                        fontSize="small"
                        style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
                    />
                </button>
            </div>

            <nav className={styles.nav}>
                {menuItems.map((item) => {
                    const isManagement = item.label === "Boshqarish";
                    let isActive = item.path === "/dashboard" ? optimisticPath === "/dashboard" : optimisticPath.startsWith(item.path);
                    const shouldBeActive = isManagement ? optimisticPath.startsWith("/management") : isActive;

                    return (
                        <ButtonBase
                            component={Link}
                            key={item.path}
                            href={item.path}
                            onClick={(e: any) => {
                                if (item.label === "Boshqarish") {
                                    e.preventDefault();
                                    toggleSubSidebar();
                                } else {
                                    setOptimisticPath(item.path);
                                    if (isSubSidebarOpen) toggleSubSidebar();
                                }
                            }}
                            style={{
                                width: '100%',
                                borderRadius: '12px',
                                marginBottom: '6px',
                                display: 'block'
                            }}
                        >
                            <div className={`${styles.item}${shouldBeActive ? ` ${styles.itemActive}` : ""}`} style={{ marginBottom: 0 }}>
                                <span className={styles.itemIcon}>{item.icon}</span>
                                {!isCollapsed && <span className={styles.itemLabel}>{item.label}</span>}
                                {isCollapsed && <span className={styles.tooltip}>{item.label}</span>}
                            </div>
                        </ButtonBase>
                    );
                })}

                {/* Divider */}
                <div className={styles.navDivider} />

                {/* Logout */}
                <button className={styles.logoutNavItem} onClick={() => setIsLogoutConfirmOpen(true)}>
                    <span className={styles.itemIcon}><LogoutRoundedIcon /></span>
                    {!isCollapsed && <span className={styles.itemLabel}>Chiqish</span>}
                    {isCollapsed && <span className={styles.tooltip}>Chiqish</span>}
                </button>
            </nav>

            <div className={styles.subscription}>
                <div className={styles.subInfo}>
                    <img className={styles.alarm} src="/alarm.png" alt="" />
                    <div className={styles.subTextWrapper}>
                        <p className={styles.subTitle}>Obuna</p>
                        <p className={styles.subStatus}>Obunangiz tugagan</p>
                    </div>
                </div>
                <button className={styles.subBtn}>
                    <i style={{ transform: 'rotate(50deg)' }} className="bi bi-arrow-clockwise"></i><p className={styles.subtext}>Obunani yangilash</p>
                </button>
            </div>

            <ConfirmDialog
                isOpen={isLogoutConfirmOpen}
                onClose={() => setIsLogoutConfirmOpen(false)}
                onConfirm={handleLogout}
                title="Chiqish"
                message="Tizimdan chiqishni xohlaysizmi?"
                confirmText="Chiqish"
                cancelText="Bekor qilish"
            />
        </aside>
    );
}