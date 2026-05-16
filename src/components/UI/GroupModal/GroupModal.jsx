import React, { useEffect, useState } from "react";
import styles from "./GroupModal.module.scss";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { createPortal } from "react-dom";
import AddStudentModal from "./AddStudentModal/AddStudentModal";

const DAYS = [
    { id: 'mon', label: 'Dushanba' },
    { id: 'tue', label: 'Seshanba' },
    { id: 'wed', label: 'Chorshanba' },
    { id: 'thu', label: 'Payshanba' },
    { id: 'fri', label: 'Juma' },
    { id: 'sat', label: 'Shanba' },
    { id: 'sun', label: 'Yakshanba' }
];

export default function GroupModal({ isOpen, onClose, onSave }) {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

    const toggleAddStudentModal = () => setIsAddStudentModalOpen(!isAddStudentModalOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => {
                setShouldRender(false);
                document.body.style.overflow = 'unset';
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
                className={`${styles.modal} ${!isOpen ? styles.slideOut : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <div className={styles.headerText}>
                        <h2 className={styles.title}>Guruh qo'shish</h2>
                        <p className={styles.subtitle}>Yangi guruh yaratish uchun quyidagi ma'lumotlarni kiriting.</p>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <CloseRoundedIcon />
                    </button>
                </div>

                <div className={styles.body}>
                    <div className={styles.formGroup}>
                        <label>Guruh nomi <span>*</span></label>
                        <input type="text" placeholder="Frontend 2024" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Kurs <span>*</span></label>
                        <select defaultValue="">
                            <option value="" disabled>Tanlang</option>
                            <option value="frontend">Frontend</option>
                            <option value="backend">Backend</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Xona <span>*</span></label>
                        <select defaultValue="">
                            <option value="" disabled>Tanlang</option>
                            <option value="autodesk">Autodesk</option>
                            <option value="room1">1-xona</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Dars kunlari <span>*</span></label>
                        <div className={styles.daysGrid}>
                            {DAYS.map(day => (
                                <label key={day.id} className={styles.dayItem}>
                                    <input type="checkbox" />
                                    <span>{day.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Dars vaqti <span>*</span></label>
                        <input type="time" defaultValue="09:00" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Boshlanish sanasi <span>*</span></label>
                        <input type="date" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Tavsif</label>
                        <textarea placeholder="Guruh haqida qo'shimcha ma'lumot (ixtiyoriy)"></textarea>
                    </div>

                    <div className={styles.formGroup}>
                        <label>O'qituvchilar</label>
                        <button className={styles.addOptionBtn}>
                            <AddRoundedIcon fontSize="small" />
                            <span>Qo'shish</span>
                        </button>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Talabalar</label>
                        <button className={styles.addOptionBtn} onClick={toggleAddStudentModal}>
                            <AddRoundedIcon fontSize="small" />
                            <span>Qo'shish</span>
                        </button>
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.footerButtons}>
                        <button className={styles.cancelBtn} onClick={onClose}>Bekor qilish</button>
                        <button className={styles.saveBtn} onClick={onSave}>Saqlash</button>
                    </div>
                    <div className={styles.logoWrapper}>
                        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50 20L80 35V65L50 80L20 65V35L50 20Z" stroke="#6c35de" strokeOpacity="0.1" strokeWidth="1" />
                            <path d="M50 30L70 40V60L50 70L30 60V40L50 30Z" stroke="#6c35de" strokeOpacity="0.1" strokeWidth="1" />
                        </svg>
                    </div>
                </div>

                <AddStudentModal 
                    isOpen={isAddStudentModalOpen} 
                    onClose={toggleAddStudentModal} 
                    onAdd={() => {
                        console.log("Students added to group");
                        toggleAddStudentModal();
                    }}
                />
            </div>
        </div>,
        document.body
    );
}
