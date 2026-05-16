import { useState } from "react";
import styles from "./Teachers.module.scss";
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import TeacherModal from "../../components/UI/TeacherModal/TeacherModal";

const teachersData = [
    {
        id: 1,
        name: "Mohirbek",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohir",
        groups: ["N26", "n105"],
        phone: "+998944481309",
        email: "moxirbek@gmail.com",
        address: "Tashkent",
        createdAt: "12.05.2026"
    },
    {
        id: 2,
        name: "Dilshod",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dilshod",
        groups: ["F12", "m202"],
        phone: "+998901234567",
        email: "dilshod@gmail.com",
        address: "Samarkand",
        createdAt: "10.05.2026"
    },
    {
        id: 3,
        name: "Anvar",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anvar",
        groups: ["UX1"],
        phone: "+998935556677",
        email: "anvar@gmail.com",
        address: "Bukhara",
        createdAt: "08.05.2026"
    }
];

export default function Teachers() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h1 className={styles.title}>O'qituvchilar</h1>
                    <p className={styles.subtitle}>
                        Ushbu sahifada siz o'qituvchilar ro'yxatini va ularning ma'lumotlarini topasiz. 
                        Har bir o'qituvchining ismi, fanlari va aloqa ma'lumotlari keltirilgan.
                    </p>
                </div>
                <button className={styles.addBtn} onClick={toggleModal}>
                    <AddRoundedIcon />
                    O'qituvchi qo'shish
                </button>
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
                                <th>Manzil</th>
                                <th>Yaratilgan sana</th>
                                <th style={{ textAlign: 'right' }}>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachersData.map((teacher) => (
                                <tr key={teacher.id}>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <div className={styles.userInfo}>
                                            <img src={teacher.avatar} alt={teacher.name} className={styles.avatar} />
                                            <span className={styles.userName}>{teacher.name}</span>
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
                                    <td>{teacher.createdAt}</td>
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
                    console.log("Teacher saved");
                    toggleModal();
                }}
            />
        </div>
    );
}
