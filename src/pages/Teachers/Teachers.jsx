import { useEffect, useState } from "react";
import styles from "./Teachers.module.scss";
import { api } from '../../api/api';

// ui librariries
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import TeacherModal from "../../components/UI/TeacherModal/TeacherModal";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Teachers() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [teacherData, setTeacherData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const toggleModal = () => setIsModalOpen(!isModalOpen);


    const fetchTeachers = () => {
        setIsLoading(true);
        api.get('/teachers', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }).then(
            res => {
                setTeacherData(res.data.data)
                setIsLoading(false);
            }
        ).catch(
            err => {
                console.log(err.message);
                setIsLoading(false);
            }
        )
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <h1 className={styles.title}>O'qituvchilar</h1>
                    <button className={styles.addBtn} onClick={toggleModal}>
                        <AddRoundedIcon fontSize="small" />
                        <span className={styles.addBtnText}>O'qituvchi qo'shish</span>
                    </button>
                </div>
                <p className={styles.subtitle}>
                    Ushbu sahifada siz o'qituvchilar ro'yxatini va ularning ma'lumotlarini topasiz.
                    Har bir o'qituvchining ismi, fanlari va aloqa ma'lumotlari keltirilgan.
                </p>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
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
                    <div className={styles.searchWrapper}>
                        <SearchRoundedIcon className={styles.searchIcon} fontSize="small" />
                        <input type="text" placeholder="Search" className={styles.searchInput} />
                    </div>
                </div>

                <div className={styles.tableWrapper} style={{ position: 'relative', opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
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
                                <th>Manzil</th>
                                <th>Yaratilgan sana</th>
                                <th style={{ textAlign: 'right' }}>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teacherData.map((teacher) => (
                                <tr key={teacher.id}>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <div className={styles.userInfo}>
                                            {teacher.photo ? (
                                                <img
                                                    src={teacher.photo.startsWith('http') ? teacher.photo : `https://najot-edu.softwareengineer.uz/${teacher.photo.replace(/^\//, '')}`}
                                                    alt={teacher.full_name}
                                                    className={styles.avatar}
                                                />
                                            ) : (
                                                <div className={styles.initialAvatar}>
                                                    {teacher.full_name ? teacher.full_name.charAt(0).toUpperCase() : 'T'}
                                                </div>
                                            )}
                                            <span className={styles.userName}>{teacher.full_name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.groups}>
                                            {teacher.groups.map((group, index) => (
                                                <span key={index} className={styles.groupTag}>{group}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>{teacher.phone}</td>
                                    <td>{teacher.email}</td>
                                    <td>{teacher.address}</td>
                                    <td>{new Date(teacher.created_at).toLocaleDateString()}</td>
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
                    <button className={styles.pageArrow}>← Previous</button>
                    <div className={styles.pageNumbers}>
                        <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
                        <button className={styles.pageBtn}>2</button>
                        <button className={styles.pageBtn}>3</button>
                        <span className={styles.dots}>...</span>
                        <button className={styles.pageBtn}>8</button>
                        <button className={styles.pageBtn}>9</button>
                        <button className={styles.pageBtn}>10</button>
                    </div>
                    <button className={styles.pageArrow}>Next →</button>
                </div>
            </div>

            <TeacherModal
                isOpen={isModalOpen}
                onClose={toggleModal}
                onSave={() => {
                    fetchTeachers();
                }}
            />
        </div>
    );
}
