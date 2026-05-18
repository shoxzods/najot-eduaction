import { useEffect, useState } from "react";
import styles from "./AddTeacherModal.module.scss";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { createPortal } from "react-dom";
import { api } from '../../../../api/api';

export default function AddTeacherModal({ isOpen, onClose, onAdd }) {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [teacherData, setTeacherData] = useState([]);

    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
        } else {
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        api.get('/teachers', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }).then(
            res => {
                setTeacherData(res.data.data)
            }
        ).catch(
            err => console.log(err.message)
        )
    }, [])

    const handleCheckboxChange = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id) 
                : [...prev, id]
        );
    };

    if (!shouldRender) return null;

    return createPortal(
        <div 
            className={`${styles.overlay} ${!isOpen ? styles.fadeOut : ""}`}
            onClick={onClose}
        >
            <div 
                className={`${styles.modal} ${!isOpen ? styles.scaleDown : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <div className={styles.headerText}>
                        <h2 className={styles.title}>O'qituvchi qo'shish</h2>
                        <p className={styles.subtitle}>Bitta yoki bir nechta o'qituvchini tanlang</p>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <CloseRoundedIcon />
                    </button>
                </div>

                <div className={styles.body}>
                    <input 
                        type="text" 
                        className={styles.searchInput} 
                        placeholder="O'qituvchi qidirish..." 
                    />
                    
                    <div className={styles.listContainer}>
                        {teacherData.map((teacher) => (
                            <label key={teacher.id} className={styles.listItem}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedIds.includes(teacher.id)}
                                    onChange={() => handleCheckboxChange(teacher.id)}
                                />
                                <span>{teacher.full_name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose}>Bekor qilish</button>
                    <button className={styles.saveBtn} onClick={() => onAdd(selectedIds)}>Saqlash</button>
                </div>
            </div>
        </div>,
        document.body
    );
}
