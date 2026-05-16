import React, { useEffect, useState } from "react";
import styles from "./AddTeacherModal.module.scss";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { createPortal } from "react-dom";

const TEACHERS_LIST = [
    { id: 1, name: "Mohirbek" },
    { id: 2, name: "Jasur" },
    { id: 3, name: "Aziz" },
    { id: 4, name: "Sardor" }
];

export default function AddTeacherModal({ isOpen, onClose, onAdd }) {
    const [shouldRender, setShouldRender] = useState(isOpen);

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
                        {TEACHERS_LIST.map((teacher) => (
                            <label key={teacher.id} className={styles.listItem}>
                                <input type="checkbox" />
                                <span>{teacher.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose}>Bekor qilish</button>
                    <button className={styles.saveBtn} onClick={onAdd}>Saqlash</button>
                </div>
            </div>
        </div>,
        document.body
    );
}
