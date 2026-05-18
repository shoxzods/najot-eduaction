import { useEffect, useState } from "react";
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


export default function Students() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentData, setStudentData] = useState([]);
    const [page, setPage] = useState(1);
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    function increment() {
        setPage(page + 1);
    }

    function decrement() {
        if (page <= 0) {
            setPage(1)
            return
        }

        setPage(page - 1)
    }


    const fetchStudents = () => {
        api(`/students?page=${page}&limit=3`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }).then(
            res => {
                setStudentData(res.data.data);
            }
        );
    };

    useEffect(() => {
        fetchStudents();
    }, [page]);

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

                <div className={styles.tableWrapper}>
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
                                            {/* {student.avatar ? (
                                                <img src={student.avatar} alt={student.name} className={styles.avatar} />
                                            ) : (
                                                <div className={styles.initialAvatar} style={{ backgroundColor: student.color }}>
                                                    {student.initial}
                                                </div>
                                            )} */}
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
                    <button onClick={decrement} className={styles.pageArrow}>← Previous</button>
                    <div className={styles.pageNumbers}>
                        <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
                        <button className={styles.pageBtn}>2</button>
                        <button className={styles.pageBtn}>3</button>
                        <span className={styles.dots}>...</span>
                        <button className={styles.pageBtn}>8</button>
                        <button className={styles.pageBtn}>9</button>
                        <button className={styles.pageBtn}>10</button>
                    </div>
                    <button onClick={increment} className={styles.pageArrow}>Next →</button>
                </div>
            </div>

            <StudentModal
                isOpen={isModalOpen}
                onClose={toggleModal}
                onSave={() => {
                    fetchStudents();
                }}
            />
        </div>
    );
}
