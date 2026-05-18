import styles from "./AddGroupModal.module.scss";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { createPortal } from "react-dom";
import { api } from '../../../../api/api';
import { useEffect, useState } from "react";

export default function AddGroupModal({
    isOpen,
    onClose,
    onAdd,
    initialSelectedGroups = []
}) {
    if (!isOpen) return null;

    const [ groups , setGroups ] = useState([]);
    const [ selectedGroupIds, setSelectedGroupIds ] = useState(
        initialSelectedGroups.map(g => g.id)
    );

    useEffect(() => {
        api.get(`/groups/all`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).then(
            res => {
                setGroups(res.data.data)
            }
        ).catch(
            err => console.log(err.message)
        )
    }, [])

    const handleCheckboxChange = (groupId) => {
        if (selectedGroupIds.includes(groupId)) {
            setSelectedGroupIds(selectedGroupIds.filter(id => id !== groupId));
        } else {
            setSelectedGroupIds([...selectedGroupIds, groupId]);
        }
    };

    const handleAddClick = () => {
        const selected = groups
            .filter(g => selectedGroupIds.includes(g.id))
            .map(g => ({ id: g.id, name: g.name }));
        onAdd(selected);
    };

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
                        {groups.map((group) => {
                            const isChecked = selectedGroupIds.includes(group.id);
                            return (
                                <label key={group.id} className={styles.groupItem}>
                                    <input 
                                        type="checkbox" 
                                        className={styles.checkbox} 
                                        checked={isChecked}
                                        onChange={() => handleCheckboxChange(group.id)}
                                    />
                                    <span className={styles.groupName}>
                                        {group.name} <span style={{ opacity: 0.6, fontSize: '0.85em', marginLeft: '4px' }}>({group.course.name})</span>
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose}>Bekor qilish</button>
                    <button className={styles.addBtn} onClick={handleAddClick}>Qo'shish</button>
                </div>
            </div>
        </div>,
        document.body
    );
}
