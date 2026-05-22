import { useEffect, useState } from "react";
import styles from "./Teachers.module.scss";
import { api } from '../../api/api';

// ui librariries
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
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
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const openTeacherModal = (teacher = null) => {
        setSelectedTeacher(teacher);
        setIsModalOpen(true);
    };

    const closeTeacherModal = () => {
        setSelectedTeacher(null);
        setIsModalOpen(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const fetchTeachers = () => {
        setIsLoading(true);
        api.get('/teachers').then(
            res => {
                setTeacherData(res.data.data);
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
        fetchTeachers();
    }, []);

    const handleTeacherSubmit = (payload, teacherToEdit) => {
        setIsLoading(true);

        const request = teacherToEdit?.id
            ? api.patch(`/teachers/${teacherToEdit.id}`, payload)
            : api.post('/teachers', payload);

        request.then((res) => {
            console.log(teacherToEdit?.id ? "Teacher updated successfully" : "Teacher created successfully");
            fetchTeachers();
            closeTeacherModal();
        }).catch((err) => {
            const responseData = err.response?.data;
            console.log('Error response from server:', responseData);

            let errorMsg = err.message;
            if (responseData) {
                if (responseData.errors && typeof responseData.errors === 'object') {
                    const messages = [];
                    for (const key in responseData.errors) {
                        if (Array.isArray(responseData.errors[key])) {
                            messages.push(`${key}: ${responseData.errors[key].join(", ")}`);
                        } else {
                            messages.push(`${key}: ${responseData.errors[key]}`);
                        }
                    }
                    errorMsg = messages.join(" | ");
                } else if (Array.isArray(responseData.message)) {
                    errorMsg = responseData.message.join(", ");
                } else if (responseData.message) {
                    errorMsg = responseData.message;
                } else if (responseData.error) {
                    errorMsg = responseData.error;
                } else {
                    errorMsg = JSON.stringify(responseData);
                }
            }
            alert("Xatolik yuz berdi: " + errorMsg);
        }).finally(() => setIsLoading(false));
    };

    const openTeacherEditModal = (teacherOrId) => {
        if (teacherOrId && typeof teacherOrId === 'object') {
            openTeacherModal(teacherOrId);
            return;
        }

        const teacher = teacherData.find((item) => item.id === teacherOrId);
        if (teacher) {
            openTeacherModal(teacher);
        } else {
            console.warn('Teacher not found for edit:', teacherOrId);
        }
    };

    function deleteTeachers(id) {
        if (!window.confirm("O'qituvchini o'chirmoqchimisiz?")) return;
        setIsLoading(true);
        api.delete(`/teachers/${id}`)
            .then((res) => {
                if (res.status === 200 || res.status === 204) {
                    setTeacherData(prev => prev.filter(item => item.id !== id));
                } else {
                    console.warn('Unexpected delete response', res);
                }
            })
            .catch((err) => {
                const responseData = err.response?.data;
                console.error('Error deleting teacher:', responseData || err.message);
                let errorMsg = err.message;
                if (responseData?.message) {
                    errorMsg = responseData.message;
                } else if (responseData?.error) {
                    errorMsg = responseData.error;
                }
                alert("Xatolik yuz berdi: " + errorMsg);
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <h1 className={styles.title}>O'qituvchilar</h1>
                    <button className={styles.addBtn} onClick={() => openTeacherModal()}>
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
                                <th>
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
                            {teacherData.map((teacher, index) => (
                                <tr className={styles.tdata} key={teacher.id ?? teacher.email ?? index}>
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
                                            {teacher.groups && teacher.groups.map((group, index) => {
                                                const key = group?.id ?? `${group?.name ?? String(group)}-${index}`;
                                                const label = group?.name ?? group?.title ?? String(group);
                                                return (
                                                    <span key={key} className={styles.groupTag}>{label}</span>
                                                );
                                            })}
                                        </div>
                                    </td>
                                    <td>{teacher.phone}</td>
                                    <td style={{paddingLeft:'15px'}}>{teacher.email}</td>
                                    <td style={{paddingLeft:'17px' , textAlign:'left'}}>{teacher.address}</td>
                                    <td style={{paddingLeft:'20px'}}>{formatDate(teacher.created_at)}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div className={styles.actions}>
                                            <button className={`${styles.actionBtn} ${styles.viewBtn}`}>
                                                <VisibilityOutlinedIcon fontSize="small" />
                                            </button>
                                            <button onClick={() => deleteTeachers(teacher.id)} className={`${styles.actionBtn}`}>
                                                <DeleteOutlineRoundedIcon fontSize="small" />
                                            </button>
                                            <button onClick={() => openTeacherEditModal(teacher)} className={`${styles.actionBtn}`}>
                                                <EditOutlinedIcon fontSize="small" />
                                            </button>
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
                onClose={closeTeacherModal}
                onSubmit={handleTeacherSubmit}
                teacherToEdit={selectedTeacher}
            />
        </div>
    );
}
