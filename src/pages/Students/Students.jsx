import { useEffect, useState, useTransition } from "react";
import styles from "./Students.module.scss";
import { api } from '../../api/api';


import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import StudentModal from "../../components/UI/StudentModal/StudentModal";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Students() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentData, setStudentData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10); // Default to 10 to match design if API doesn't provide
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(false);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const fetchStudents = (targetPage) => {
        setIsLoading(true);
        return api(`/students?page=${targetPage}&limit=3`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }).then(
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
                } else if (data.length < 3 && targetPage >= totalPages) {
                    setTotalPages(targetPage);
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
        if (studentData.length === 3) {
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

    const getPaginationGroup = () => {
        let pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (page <= 4) {
                pages = [1, 2, 3, 4, 5, '...', totalPages];
            } else if (page >= totalPages - 3) {
                pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
                pages = [1, '...', page - 1, page, page + 1, '...', totalPages];
            }
        }
        return pages;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <h1 className={styles.title}>Talabalar</h1>
                    <button className={styles.addBtn} onClick={toggleModal}>
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
                        <input type="text" placeholder="Search" className={styles.searchInput} />
                    </div>
                    <div className={styles.tableActions}>
                        <button className={styles.filterBtn}>
                            <FilterListRoundedIcon fontSize="small" />
                            Filters
                        </button>
                        <button className={styles.archiveBtn}>
                            <ArchiveOutlinedIcon fontSize="small" />
                            Arxiv
                        </button>
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
                            <CircularProgress sx={{ color: '#6c35de' }} />
                        </Box>
                    )}
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>
                                    <input type="checkbox" />
                                </th>
                                <th>Nomi ↓</th>
                                <th>Guruh</th>
                                <th>Telefon raqamlari</th>
                                <th>Email</th>
                                <th>Tug'ilgan sanasi</th>
                                <th>Manzil</th>
                                <th>Yaratilgan sana</th>
                                <th style={{ textAlign: 'right' }}>Amallar</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {studentData.map((student) => (
                                <tr key={student.id}>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <div className={styles.userInfo}>
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
                                    <td>{student.email}</td>
                                    <td>{new Date(student.birth_date).toLocaleDateString()}</td>
                                    <td>{student.address}</td>
                                    <td>{new Date(student.created_at).toLocaleDateString()}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div className={styles.actions}>
                                            <button className={styles.actionBtn}><VisibilityOutlinedIcon fontSize="small" /></button>
                                            <button className={styles.actionBtn}><DeleteOutlineRoundedIcon fontSize="small" /></button>
                                            <button className={styles.actionBtn}><EditOutlinedIcon fontSize="small" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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
                        className={`${styles.pageArrow} ${(studentData.length < 3 || isPending || isLoading) ? styles.disabled : ''}`}
                        disabled={studentData.length < 3 || isPending || isLoading}
                    >
                        Next →
                    </button>
                </div>
            </div>

            <StudentModal
                isOpen={isModalOpen}
                onClose={toggleModal}
                onSave={() => {
                    fetchStudents(page);
                }}
            />
        </div>
    );
}
