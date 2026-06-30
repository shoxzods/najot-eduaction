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
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import LeaderboardRoundedIcon from '@mui/icons-material/LeaderboardRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import SensorsRoundedIcon from '@mui/icons-material/SensorsRounded';
import React, { useState, useEffect } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import ConfirmDialog from '../UI/ConfirmDialog/ConfirmDialog';

interface MenuItem {
    label: string;
    icon?: React.ReactNode;
    path: string;
    children?: { label: string; path: string }[];
}

const menuItems: MenuItem[] = [
    { label: "Asosiy", icon: <HomeRoundedIcon />, path: "/dashboard" },
    { label: "O'qituvchilar", icon: <PersonRoundedIcon />, path: "/dashboard/teachers" },
    { label: "Guruhlar", icon: <GroupRoundedIcon />, path: "/dashboard/groups" },
    { label: "Talabalar", icon: <DiamondRoundedIcon />, path: "/dashboard/students" },
    { label: "Sovg'alar", icon: <CardGiftcardRoundedIcon />, path: "/dashboard/gifts" },
    { label: "Boshqarish", icon: <SettingsRoundedIcon />, path: "/management" },
];

import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';

const teacherMenuItems: MenuItem[] = [
    { label: "Guruhlar", icon: <GroupRoundedIcon />, path: "/teacher/groups" },
    { label: "Profil", icon: <PersonRoundedIcon />, path: "/teacher/profile" },
];

const studentMenuItems: MenuItem[] = [
    { label: "Bosh sahifa", icon: <HomeRoundedIcon />, path: "/dashboard" },
    { label: "To'lovlarim", icon: <CreditCardRoundedIcon />, path: "/student/payments" },
    { label: "Guruhlarim", icon: <GroupRoundedIcon />, path: "/student/groups" },
    { label: "Ko'rsatkichlarim", icon: <BarChartRoundedIcon />, path: "/student/stats" },
    { label: "Reyting", icon: <LeaderboardRoundedIcon />, path: "/student/rating" },
    { label: "Do'kon", icon: <ShoppingCartRoundedIcon />, path: "/student/shop" },
    { label: "Qo'shimcha darslar", icon: <SensorsRoundedIcon />, path: "/student/extra" },
    { label: "Sozlamalar", icon: <SettingsRoundedIcon />, path: "/student/settings" },
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
    const [userRole, setUserRole] = useState<string>('STUDENT');
    const [expandedMenu, setExpandedMenu] = useState<string | null>("Guruhlar");

    const handleLogout = () => {
        setIsLogoutConfirmOpen(false);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        router.replace('/login');
    };

    useEffect(() => {
        setOptimisticPath(pathname);
        const role = localStorage.getItem('userRole');
        if (role) {
            setUserRole(role);
        }
    }, [pathname]);

    const activeMenuItems = userRole === 'SUPERADMIN' ? menuItems : (userRole === 'TEACHER' ? teacherMenuItems : studentMenuItems);

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
                {activeMenuItems.map((item) => {
                    const isManagement = item.label === "Boshqarish";
                    const hasChildren = !!item.children;
                    
                    let isActive = item.path === "/dashboard" ? optimisticPath === "/dashboard" : optimisticPath.startsWith(item.path);
                    const shouldBeActive = isManagement ? optimisticPath.startsWith("/management") : isActive;

                    const isExpanded = expandedMenu === item.label;

                    const handleClick = (e: any) => {
                        if (hasChildren) {
                            e.preventDefault();
                            setExpandedMenu(isExpanded ? null : item.label);
                            return;
                        }
                        if (isManagement) {
                            e.preventDefault();
                            toggleSubSidebar();
                        } else {
                            setOptimisticPath(item.path);
                            if (isSubSidebarOpen) toggleSubSidebar();
                        }
                    };

                    const renderItem = (
                        <div className={`${styles.item}${shouldBeActive && !hasChildren ? (userRole === 'TEACHER' ? ` ${styles.itemActiveTeacher}` : ` ${styles.itemActive}`) : ""}`} style={{ marginBottom: 0 }}>
                            <span className={styles.itemIcon} style={{ color: (hasChildren && isExpanded) ? '#0f172a' : '' }}>{item.icon}</span>
                            {!isCollapsed && <span className={styles.itemLabel} style={{ fontWeight: (hasChildren && isExpanded) ? 600 : 500, color: (hasChildren && isExpanded) ? '#0f172a' : '' }}>{item.label}</span>}
                            {isCollapsed && <span className={styles.tooltip}>{item.label}</span>}
                            {hasChildren && !isCollapsed && (
                                <span style={{ marginLeft: 'auto', display: 'flex', color: isExpanded ? '#0f172a' : '#475569' }}>
                                    {isExpanded ? <KeyboardArrowUpRoundedIcon fontSize="small" /> : <KeyboardArrowDownRoundedIcon fontSize="small" />}
                                </span>
                            )}
                        </div>
                    );

                    return (
                        <div key={item.path} style={{ width: '100%', marginBottom: '6px' }}>
                            {hasChildren ? (
                                <div onClick={handleClick} style={{ cursor: 'pointer', display: 'block', width: '100%', borderRadius: '12px' }}>
                                    {renderItem}
                                </div>
                            ) : (
                                <ButtonBase
                                    component={Link}
                                    href={item.path}
                                    onClick={handleClick}
                                    style={{ width: '100%', borderRadius: '12px', display: 'block' }}
                                >
                                    {renderItem}
                                </ButtonBase>
                            )}

                            {hasChildren && isExpanded && !isCollapsed && (
                                <div className={styles.subMenu}>
                                    {item.children!.map(child => {
                                        const isChildActive = optimisticPath === child.path;
                                        return (
                                            <ButtonBase
                                                component={Link}
                                                key={child.path}
                                                href={child.path}
                                                onClick={() => setOptimisticPath(child.path)}
                                                className={`${styles.subMenuItem} ${isChildActive ? styles.subMenuItemActive : ''}`}
                                            >
                                                {child.label}
                                            </ButtonBase>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
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