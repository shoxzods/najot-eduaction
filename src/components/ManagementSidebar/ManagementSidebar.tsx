"use client";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ButtonBase from '@mui/material/ButtonBase';
import styles from "./ManagementSidebar.module.scss";
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import React from 'react';

interface SubMenuItem {
  label: string;
  slug: string;
  icon: React.ReactNode;
}

const subMenuItems: SubMenuItem[] = [
    { label: "Kurslar", slug: "courses", icon: <MenuBookRoundedIcon /> },
    { label: "Xonalar", slug: "rooms", icon: <MeetingRoomRoundedIcon /> },
    { label: "Xodimlar", slug: "staff", icon: <BadgeRoundedIcon /> },
    { label: "Coin", slug: "coin", icon: <MonetizationOnRoundedIcon /> },
    { label: "Xabar Yuborish", slug: "send-message", icon: <SendRoundedIcon /> },
];

interface ManagementSidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
}

export default function ManagementSidebar({ isOpen, isCollapsed, onClose }: ManagementSidebarProps) {
    const router = useRouter();
    const pathname = usePathname() || '';
    const searchParams = useSearchParams();

    // Determine current active sub-page slug
    const pathParts = pathname.split("/").filter(Boolean);
    const managementIndex = pathParts.indexOf("management");
    
    let currentSlug = "";
    if (pathname === '/management') {
        currentSlug = searchParams.get('tab') || 'courses';
    } else if (managementIndex >= 0 && pathParts.length > managementIndex + 1) {
        currentSlug = pathParts[managementIndex + 1];
    } else {
        currentSlug = "courses";
    }

    return (
        <div className={`${styles.subSidebar} ${isOpen ? styles.open : ""} ${isCollapsed ? styles.collapsed : ""}`}>
            <div className={styles.header}>
                <h3 className={styles.title}>Menu</h3>
            </div>
            <div className={styles.content}>
                {subMenuItems.map((item, index) => {
                    const isActive = currentSlug === item.slug;
                    const isTab = ['courses', 'rooms', 'staff'].includes(item.slug);
                    const href = isTab ? `/management?tab=${item.slug}` : `/management/${item.slug}`;
                    return (
                        <ButtonBase
                            component={Link}
                            href={href}
                            key={index}
                            style={{ 
                                width: '100%', 
                                borderRadius: '12px',
                                marginBottom: '4px',
                                display: 'block',
                                textAlign: 'left'
                            }}
                        >
                            <div
                                className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
                                onClick={() => {
                                    onClose();
                                }}
                                style={{ marginBottom: 0 }}
                            >
                                <span className={styles.icon}>{item.icon}</span>
                                <span className={styles.label}>{item.label}</span>
                            </div>
                        </ButtonBase>
                    );
                })}
            </div>
        </div>
    );
}
