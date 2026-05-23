import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./GroupDetail.module.scss";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';

export default function GroupDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const tabIndex = searchParams.get("tab") || "0";
    let activeTab = "Ma'lumotlar";
    if (tabIndex === "1") activeTab = "Guruh darsliklari";
    if (tabIndex === "2") activeTab = "Akademik davomati";

    const [activeSubTab, setActiveSubTab] = useState("Uyga vazifa");

    const handleTabChange = (index) => {
        setSearchParams({ tab: index });
    };

    // Fake data based on the screenshot provided
    const fakeGroupData = {
        name: "Bootcamp Full Stack N26",
        status: "Aktiv",
        mentors: [
            {
                id: 1,
                name: "Mohirbek",
                role: "Teacher",
                image: "https://ui-avatars.com/api/?name=Mohirbek&background=f8fafc&color=3b82f6&size=128" // Default avatar
            }
        ],
        parameters: {
            course: "Backend",
            averageAge: 21,
            capacity: 20,
            currentStudents: 5,
            lessonsPerMonth: 20,
            durationMonths: 6.0,
            totalLessons: 20
        },
        schedule: [
            { id: 1, teacher: "Mohirbek", days: "Du/Se/Ch/Pa/Ju", time: "09:30 dan - 12:30 gacha", period: "15 Yan, 2026 - 27 Iyun, 2026", room: "F2 Autodesk // 18" },
            { id: 2, teacher: "+++Yusupova Barchinoy", days: "Du/Se/Ch/Pa/Ju", time: "08:00 dan - 09:30 gacha", period: "15 Yan, 2026 - 27 Iyun, 2026", room: "F2 Autodesk // 18" }
        ],
        calendarDays: [
            { id: 1, day: 2, month: "May", active: true },
            { id: 2, day: 5, month: "May", active: true },
            { id: 3, day: 7, month: "May", active: true },
            { id: 4, day: 9, month: "May", active: true },
            { id: 5, day: 12, month: "May", active: true },
            { id: 6, day: 14, month: "May", active: true },
            { id: 7, day: 16, month: "May", active: true },
            { id: 8, day: 19, month: "May", active: true },
            { id: 9, day: 21, month: "May", active: true },
            { id: 10, day: 23, month: "May", active: true },
            { id: 11, day: 26, month: "May", active: true },
            { id: 12, day: 28, month: "May", active: true },
            { id: 13, day: 30, month: "May", active: true }
        ],
        lessons: [
            { id: 1, number: 1, title: "HTML elementlari va teglari", type: "Dars", date: "15 Yan, 2026 // 09:30" },
            { id: 2, number: 2, title: "CSS selectors", type: "Dars", date: "17 Yan, 2026 // 09:30" },
            { id: 3, number: 3, title: "Flexbox layout model", type: "Dars", date: "20 Yan, 2026 // 09:30" },
            { id: 4, number: 4, title: "Git and Github", type: "Dars", date: "22 Yan, 2026 // 09:30" },
            { id: 5, number: 5, title: "Javascript basics", type: "Dars", date: "25 Yan, 2026 // 09:30" }
        ]
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    <button className={styles.backBtn} onClick={() => navigate("/dashboard/groups")}>
                        <ArrowBackIosNewRoundedIcon fontSize="small" />
                    </button>
                    <h1>{fakeGroupData.name}</h1>
                    <span className={styles.statusTag}>{fakeGroupData.status}</span>
                </div>
                <button className={styles.statsBtn}>
                    <AssessmentOutlinedIcon fontSize="small" />
                    Statistika
                </button>
            </div>

            <div className={styles.tabs}>
                <button 
                    className={`${styles.tab} ${activeTab === "Ma'lumotlar" ? styles.activeTab : ""}`}
                    onClick={() => handleTabChange("0")}
                >
                    Ma'lumotlar
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === "Guruh darsliklari" ? styles.activeTab : ""}`}
                    onClick={() => handleTabChange("1")}
                >
                    Guruh darsliklari
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === "Akademik davomati" ? styles.activeTab : ""}`}
                    onClick={() => handleTabChange("2")}
                >
                    Akademik davomati
                </button>
            </div>

            {activeTab === "Ma'lumotlar" && (
                <>
                    <div className={styles.content}>
                        <div className={styles.mentorsCard}>
                            <div className={styles.cardHeader}>
                                <h3>Mentors</h3>
                            </div>
                            <div className={styles.cardBody}>
                                {fakeGroupData.mentors.map(mentor => (
                                    <div key={mentor.id} className={mentor.role === "Teacher" ? styles.mentorItem : styles.assistantItem}>
                                        <img src={mentor.image} alt={mentor.name} className={styles.mentorAvatar} />
                                        <span className={styles.mentorRole}>{mentor.role}</span>
                                        <span className={styles.mentorName}>{mentor.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.parametersCard}>
                            <div className={styles.cardHeader}>
                                <h3>Guruh parametrlari</h3>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.paramRow}>
                                    <span>Yo'nalish</span>
                                    <strong>{fakeGroupData.parameters.course}</strong>
                                </div>
                                <div className={styles.paramRow}>
                                    <span>O'rtacha yosh</span>
                                    <strong>{fakeGroupData.parameters.averageAge} yosh</strong>
                                </div>
                                <div className={styles.paramRow}>
                                    <span>Sig'imi</span>
                                    <strong>{fakeGroupData.parameters.capacity} ta</strong>
                                </div>
                                <div className={styles.paramRow}>
                                    <span>Hozirgi o'quvchilar</span>
                                    <strong>{fakeGroupData.parameters.currentStudents} ta</strong>
                                </div>
                                <div className={styles.paramRow}>
                                    <span>Darslar soni (1 oyda)</span>
                                    <strong>{fakeGroupData.parameters.lessonsPerMonth} ta</strong>
                                </div>
                                <div className={styles.paramRow}>
                                    <span>Kurs davomiyligi</span>
                                    <strong>{fakeGroupData.parameters.durationMonths} oy</strong>
                                </div>
                                <div className={styles.paramRow}>
                                    <span>Darslar soni (Jami)</span>
                                    <strong>{fakeGroupData.parameters.totalLessons} ta</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.scheduleSection}>
                        <h2>Dars vaqti va xonasi</h2>
                        <div className={styles.scheduleList}>
                            {fakeGroupData.schedule.map(item => (
                                <div key={item.id} className={styles.scheduleItem}>
                                    <div className={styles.teacherName}>{item.teacher}</div>
                                    <div className={styles.scheduleDetails}>
                                        <span>{item.days} // {item.time}</span>
                                        <span>{item.period}</span>
                                        <span>{item.room}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.showMoreBtnWrapper}>
                            <button className={styles.showMoreBtn}>Ko'proq ko'rish</button>
                        </div>
                    </div>
                </>
            )}

            {activeTab === "Guruh darsliklari" && (
                <div className={styles.lessonsSection}>
                    <div className={styles.lessonsHeader}>
                        <div className={styles.lessonsTabsAndTitle}>
                            <h2>Darslar</h2>
                            <div className={styles.subTabs}>
                                <button 
                                    className={`${styles.subTab} ${activeSubTab === "Darslik" ? styles.activeSubTab : ""}`}
                                    onClick={() => setActiveSubTab("Darslik")}
                                >
                                    Darslik
                                </button>
                                <button 
                                    className={`${styles.subTab} ${activeSubTab === "Uyga vazifa" ? styles.activeSubTab : ""}`}
                                    onClick={() => setActiveSubTab("Uyga vazifa")}
                                >
                                    Uyga vazifa
                                </button>
                            </div>
                        </div>
                        
                        {activeSubTab === "Uyga vazifa" && (
                            <button 
                                className={styles.addLessonBtn}
                                onClick={() => navigate(`/dashboard/groups/${id}/homework/create`)}
                            >
                                Yangi vazifa qo'shish
                            </button>
                        )}
                    </div>

                    <div className={styles.tableCard}>
                        <table className={styles.lessonsTable}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Mavzu nomi</th>
                                    <th>Tur</th>
                                    <th>Qo'shilgan sana va vaqt</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {fakeGroupData.lessons.map((lesson, idx) => (
                                    <tr key={lesson.id}>
                                        <td>{idx + 1}</td>
                                        <td className={styles.lessonTitle}>{lesson.title}</td>
                                        <td>{lesson.type}</td>
                                        <td className={styles.timeCell}>{lesson.date}</td>
                                        <td><MoreVertRoundedIcon className={styles.moreIcon} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === "Akademik davomati" && (
                <div className={styles.scheduleSection}>
                    <div className={styles.monthNavigator}>
                        <button className={styles.navBtn}>
                            <KeyboardArrowLeftRoundedIcon />
                        </button>
                        <span className={styles.monthText}>May 2026</span>
                        <button className={styles.navBtn}>
                            <KeyboardArrowRightRoundedIcon />
                        </button>
                    </div>

                    <div className={styles.calendarList}>
                        {fakeGroupData.calendarDays.map(item => (
                            <div key={item.id} className={`${styles.calendarDay} ${item.active ? styles.activeDay : ""}`}>
                                <span className={styles.month}>{item.month}</span>
                                <span className={styles.day}>{item.day}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.showAllBtnWrapper}>
                        <button className={styles.showAllBtn}>Barchasini ko'rish</button>
                    </div>
                </div>
            )}
        </div>
    );
}
