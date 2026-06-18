"use client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useTransition, useCallback, useMemo } from "react";

import styles from "./Students.module.scss";
import { api, getFileUrl } from '../../api/api';

import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import StudentModal from "../../components/UI/StudentModal/StudentModal";
import ConfirmDialog from "../../components/UI/ConfirmDialog/ConfirmDialog";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export default function Students() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentData, setStudentData] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; studentId: number | null }>({ isOpen: false, studentId: null });
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'error' | 'success' | 'info' | 'warning' }>({ open: false, message: '', severity: 'error' });

    const handleCloseSnackbar = (_event: any, reason?: string) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const openAddStudentModal = useCallback(() => {
        setSelectedStudent(null);
        setIsModalOpen(true);
    }, []);

    const openEditStudentModal = useCallback((student: any) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedStudent(null);
    }, []);

    const formatDate = useCallback((dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "-";
        return date.toLocaleDateString("ru-RU");
    }, []);

    const fetchStudents = (targetPage) => {
        setIsLoading(true);
        return api(`/students?page=${targetPage}&limit=4`).then(
            res => {
                const data = res.data.data || [];

                if (data.length > 0 || targetPage === 1) {
                    setStudentData(data);
                    setPage(targetPage);
                }

                if (res.data.meta && res.data.meta.last_page) {
                    setTotalPages(res.data.meta.last_page);
                } else if (res.data.totalPages) {
                    setTotalPages(res.data.totalPages);
                } else if (data.length < 4) {
                    // Agar ma'lumotlar kam kelsa (yoki bo'sh), demak bu oxirgi sahifa
                    setTotalPages(targetPage);
                } else {
                    // Agar to'liq 4 ta ma'lumot kelsa va API dan jami sahifalar soni kelmasa, yana bitta sahifa bor deb faraz qilamiz
                    setTotalPages(Math.max(totalPages, targetPage + 1));
                }
                setIsLoading(false);
            }
        ).catch(
            err => {
                console.log(err.message);
                setIsLoading(false);
            }
        );
    };

    function increment() {
        if (page < totalPages) {
            startTransition(async () => {
                await fetchStudents(page + 1);
            });
        }
    }

    function decrement() {
        if (page > 1) {
            startTransition(async () => {
                await fetchStudents(page - 1);
            });
        }
    }

    useEffect(() => {
        startTransition(async () => {
            await fetchStudents(1);
        });
    }, []);

    const getPaginationGroup = useCallback(() => {
        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (page <= 4) {
                return [1, 2, 3, 4, 5, '...', totalPages];
            } else if (page >= totalPages - 3) {
                return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
                return [1, '...', page - 1, page, page + 1, '...', totalPages];
            }
        }
        return pages;
    }, [page, totalPages]);


    function deleteStudent(id) {
        setDeleteConfirm({ isOpen: true, studentId: id });
    }

    function actualDeleteStudent(id) {
        setIsLoading(true);
        api.delete(`/students/${id}`)
            .then(res => {
                if (res.status === 200 || res.status === 204) {
                    setStudentData(prev => prev.filter(s => s.id !== id));
                    setSnackbar({ open: true, message: "Talaba muvaffaqiyatli o'chirildi!", severity: 'success' });
                } else {
                    console.warn('Unexpected delete response', res);
                }
            })
            .catch(err => {
                const responseData = err.response?.data;
                console.error('Error deleting student:', responseData || err.message);
                let errorMsg = err.message;
                if (responseData?.message) {
                    errorMsg = responseData.message;
                } else if (responseData?.error) {
                    errorMsg = responseData.error;
                }
                setSnackbar({ open: true, message: "Xatolik yuz berdi: " + errorMsg, severity: 'error' });
            })
            .finally(() => setIsLoading(false));
    }

    const filteredStudents = useMemo(() => {
        if (!searchQuery) return studentData;
        const q = searchQuery.toLowerCase();
        return studentData.filter((student: any) =>
            student.full_name?.toLowerCase().includes(q) ||
            student.phone?.toLowerCase().includes(q) ||
            student.email?.toLowerCase().includes(q)
        );
    }, [studentData, searchQuery]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <h1 className={styles.title}>Talabalar</h1>
                    <button className={styles.addBtn} onClick={openAddStudentModal}>
                        <AddRoundedIcon fontSize="small" />
                        Talaba qo'shish
                    </button>
                </div>
                <p className={styles.subtitle}>
                    Ushbu sahifada siz Talabalar ro'yxatini va ularning ma'lumotlarini topasiz.
                    Har bir Talaba ismi, fanlari va aloqa ma'lumotlari keltirilgan.
                </p>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <div className={styles.searchWrapper}>
                        <SearchRoundedIcon className={styles.searchIcon} fontSize="small" />
                        <input
                            type="text"
                            placeholder="Search"
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className={styles.tableActions}>
                        <button className={styles.filterBtn}>
                            <FilterListRoundedIcon fontSize="small" />
                            Filters
                        </button>
                        <Link href="/dashboard/students/archive" className={styles.archiveBtn} style={{ textDecoration: 'none' }}>
                            <ArchiveOutlinedIcon fontSize="small" />
                            Arxiv
                        </Link>
                    </div>
                </div>

                <div className={styles.tableWrapper} style={{ position: 'relative', opacity: (isPending || isLoading) ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                    {(isPending || isLoading) && (
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
                                <th><input type="checkbox" /></th>
                                <th>Nomi ↓</th>
                                <th>Guruh</th>
                                <th>Telefon raqamlari</th>
                                <th>Email</th>
                                <th>Tug'ilgan sanasi</th>
                                <th>Manzil</th>
                                <th>Yaratilgan sana</th>
                                <th>Amallar</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {studentData.filter(student => {
                                if (!searchQuery) return true;
                                const q = searchQuery.toLowerCase();
                                return (
                                    student.full_name?.toLowerCase().includes(q) ||
                                    student.phone?.toLowerCase().includes(q) ||
                                    student.email?.toLowerCase().includes(q)
                                );
                            }).map((student) => (
                                <tr key={student.id}>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <div className={styles.userInfo}>
                                            {student.photo ? (
                                                <img
                                                    src={getFileUrl(student.photo)}
                                                    alt={student.full_name}
                                                    className={styles.avatar}
                                                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px' }}
                                                />
                                            ) : (
                                                <div
                                                    className={styles.initialAvatar}
                                                    style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f0f0f0', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '10px' }}
                                                >
                                                    {student.full_name ? student.full_name.charAt(0).toUpperCase() : 'S'}
                                                </div>
                                            )}
                                            <span className={styles.userName}>{student.full_name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.groups}>
                                            {student.groups.map((group, index) => (
                                                <span key={index} className={styles.groupTag}>{group.name}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>{student.phone}</td>
                                    <td style={{ paddingLeft: '16px' }}>{student.email}</td>
                                    <td style={{ paddingLeft: '20px' }}>{formatDate(student.birth_date)}</td>
                                    <td style={{ paddingLeft: '18px' }}>{student.address}</td>
                                    <td style={{ paddingLeft: '20px' }}>{formatDate(student.created_at)}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div className={styles.actions}>
                                            <button className={styles.actionBtn}><VisibilityOutlinedIcon fontSize="small" /></button>
                                            <button onClick={() => deleteStudent(student.id)} className={styles.actionBtn}><DeleteOutlineRoundedIcon fontSize="small" /></button>
                                            <button onClick={() => openEditStudentModal(student)} className={styles.actionBtn}><EditOutlinedIcon fontSize="small" /></button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {studentData.length > 0 && totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            onClick={decrement}
                            className={`${styles.pageArrow} ${(page === 1 || isPending || isLoading) ? styles.disabled : ''}`}
                            disabled={page === 1 || isPending || isLoading}
                        >
                            ← Previous
                        </button>
                        <div className={styles.pageNumbers}>
                            {getPaginationGroup().map((item, index) => {
                                if (item === '...') {
                                    return <span key={`dots-${index}`} className={styles.dots}>...</span>;
                                }
                                return (
                                    <button
                                        key={index}
                                        className={`${styles.pageBtn} ${page === item ? styles.active : ''}`}
                                        onClick={() => {
                                            if (page !== item) {
                                                startTransition(async () => {
                                                    await fetchStudents(item);
                                                });
                                            }
                                        }}
                                        disabled={isPending || isLoading}
                                    >
                                        {item}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={increment}
                            className={`${styles.pageArrow} ${(page >= totalPages || isPending || isLoading) ? styles.disabled : ''}`}
                            disabled={page >= totalPages || isPending || isLoading}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

            <StudentModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={() => {
                    fetchStudents(page);
                }}
                studentToEdit={selectedStudent}
            />

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, studentId: null })}
                onConfirm={() => {
                    const id = deleteConfirm.studentId;
                    setDeleteConfirm({ isOpen: false, studentId: null });
                    if (id) actualDeleteStudent(id);
                }}
                title="Talabani o'chirish"
                message="Rostdan ham o'chirishni hohlaysizmi?"
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                    top: '20px !important',
                    right: '20px !important',
                    width: 'calc(25vw - 40px)',
                    maxWidth: '400px'
                }}
            >
                <MuiAlert
                    onClose={(e) => handleCloseSnackbar(e, undefined)}
                    severity={snackbar.severity as "success" | "error" | "info" | "warning"}
                    elevation={6}
                    variant="filled"
                    sx={{
                        width: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        padding: '6px 12px',
                        paddingBottom: '10px',
                        fontSize: '13px',
                        alignItems: 'center',
                        '& .MuiAlert-icon': {
                            fontSize: '18px',
                            marginRight: '8px'
                        },
                        '& .MuiAlert-message': {
                            padding: '4px 0',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '100%'
                        },
                        '& .MuiAlert-action': {
                            padding: '0 0 0 8px',
                            marginRight: '-4px'
                        }
                    }}
                >
                    {snackbar.message}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            height: '3px',
                            backgroundColor: 'rgba(255,255,255,0.5)',
                            animation: snackbar.open ? 'shrink 6s linear forwards' : 'none',
                            '@keyframes shrink': {
                                '0%': { width: '100%' },
                                '100%': { width: '0%' }
                            }
                        }}
                    />
                </MuiAlert>
            </Snackbar>
        </div>
    );
}
