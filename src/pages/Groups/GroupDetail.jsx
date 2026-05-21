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
            { id: 8, day: 19, month: "May", active: false },
            { id: 9, day: 21, month: "May", active: false },
            { id: 10, day: 23, month: "May", active: false },
            { id: 11, day: 26, month: "May", active: false },
            { id: 12, day: 28, month: "May", active: false },
            { id: 13, day: 30, month: "May", active: false },
        ],
        lessons: [
            { id: 1, title: "Html asoslari", studentsCount: 5, timerCount: 0, checkCount: 0, givenTime: "13 May, 2026 10:00", endTime: "14 May, 2026 06:00", lessonDate: "12 May, 2026" },
            { id: 2, title: "Kirish", studentsCount: 5, timerCount: 0, checkCount: 0, givenTime: "13 May, 2026 11:52", endTime: "14 May, 2026 07:52", lessonDate: "9 May, 2026" },
            { id: 3, title: "Nodejs", studentsCount: 5, timerCount: 0, checkCount: 3, givenTime: "14 May, 2026 09:47", endTime: "15 May, 2026 05:47", lessonDate: "14 May, 2026" },
            { id: 4, title: "takrorlash", studentsCount: 5, timerCount: 0, checkCount: 0, givenTime: "19 May, 2026 16:22", endTime: "20 May, 2026 12:22", lessonDate: "19 May, 2026" },
        ]
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    <button className={styles.backBtn} onClick={() => navigate(-1)}>
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
                    className={`${styles.tab} ${activeTab === "Ma'lumotlar" ? styles.activeTab : ''}`}
                    onClick={() => handleTabChange("0")}
                >
                    Ma'lumotlar
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === "Guruh darsliklari" ? styles.activeTab : ''}`}
                    onClick={() => handleTabChange("1")}
                >
                    Guruh darsliklari
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === "Akademik davomati" ? styles.activeTab : ''}`}
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
                                <h3>Guruh mentorlari</h3>
                            </div>
                            <div className={styles.cardBody}>
                                {fakeGroupData.mentors.map(mentor => (
                                    <div key={mentor.id} className={styles.mentorItem}>
                                        <img src={mentor.image} alt={mentor.name} className={styles.mentorAvatar} />
                                        <span className={styles.mentorRole}>{mentor.role}</span>
                                        <span className={styles.mentorName}>{mentor.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.parametersCard}>
                            <div className={styles.cardHeader}>
                                <h3>Parametrlar</h3>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.paramRow}>
                                    <span>Kurs:</span>
                                    <strong>{fakeGroupData.parameters.course}</strong>
                                </div>
                                <div className={styles.paramRow}>
                                    <span>O'rta yosh:</span>
                                    <strong>{fakeGroupData.parameters.averageAge}</strong>
                                </div>
                                <div className={styles.paramRow}>
                                    <span>O'quvchilar sig'imi:</span>
                                    <strong>{fakeGroupData.parameters.capacity}</strong>
                                </div>
                                <div className={styles.paramRow}>
                                    <span>Mavjud o'quvchilar:</span>
                                    <strong>{fakeGroupData.parameters.currentStudents}</strong>
                                </div>
                                <div className={styles.paramRow}>
                                    <span>O'quv oyidagi darslar soni:</span>
                                    <strong>{fakeGroupData.parameters.lessonsPerMonth}</strong>
                                </div>
                                <div className={styles.paramRow}>
                                    <span>Kurs davomiyligi (oy):</span>
                                    <strong>{fakeGroupData.parameters.durationMonths}</strong>
                                </div>
                                <div className={styles.paramRow}>
                                    <span>Jami darslar soni:</span>
                                    <strong>{fakeGroupData.parameters.totalLessons}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.scheduleSection}>
                        <h2>Dars jadvali</h2>
                        
                        <div className={styles.scheduleList}>
                            {fakeGroupData.schedule.map(item => (
                                <div key={item.id} className={styles.scheduleItem}>
                                    <div className={styles.teacherName}>{item.teacher}</div>
                                    <div className={styles.scheduleDetails}>
                                        <span>{item.days}</span>
                                        <span>{item.time}</span>
                                        <span>{item.period}</span>
                                        <span>{item.room}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.showMoreBtnWrapper}>
                            <button className={styles.showMoreBtn}>Yana ko'rsatish (9)</button>
                        </div>

                        <div className={styles.monthNavigator}>
                            <button className={styles.navBtn}><KeyboardArrowLeftRoundedIcon fontSize="small" /></button>
                            <span className={styles.monthText}>1-o'quv oyi</span>
                            <button className={styles.navBtn}><KeyboardArrowRightRoundedIcon fontSize="small" /></button>
                        </div>

                        <div className={styles.calendarList}>
                            {fakeGroupData.calendarDays.map(item => (
                                <div key={item.id} className={`${styles.calendarDay} ${item.active ? styles.activeDay : ''}`}>
                                    <span className={styles.month}>{item.month}</span>
                                    <span className={styles.day}>{item.day}</span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.showAllBtnWrapper}>
                            <button className={styles.showAllBtn}>Barchasini ko'rish</button>
                        </div>
                    </div>
                </>
            )}

            {activeTab === "Guruh darsliklari" && (
                <div className={styles.lessonsSection}>
                    <div className={styles.lessonsHeader}>
                        <div className={styles.lessonsTabsAndTitle}>
                            <h2>Guruh darsliklari</h2>
                            <div className={styles.subTabs}>
                                {["Uyga vazifa", "Videolar", "Imtihonlar", "Jurnal"].map(tab => (
                                    <button 
                                        key={tab}
                                        className={`${styles.subTab} ${activeSubTab === tab ? styles.activeSubTab : ''}`}
                                        onClick={() => setActiveSubTab(tab)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button className={styles.addLessonBtn} onClick={() => navigate(`/dashboard/groups/${id}/homework/create`)}>Qo'shish</button>
                    </div>

                    <div className={styles.tableCard}>
                        <table className={styles.lessonsTable}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Mavzu</th>
                                    <th><PersonOutlineRoundedIcon fontSize="small" style={{ color: '#94a3b8' }} /></th>
                                    <th><TimerOutlinedIcon fontSize="small" style={{ color: '#eab308' }} /></th>
                                    <th><CheckCircleOutlineRoundedIcon fontSize="small" style={{ color: '#10b981' }} /></th>
                                    <th>Berilgan vaqt</th>
                                    <th>Tugash vaqti</th>
                                    <th>Dars sanasi</th>
                                    <th style={{ width: '40px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {fakeGroupData.lessons.map(lesson => (
                                    <tr key={lesson.id}>
                                        <td>{lesson.id}</td>
                                        <td className={styles.lessonTitle}>{lesson.title}</td>
                                        <td>{lesson.studentsCount}</td>
                                        <td>{lesson.timerCount}</td>
                                        <td>{lesson.checkCount}</td>
                                        <td className={styles.timeCell}>{lesson.givenTime}</td>
                                        <td className={styles.timeCell}>{lesson.endTime}</td>
                                        <td className={styles.timeCell}>{lesson.lessonDate}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <MoreVertRoundedIcon fontSize="small" className={styles.moreIcon} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
