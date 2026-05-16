import React from "react";
import styles from "./AddGroupModal.module.scss";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { createPortal } from "react-dom";

const mockGroups = [
    { id: 1, name: "N26" },
    { id: 2, name: "n105" },
    { id: 3, name: "F12" },
    { id: 4, name: "m202" }
];

export default function AddGroupModal({
    isOpen,
    onClose,
    onAdd
}) {
    if (!isOpen) return null;

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.headerText}>
                        <h2 className={styles.title}>Guruhga biriktirish</h2>
                        <p className={styles.subtitle}>Bir yoki bir nechta guruhni tanlang</p>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <CloseRoundedIcon />
                    </button>
                </div>

                <div className={styles.body}>
                    <div className={styles.searchWrapper}>
                        <SearchRoundedIcon className={styles.searchIcon} />
                        <input type="text" placeholder="Guruh qidirish..." className={styles.searchInput} />
                    </div>

                    <div className={styles.groupList}>
                        {mockGroups.map((group) => (
                            <label key={group.id} className={styles.groupItem}>
                                <input type="checkbox" className={styles.checkbox} />
                                <span className={styles.groupName}>{group.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose}>Bekor qilish</button>
                    <button className={styles.addBtn} onClick={onAdd}>Qo'shish</button>
                </div>
            </div>
        </div>,
        document.body
    );
}
