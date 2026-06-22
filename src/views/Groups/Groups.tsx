"use client";
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from "react";

import { api, fetchGroupsCached } from '../../api/api';
import { toast } from '../../utils/toast';

import styles from "./Groups.module.scss";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditGroupSidebar from '../../components/UI/ManagementSidebar/EditGroupSidebar';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import Switch from '@mui/material/Switch';
import GroupModal from "../../components/UI/GroupModal/GroupModal";
import ConfirmDialog from "../../components/UI/ConfirmDialog/ConfirmDialog";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useMemo } from 'react';

const switchSx = {
    width: 44,
    height: 24,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: '2px',
        '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#22c55e',
                opacity: 1,
            },
        },
    },
    '& .MuiSwitch-thumb': {
        width: 20,
        height: 20,
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
    },
    '& .MuiSwitch-track': {
        borderRadius: 12,
        backgroundColor: '#e2e8f0',
        opacity: 1,
    },
};

export default function Groups() {
    const router = useRouter();
    const pathname = usePathname();
    const basePath = pathname?.startsWith('/teacher') ? '/teacher/groups' : '/dashboard/groups';
    const [activeTab, setActiveTab] = useState("groups");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (role) setUserRole(role);
    }, []);
    const [editGroupData, setEditGroupData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groups, setGroup] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeGroup, setActiveGroup] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, group: null });

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const fetchGroups = (forceRefresh = false) => {
        setIsLoading(true);
        const endpoint = pathname?.startsWith('/teacher') ? '/teachers/my/groups' : '/groups/all';
        fetchGroupsCached(endpoint, forceRefresh).then(
            data => {
                setGroup(data || []);
                setIsLoading(false);
            }
        ).catch(
            err => {
                console.log(err.message);
                setIsLoading(false);
            }
        );
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const uniqueTeachers = useMemo(() => {
        return new Set(groups.flatMap(g => g.teachers?.map(t => typeof t === 'object' ? String(t.id || t.full_name || t.name || '') : String(t)).filter(Boolean) || [])).size;
    }, [groups]);

    const uniqueStudents = useMemo(() => {
        return new Set(groups.flatMap(g => g.students?.map(s => typeof s === 'object' ? String(s.id || s.full_name || s.name || '') : String(s)).filter(Boolean) || [])).size;
    }, [groups]);

    const handleMenuOpen = (event, group) => {
        setAnchorEl(event.currentTarget);
        setActiveGroup(group);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setActiveGroup(null);
    };

    const handleEdit = (group) => {
        // Set local row data immediately so sidebar opens and populates instantly
        setEditGroupData(group);
        setIsEditOpen(true);
    };

    const handleEditCancel = () => {
        setIsEditOpen(false);
        setEditGroupData(null);
    };

    const handleDelete = (group) => {
        setDeleteConfirm({ isOpen: true, group });
    };

    const actualDeleteGroup = (groupId) => {
        api.delete(`/groups/${groupId}`)
            .then(() => {
                toast.success("Guruh muvaffaqiyatli o'chirildi!");
                fetchGroups(true);
            })
            .catch(err => {
                console.log(err.message);
                toast.error(err.response?.data?.message || "O'chirishda xatolik yuz berdi");
            });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <h1 className={styles.title}>Guruhlar</h1>
                    <button className={styles.addBtn} onClick={toggleModal}>
                        <AddRoundedIcon fontSize="small" />
                        <span className={styles.addBtnText}>Guruh qo'shish</span>
                    </button>
                </div>
                <p className={styles.subtitle}>
                    Ushbu sahifada siz guruhlar ro'yxatini va ularning ma'lumotlarini topasiz.
                    Har bir guruhning nomi, kursi va dars vaqti ma'lumotlari keltirilgan.
                </p>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === "groups" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("groups")}
                >
                    <GroupsRoundedIcon fontSize="small" />
                    Guruhlar
                </button>
                <Link href={`${basePath}/archive`} className={`${styles.tab} ${activeTab === "archive" ? styles.activeTab : ""}`} style={{ textDecoration: 'none' }}>
                    <ArchiveOutlinedIcon fontSize="small" />
                    Arxiv
                </Link>
            </div>

            {!pathname?.startsWith('/teacher') && (
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={`${styles.statIconWrapper} ${styles.statIconGroups}`}>
                                <GroupsRoundedIcon />
                            </div>
                            <MoreVertRoundedIcon className={styles.moreIcon} />
                        </div>
                        <div className={styles.statInfo}>
                            <p className={styles.statLabel}>Jami guruhlar</p>
                            <h2 className={styles.statValue}>{groups.length}</h2>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={`${styles.statIconWrapper} ${styles.statIconTeachers}`}>
                                <PersonRoundedIcon />
                            </div>
                            <MoreVertRoundedIcon className={styles.moreIcon} />
                        </div>
                        <div className={styles.statInfo}>
                            <p className={styles.statLabel}>O'qituvchilar</p>
                            <h2 className={styles.statValue}>
                                {uniqueTeachers}
                            </h2>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={`${styles.statIconWrapper} ${styles.statIconStudents}`}>
                                <SchoolRoundedIcon />
                            </div>
                            <MoreVertRoundedIcon className={styles.moreIcon} />
                        </div>
                        <div className={styles.statInfo}>
                            <p className={styles.statLabel}>O'quvchilar</p>
                            <h2 className={styles.statValue}>
                                {uniqueStudents}
                            </h2>
                        </div>
                        <div className={styles.studentAvatars}>
                            <div className={styles.smallAvatar} style={{ backgroundColor: '#1e293b' }}>I</div>
                            <div className={styles.smallAvatar} style={{ backgroundColor: '#ea580c' }}>M</div>
                            <div className={styles.smallAvatar} style={{ backgroundColor: '#ec4899' }}>S</div>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.tableCard}>
                <div className={styles.tableWrapper} style={{ position: 'relative', opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.2s', minHeight: '150px' }}>
                    {isLoading && (
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.4)',
                            zIndex: 10
                        }}>
                            <CircularProgress sx={{ color: 'rgb(29, 45, 91)' }} />
                        </Box>
                    )}
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Guruh nomi</th>
                                <th>Kurs</th>
                                <th>Davomiyligi</th>
                                <th>Dars vaqti</th>
                                <th>Xona</th>
                                <th>Talabalar</th>
                                <th style={{ textAlign: 'right' }}>
                                    {userRole === 'SUPERADMIN' && (
                                        <RefreshRoundedIcon className={styles.refreshIcon} fontSize="small" onClick={() => fetchGroups(true)} />
                                    )}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.map((group) => (
                                <tr key={group.id} onClick={() => router.push(`${basePath}/${group.id}`)} style={{ cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; router.prefetch(`${basePath}/${group.id}`); }} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td>
                                        <div className={styles.statusCell}>
                                            <Switch
                                                checked={true}
                                                size="small"
                                                onClick={(e) => e.stopPropagation()}
                                                sx={switchSx}
                                            />
                                            <span className={styles.statusLabel}>FAOL</span>
                                        </div>
                                    </td>
                                    <td><span className={styles.groupName}>{group.name}</span></td>
                                    <td>
                                        <span className={styles.courseTag}>{group.course.name}</span>
                                    </td>
                                    <td>
                                        <span className={styles.duration}>{group.course.duration_month} oy</span>
                                    </td>
                                    <td>
                                        <div className={styles.timeInfo}>
                                            <span className={styles.time}>{group.start_time}</span>
                                            <span className={styles.days}>{group.week_day?.map(
                                                item => item.toLowerCase().slice(0, 3)
                                            ).join(',')} <br /></span>
                                        </div>
                                    </td>
                                    <td><span className={styles.room}>{group.room}</span></td>
                                    <td><span className={styles.studentCount}>{group.students?.length || 0}</span></td>
                                    <td style={{ textAlign: 'right' }}>
                                        {userRole === 'SUPERADMIN' && (
                                            <MoreVertRoundedIcon
                                                className={styles.rowMoreIcon}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMenuOpen(e, group);
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    onClick={(e) => e.stopPropagation()}
                    slotProps={{
                        paper: {
                            sx: {
                                boxShadow: '0 6px 18px rgba(16,24,40,0.08)',
                                border: '1px solid #e6edf6',
                                borderRadius: '8px',
                                padding: '4px',
                                minWidth: '120px',
                            }
                        }
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            handleEdit(activeGroup);
                            handleMenuClose();
                        }}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            color: '#0f172a',
                            fontWeight: 600,
                            fontSize: '14px',
                            borderRadius: '6px',
                            '&:hover': {
                                backgroundColor: '#f8fafc',
                            }
                        }}
                    >
                        <EditRoundedIcon fontSize="small" />
                        <span>Edit</span>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleDelete(activeGroup);
                            handleMenuClose();
                        }}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            color: '#ef4444',
                            fontWeight: 600,
                            fontSize: '14px',
                            borderRadius: '6px',
                            '&:hover': {
                                backgroundColor: '#fef2f2',
                            }
                        }}
                    >
                        <DeleteOutlineRoundedIcon fontSize="small" />
                        <span>Delete</span>
                    </MenuItem>
                </Menu>
            </div>

            {/* Edit Group Sidebar */}
            <EditGroupSidebar
                isOpen={isEditOpen}
                onClose={handleEditCancel}
                groupData={editGroupData}
                onSave={(optimisticData) => {
                    if (optimisticData) {
                        setGroup(prev => prev.map(g => g.id === editGroupData.id ? { ...g, ...optimisticData } : g));
                    }
                    fetchGroups(true);
                }}
            />

            <GroupModal
                isOpen={isModalOpen}
                onClose={toggleModal}
                onSave={() => {
                    fetchGroups(true);
                }}
            />

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, group: null })}
                onConfirm={() => {
                    const id = deleteConfirm.group?.id;
                    setDeleteConfirm({ isOpen: false, group: null });
                    if (id) actualDeleteGroup(id);
                }}
                title="Guruhni o'chirish"
                message="Rostdan ham o'chirishni hohlaysizmi?"
            />
        </div>
    );
}