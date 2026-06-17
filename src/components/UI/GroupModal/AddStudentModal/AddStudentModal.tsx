"use client";
import React, { useEffect, useState } from "react";
import styles from "./AddStudentModal.module.scss";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { createPortal } from "react-dom";
import { Student } from '../../../../types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (selectedIds: (string | number)[]) => void;
  items?: Student[];
  initialSelected?: (string | number)[];
}

export default function AddStudentModal({ isOpen, onClose, onAdd, items = [], initialSelected = [] }: AddStudentModalProps) {
    const [shouldRender, setShouldRender] = useState<boolean>(isOpen);
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setSelectedIds(initialSelected);
        } else {
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleCheckboxChange = (id: number) => {
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
                        <h2 className={styles.title}>Talaba qo'shish</h2>
                        <p className={styles.subtitle}>Bitta yoki bir nechta talabani tanlang</p>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <CloseRoundedIcon />
                    </button>
                </div>

                <div className={styles.body}>
                    <input 
                        type="text" 
                        className={styles.searchInput} 
                        placeholder="Talaba qidirish..." 
                    />
                    
                    <div className={styles.listContainer}>
                        {items.map((student) => (
                            <label key={student.id} className={styles.listItem}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedIds.includes(student.id)}
                                    onChange={() => handleCheckboxChange(student.id)}
                                />
                                <span>{student.full_name}</span>
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