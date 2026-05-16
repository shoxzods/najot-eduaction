import { useState } from "react";
import styles from "./Students.module.scss";
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import StudentModal from "../../components/UI/StudentModal/StudentModal";

const studentsData = [
    {
        id: 1,
        name: "Ali Valiyev",
        avatar: null,
        initial: "AV",
        groups: ["N26", "n105"],
        phone: "+998976541223",
        email: "ali@gmail.com",
        birthDate: "12.12.2010",
        address: "Sirdaryo",
        createdAt: "12.05.2026",
        color: "#E0E7FF"
    },
    {
        id: 2,
        name: "Salim Qodirov",
        avatar: null,
        initial: "S",
        groups: ["n105"],
        phone: "+998977777777",
        email: "salim@gmail.com",
        birthDate: "14.01.2007",
        address: "Buxoro",
        createdAt: "14.05.2026",
        color: "#F3E8FF"
    },
    {
        id: 3,
        name: "Bobur",
        avatar: null,
        initial: "B",
        groups: ["n105"],
        phone: "+998999999999",
        email: "bobur@gmail.com",
        birthDate: "14.03.2002",
        address: "Toshkent",
        createdAt: "14.05.2026",
        color: "#E0F2FE"
    },
    {
        id: 4,
        name: "Qodir Salimov",
        avatar: null,
        initial: "Q",
        groups: ["n105"],
        phone: "+998911111111",
        email: "qodir@gmail.com",
        birthDate: "29.04.2026",
        address: "O'zbekcha",
        createdAt: "14.05.2026",
        color: "#FCE7F3"
    },
    {
        id: 5,
        name: "Javohir Orifov",
        avatar: null,
        initial: "J",
        groups: ["N26"],
        phone: "+998991234567",
        email: "javohir@gmail.com",
        birthDate: "01.01.2005",
        address: "Andijan",
        createdAt: "16.05.2026",
        color: "#DCFCE7"
    },
    {
        id: 6,
        name: "Malika Ahmedova",
        avatar: null,
        initial: "M",
        groups: ["n105", "F12"],
        phone: "+998909876543",
        email: "malika@gmail.com",
        birthDate: "20.05.2008",
        address: "Namangan",
        createdAt: "17.05.2026",
        color: "#FEF9C3"
    },
    {
        id: 7,
        name: "Sardor Umirzoqov",
        avatar: null,
        initial: "S",
        groups: ["UX1"],
        phone: "+998934445566",
        email: "sardor@gmail.com",
        birthDate: "10.10.2003",
        address: "Navoi",
        createdAt: "18.05.2026",
        color: "#F1F5F9"
    },
    {
        id: 8,
        name: "Diyora Ergasheva",
        avatar: null,
        initial: "D",
        groups: ["n105"],
        phone: "+998915556677",
        email: "diyora@gmail.com",
        birthDate: "15.06.2009",
        address: "Fergana",
        createdAt: "19.05.2026",
        color: "#FDF2F8"
    }
];

export default function Students() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h1 className={styles.title}>Talabalar</h1>
                    <p className={styles.subtitle}>
                        Ushbu sahifada siz Talabalar ro'yxatini va ularning ma'lumotlarini topasiz.
                        Har bir Talaba ismi, fanlari va aloqa ma'lumotlari keltirilgan.
                    </p>
                </div>
                <button className={styles.addBtn} onClick={toggleModal}>
                    <AddRoundedIcon />
                    Talaba qo'shish
                </button>
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
                        <tbody>
                            {studentsData.map((student) => (
                                <tr key={student.id}>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>
                                        <div className={styles.userInfo}>
                                            {student.avatar ? (
                                                <img src={student.avatar} alt={student.name} className={styles.avatar} />
                                            ) : (
                                                <div className={styles.initialAvatar} style={{ backgroundColor: student.color }}>
                                                    {student.initial}
                                                </div>
                                            )}
                                            <span className={styles.userName}>{student.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.groups}>
                                            {student.groups.map((group, index) => (
                                                <span key={index} className={styles.groupTag}>{group}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>{student.phone}</td>
                                    <td>{student.email}</td>
                                    <td>{student.birthDate}</td>
                                    <td>{student.address}</td>
                                    <td>{student.createdAt}</td>
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

            <StudentModal 
                isOpen={isModalOpen} 
                onClose={toggleModal} 
                onSave={() => {
                    console.log("Student saved");
                    toggleModal();
                }}
            />
        </div>
    );
}
