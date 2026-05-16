import { useState } from "react";
import styles from "./Courses.module.scss";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CourseModal from "../../../components/UI/CourseModal/CourseModal";

const coursesData = [
    {
        id: 1,
        name: "NodeJs",
        description: "Juda zo'r kurs",
        durationMin: 300,
        durationMonth: 8,
        price: "2 400 000",
        color: "#E3F2FD"
    },
    {
        id: 2,
        name: "React",
        description: "hgdvchgsdvhcsdf",
        durationMin: 120,
        durationMonth: 6,
        price: "9 000 000",
        color: "#F3E5F5"
    },
    {
        id: 3,
        name: "Web Praktikum",
        description: "yaxshi",
        durationMin: 60,
        durationMonth: 3,
        price: "1 000 000",
        color: "#FFF9C4"
    },
    {
        id: 4,
        name: "dcsd",
        description: "dscsd",
        durationMin: 60,
        durationMonth: 1,
        price: "23 432 5435",
        color: "#E8F5E9"
    },
    {
        id: 5,
        name: "Full stack",
        description: "yaxshi kurs o'qinglar",
        durationMin: 120,
        durationMonth: 3,
        price: "200 000 000",
        color: "#FCE4EC"
    }
];

export default function Courses() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    return (
        <div className={styles.coursesContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>Kurslar</h2>
                <button className={styles.addBtn} onClick={toggleModal}>
                    <AddRoundedIcon />
                    Kurslar qo'shish
                </button>
            </div>

            <div className={styles.grid}>
                {coursesData.map((course) => (
                    <div
                        key={course.id}
                        className={styles.card}
                        style={{ backgroundColor: course.color }}
                    >
                        <div className={styles.cardHeader}>
                            <h3 className={styles.courseName}>{course.name}</h3>
                            <div className={styles.actions}>
                                <button className={styles.actionBtn}><DeleteOutlineRoundedIcon /></button>
                                <button className={styles.actionBtn}><EditOutlinedIcon /></button>
                            </div>
                        </div>
                        <p className={styles.description}>{course.description}</p>

                        <div className={styles.details}>
                            <span className={styles.tag}>{course.durationMin} min</span>
                            <span className={styles.tag}>{course.durationMonth} oy</span>
                            <span className={styles.tag}>{course.price}</span>
                        </div>
                    </div>
                ))}
            </div>

            <CourseModal
                isOpen={isModalOpen}
                onClose={toggleModal}
                title="Kurs qo'shish"
                subtitle="Bu yerda siz yangi kurs qo'shishingiz mumkin."
                footer={
                    <>
                        <button className={styles.cancelBtn} onClick={toggleModal}>Bekor qilish</button>
                        <button className={styles.saveBtn}>Saqlash</button>
                    </>
                }
            >
                <div className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Nomi</label>
                        <input type="text" placeholder="HR Manager..." />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Dars davomiyligi</label>
                        <select defaultValue="">
                            <option value="" disabled>Tanlang</option>
                            <option value="60">60 min</option>
                            <option value="120">120 min</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Kurs davomiyligi (oylarda)</label>
                        <select defaultValue="">
                            <option value="" disabled>Tanlang</option>
                            <option value="1">1 oy</option>
                            <option value="3">3 oy</option>
                            <option value="6">6 oy</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Narx</label>
                        <div className={styles.inputWrapper}>
                            <input type="text" placeholder="Narxini kiriting" />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea placeholder="A little about the company and the team that you'll be working with."></textarea>
                        <p className={styles.hint}>This is a hint text to help user.</p>
                    </div>
                </div>
            </CourseModal>
        </div>
    );
}
