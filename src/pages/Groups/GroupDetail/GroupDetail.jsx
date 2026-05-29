import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../../api/api";
import styles from "./GroupDetail.module.scss";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

export default function GroupDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentMonth, setCurrentMonth] = useState(0);
    const [showAllMonths, setShowAllMonths] = useState(false);
    const [OverallLessons] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [groupDetails, setGroupDetails] = useState(null);
    const [homeworkData, setHomeworkData] = useState([]);
    const [videosData, setVideosData] = useState([]);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [selectedVideoFile, setSelectedVideoFile] = useState(null);
    const [videoFileName, setVideoFileName] = useState("");
    const [selectedLessonId, setSelectedLessonId] = useState("");
    const [isUploadingVideo, setIsUploadingVideo] = useState(false);
    const [selectedPlayVideo, setSelectedPlayVideo] = useState(null);
    const [groupLessons, setGroupLessons] = useState([]);
    const [groupStudents, setGroupStudents] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedVideoFile(file);
            setVideoFileName(file.name);
        }
    };

    const handleModalClose = () => {
        setIsVideoModalOpen(false);
        setSelectedVideoFile(null);
        setVideoFileName("");
        setSelectedLessonId("");
    };

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const res = await api.get(`/groups/${id}/schedules`);
                console.log(res)
                const data = res.data;
                // data is an array of objects, each object can have keys "1", "2", "3"... 
                // representing study months
                const formattedSchedules = [];
                data.forEach((item) => {
                    const keys = Object.keys(item).sort((a, b) => Number(a) - Number(b));
                    keys.forEach((key) => {
                        const value = item[key];
                        formattedSchedules.push({
                            id: key,
                            label: `${key}-o'quv oyi`,
                            isCurrent: value.isActive,
                            days: value.days.map((d, dIdx) => ({
                                id: `${key}-${dIdx}`,
                                day: d.day,
                                month: d.month,
                                isCompleted: d.isCompleted
                            }))
                        });
                    });
                });
                setSchedules(formattedSchedules);
            } catch (err) {
                console.error("Error fetching schedules:", err);
            }
        };
        if (id) {
            fetchSchedules();
        }
    }, [id]);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const [resOne, resBasic] = await Promise.all([
                    api.get(`/groups/one/${id}`).catch(() => ({ data: {} })),
                    api.get(`/groups/${id}`).catch(() => ({ data: {} }))
                ]);
                
                const dataOne = resOne.data?.data || resOne.data || {};
                const dataBasic = resBasic.data?.data || resBasic.data || {};
                
                // Merge data so that we have both Dars jadvali info (from /one) and Guruh parametrlari info (from basic endpoint)
                setGroupDetails({ ...dataOne, ...dataBasic });
            } catch (err) {
                console.error("Error fetching group details:", err);
            }
        };
        if (id) {
            fetchGroupDetails();
        }
    }, [id]);

    useEffect(() => {
        const fetchHomework = async () => {
            try {
                const res = await api.get(`/homework/${id}`);
                // if it returns an object that has data, or just array
                const data = res.data.data || res.data || [];
                setHomeworkData(Array.isArray(data) ? data : [data]);
            } catch (err) {
                console.error("Error fetching homework:", err);
            }
        };
        if (id) {
            fetchHomework();
        }
    }, [id]);

    const fetchVideos = async () => {
        try {
            const res = await api.get(`/files/${id}`);
            const data = res.data.data || res.data || [];
            setVideosData(Array.isArray(data) ? data : [data]);
        } catch (err) {
            console.error("Error fetching videos:", err);
        }
    };

    useEffect(() => {
        if (id) {
            fetchVideos();
        }
    }, [id]);

    useEffect(() => {
        const fetchGroupLessons = async () => {
            try {
                const res = await api.get(`/lessons/my/group/${id}`);
                const data = res.data.data || res.data || [];
                setGroupLessons(Array.isArray(data) ? data : [data]);
            } catch (err) {
                console.error("Error fetching group lessons:", err);
            }
        };
        if (id) {
            fetchGroupLessons();
        }
    }, [id]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await api.get(`/groups/one/students/${id}`);
                const data = res.data?.data || res.data || [];
                setGroupStudents(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching group students:", err);
            }
        };
        if (id) {
            fetchStudents();
        }
    }, [id]);

    const tabIndex = searchParams.get("tab") || "0";
    let activeTab = "Ma'lumotlar";
    if (tabIndex === "1") activeTab = "Guruh darsliklari";
    if (tabIndex === "2") activeTab = "Akademik davomati";

    const [activeSubTab, setActiveSubTab] = useState("Uyga vazifa");
    const [showAllSchedules, setShowAllSchedules] = useState(false);

    const handleTabChange = (index) => {
        setSearchParams({ tab: index });
    };

    const dayTranslations = {
        MONDAY: "Du",
        TUESDAY: "Se",
        WEDNESDAY: "Ch",
        THURSDAY: "Pa",
        FRIDAY: "Ju",
        SATURDAY: "Sha",
        SUNDAY: "Yak"
    };
    const translateDays = (days) => {
        if (!days || !Array.isArray(days)) return "";
        return days.map(d => dayTranslations[d] || d).join("/");
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        const months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];
        const day = String(date.getDate()).padStart(2, '0');
        return `${day} ${months[date.getMonth()]}, ${date.getFullYear()}`;
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "-";
        const datePart = formatDate(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${datePart} ${hours}:${minutes}`;
    };

    const addDays = (dateString, days) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "-";
        date.setDate(date.getDate() + days);
        return date.toISOString();
    };

    const calculateEndTime = (timeStr, hoursToAdd = 2) => {
        if (!timeStr) return "";
        const parts = timeStr.split(":");
        const hours = parseInt(parts[0], 10) || 0;
        const minutes = parseInt(parts[1], 10) || 0;
        const date = new Date();
        date.setHours(hours + hoursToAdd, minutes);
        if (isNaN(date.getTime())) return "";
        const endHours = String(date.getHours()).padStart(2, '0');
        const endMinutes = String(date.getMinutes()).padStart(2, '0');
        return `${endHours}:${endMinutes}`;
    };

    const calculateEndDate = (dateStr, monthsToAdd) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";
        const parsedMonths = parseInt(monthsToAdd, 10) || 0;
        date.setMonth(date.getMonth() + parsedMonths);
        return date.toISOString(); // Format back to ISO so formatDate can parse it
    };

    const formatFileSize = (size) => {
        if (!size) return "-";
        if (typeof size === 'string' && size.includes("MB")) return size;
        const bytes = Number(size);
        if (isNaN(bytes)) return size;
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleVideoUpload = async () => {
        if (!selectedVideoFile || !selectedLessonId) {
            alert("Iltimos, darsni tanlang!");
            return;
        }

        setIsUploadingVideo(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedVideoFile);

            await api.post(
                `/files/group/${id}/upload?lessonId=${selectedLessonId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            await fetchVideos();
            handleModalClose();
        } catch (err) {
            console.error("Error uploading video:", err);
            alert("Video yuklashda xatolik yuz berdi");
        } finally {
            setIsUploadingVideo(false);
        }
    };

    // Fake data for tabs that don't have API yet
    const fakeGroupData = {
        lessons: [
            { id: 1, number: 1, title: "Html asoslari", isPill: true, count1: 5, count2: 1, count3: 0, startDate: "13 May, 2026 10:00", endDate: "14 May, 2026 06:00", lessonDate: "12 May, 2026" },
            { id: 2, number: 2, title: "Kirish", isPill: false, count1: 5, count2: 0, count3: 0, startDate: "13 May, 2026 11:52", endDate: "14 May, 2026 07:52", lessonDate: "9 May, 2026" },
            { id: 3, number: 3, title: "Nodejs", isPill: false, count1: 5, count2: 0, count3: 3, startDate: "14 May, 2026 09:47", endDate: "15 May, 2026 05:47", lessonDate: "14 May, 2026" }
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
        ]
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    <button className={styles.backBtn} onClick={() => navigate("/dashboard/groups")}>
                        <ArrowBackIosNewRoundedIcon fontSize="small" />
                    </button>
                    <h1>{groupDetails?.name || ""}</h1>
                    <span className={styles.statusTag}>{groupDetails?.status || "Aktiv"}</span>
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
                                {groupDetails?.teachers?.map((mentor, index) => (
                                    <div key={index} className={styles.mentorInfo}>
                                        <img
                                            src={mentor.photo || `https://ui-avatars.com/api/?name=${mentor.full_name || mentor.name || 'MO'}&background=f8fafc&color=3b82f6&size=128`}
                                            alt={mentor.full_name || mentor.name}
                                            className={styles.mentorAvatar}
                                        />
                                        <span className={styles.mentorRole}>Teacher</span>
                                        <span className={styles.mentorName}>{mentor.full_name || mentor.name}</span>
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
                                    <strong>{groupDetails?.course?.name || ""}</strong>
                                </div>
                                <div className={styles.paramRow}>
                                    <span>O'rtacha yosh</span>
                                    <strong>{groupDetails?.averageAge ?? "0"} yosh</strong>
                                </div>
                                <div className={styles.paramRow}>
                                    <span>Sig'imi</span>
                                    <strong>{groupDetails?.room_capacity ?? "0"} ta</strong>
                                </div>
                                <div className={styles.paramRow}>
                                    <span>Hozirgi o'quvchilar</span>
                                    <strong>{groupDetails?.student_count ?? "0"} ta</strong>
                                </div>
                                <div className={styles.paramRow}>
                                    <span>Darslar soni (1 oyda)</span>
                                    <strong>{schedules.length > 0 ? Math.round(schedules.reduce((sum, m) => sum + m.days.length, 0) / schedules.length) : "0"} ta</strong>
                                </div>
                                <div className={styles.paramRow}>
                                    <span>Kurs davomiyligi</span>
                                    <strong>{groupDetails?.course?.duration_month ?? "0"} oy</strong>
                                </div>
                                <div className={styles.paramRow}>
                                    <span>Darslar soni (Jami)</span>
                                    <strong>{schedules.reduce((sum, m) => sum + m.days.length, 0)} ta</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.scheduleSection}>
                        <h2>Dars jadvali</h2>
                        <div className={styles.scheduleList}>
                            {(() => {
                                const teachersList = groupDetails?.teachers?.length > 0 ? groupDetails.teachers : (groupDetails ? [{ id: 'unknown', full_name: "Noma'lum" }] : []);
                                const displayedTeachers = showAllSchedules ? teachersList : teachersList.slice(0, 2);

                                return displayedTeachers.map((teacher, index) => {
                                    const item = {
                                        id: `${groupDetails?.id || 'g'}-${teacher.id || index}`,
                                        teacher: teacher.full_name || teacher.name || "Noma'lum",
                                        days: translateDays(groupDetails?.week_day),
                                        time: groupDetails?.start_time ? `${groupDetails.start_time} dan - ${calculateEndTime(groupDetails.start_time, 2)} gacha` : "",
                                        period: groupDetails?.start_date ? `${formatDate(groupDetails.start_date)} - ${formatDate(calculateEndDate(groupDetails.start_date, groupDetails.course?.duration_month))}` : "",
                                        room: groupDetails?.room || "Noma'lum"
                                    };
                                    return (
                                        <div key={item.id} className={styles.scheduleItem}>
                                            <span className={styles.teacherName}>{item.teacher}</span>
                                            <div className={styles.scheduleDetails}>
                                                <span>{item.days}</span>
                                                <span>{item.time}</span>
                                                <span>{item.period}</span>
                                                <span>{item.room}</span>
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>

                        {groupDetails?.teachers?.length > 2 && (
                            <div className={styles.showMoreBtnWrapper}>
                                <button
                                    className={styles.showMoreBtn}
                                    onClick={() => setShowAllSchedules(!showAllSchedules)}
                                >
                                    {showAllSchedules ? "Yashirish" : `Yana ko'rsatish (${groupDetails.teachers.length - 2})`}
                                </button>
                            </div>
                        )}

                        {/* Month navigation */}
                        <div className={styles.monthNav}>
                            <button
                                className={styles.monthNavBtn}
                                onClick={() => setCurrentMonth(Math.max(0, currentMonth - 1))}
                                disabled={currentMonth === 0}
                            >
                                <KeyboardArrowLeftRoundedIcon fontSize="small" />
                            </button>
                            <span className={styles.monthNavLabel}>
                                {schedules[currentMonth]?.label || ""}
                            </span>
                            <button
                                className={styles.monthNavBtn}
                                onClick={() => setCurrentMonth(Math.min(schedules.length - 1, currentMonth + 1))}
                                disabled={currentMonth >= schedules.length - 1 || schedules.length === 0}
                            >
                                <KeyboardArrowRightRoundedIcon fontSize="small" />
                            </button>
                        </div>

                        {/* Study months and calendar */}
                        {(showAllMonths ? schedules : schedules.slice(currentMonth, currentMonth + 1)).map((studyMonth, idx) => (
                            <div key={idx} className={styles.studyMonthBlock}>
                                <div className={styles.studyMonthHeader}>
                                    <span className={styles.studyMonthLabel}>{studyMonth.label}</span>
                                    {studyMonth.isCurrent && (
                                        <span className={styles.currentMonthBadge}>Joriy oy</span>
                                    )}
                                </div>
                                <div className={styles.calendarDaysRow}>
                                    {studyMonth.days.map(item => (
                                        <div 
                                            key={item.id} 
                                            className={styles.calendarChip}
                                            onClick={() => navigate(`/dashboard/groups/${id}/lesson/2026-05-${String(item.day).padStart(2, '0')}`)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <span className={styles.chipMonth}>{item.month}</span>
                                            <span className={styles.chipDay}>{item.day}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {schedules.length > 1 && (
                            <div className={styles.showAllBtnWrapper}>
                                <button
                                    className={styles.showAllBtn}
                                    onClick={() => setShowAllMonths(!showAllMonths)}
                                >
                                    {showAllMonths ? 'Yopish' : 'Barchasini ko\'rish'}
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {activeTab === "Guruh darsliklari" && (
                <div className={styles.lessonsSection}>
                    <div className={styles.lessonsHeader}>
                        <div className={styles.lessonsTabsAndTitle}>
                            <h2>Guruh darsliklari</h2>
                            <div className={styles.subTabs}>
                                <button
                                    className={`${styles.subTab} ${activeSubTab === "Uyga vazifa" ? styles.activeSubTab : ""}`}
                                    onClick={() => setActiveSubTab("Uyga vazifa")}
                                >
                                    Uyga vazifa
                                </button>
                                <button
                                    className={`${styles.subTab} ${activeSubTab === "Videolar" ? styles.activeSubTab : ""}`}
                                    onClick={() => setActiveSubTab("Videolar")}
                                >
                                    Videolar
                                </button>
                                <button
                                    className={`${styles.subTab} ${activeSubTab === "Imtihonlar" ? styles.activeSubTab : ""}`}
                                    onClick={() => setActiveSubTab("Imtihonlar")}
                                >
                                    Imtihonlar
                                </button>
                                <button
                                    className={`${styles.subTab} ${activeSubTab === "Jurnal" ? styles.activeSubTab : ""}`}
                                    onClick={() => setActiveSubTab("Jurnal")}
                                >
                                    Jurnal
                                </button>
                            </div>
                        </div>

                        <button
                            className={styles.addLessonBtn}
                            onClick={() => {
                                if (activeSubTab === "Videolar") {
                                    setIsVideoModalOpen(true);
                                } else {
                                    navigate(`/dashboard/groups/${id}/homework/create`);
                                }
                            }}
                        >
                            Qo'shish
                        </button>
                    </div>

                    <div className={styles.tableCard}>
                        {activeSubTab === "Uyga vazifa" && (
                            <table className={styles.lessonsTable}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Mavzu</th>
                                        <th><PersonOutlineRoundedIcon fontSize="small" style={{ color: '#94a3b8' }} /></th>
                                        <th><TimerOutlinedIcon fontSize="small" style={{ color: '#f59e0b' }} /></th>
                                        <th><CheckCircleOutlineRoundedIcon fontSize="small" style={{ color: '#22c55e' }} /></th>
                                        <th>Berilgan vaqt</th>
                                        <th>Tugash vaqti</th>
                                        <th>Dars sanasi</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {homeworkData.map((lesson, idx) => (
                                        <tr 
                                            key={`${lesson.id}-${idx}`}
                                            onClick={() => navigate(`/dashboard/groups/${id}/homework/${lesson.id}/results`)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <td>{idx + 1}</td>
                                            <td>
                                                {lesson.homeworkPending > 0 ? (
                                                    <div className={styles.pillOrange}>
                                                        {lesson.topic}
                                                    </div>
                                                ) : (
                                                    <div className={styles.lessonTitleText}>
                                                        {lesson.topic}
                                                    </div>
                                                )}
                                            </td>
                                            <td>{lesson.existStudentsIngroup || 0}</td>
                                            <td>{lesson.homeworkPending || 0}</td>
                                            <td>{lesson.homeworkAccept || 0}</td>
                                            <td className={styles.timeCell}>{formatDateTime(lesson.created_at)}</td>
                                            <td className={styles.timeCell}>{formatDateTime(addDays(lesson.created_at, 2))}</td>
                                            <td className={styles.timeCell}>{formatDate(lesson.created_at)}</td>
                                            <td><MoreVertRoundedIcon className={styles.moreIcon} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeSubTab === "Videolar" && (
                            <table className={styles.lessonsTable}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Video nomi</th>
                                        <th>Dars nomi</th>
                                        <th>Status</th>
                                        <th>Dars sanasi</th>
                                        <th>Hajmi</th>
                                        <th>Qo'shilgan vaqti</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {videosData.length > 0 ? videosData.map((video, idx) => (
                                        <tr key={video.id || idx}>
                                            <td>{idx + 1}</td>
                                            <td>
                                                <div
                                                    className={styles.videoNameCell}
                                                    onClick={() => setSelectedPlayVideo(video)}
                                                >
                                                    <PlayCircleOutlineRoundedIcon className={styles.playIcon} fontSize="small" />
                                                    {video.originalname || video.title || video.videoName || video.name || "Video"}
                                                </div>
                                            </td>
                                            <td className={styles.lessonNameCell}>{video.lesson?.topic || video.lessonName || "-"}</td>
                                            <td>
                                                <div className={styles.statusPill}>{video.status || "Tayyor"}</div>
                                            </td>
                                            <td className={styles.timeCell}>{video.lesson?.created_at ? formatDate(video.lesson.created_at) : video.lessonDate || "-"}</td>
                                            <td className={styles.timeCell}>{video.size_mb ? parseFloat(video.size_mb).toFixed(2) + ' MB' : formatFileSize(video.size || video.file_size)}</td>
                                            <td className={styles.timeCell}>{formatDate(video.created_at || video.addedTime)}</td>
                                            <td><MoreVertRoundedIcon className={styles.moreIcon} /></td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>Videolar topilmadi</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
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
                            <div 
                                key={item.id} 
                                className={`${styles.calendarDay} ${item.active ? styles.activeDay : ""}`}
                                onClick={() => navigate(`/dashboard/groups/${id}/lesson/2026-05-${String(item.day).padStart(2, '0')}`)}
                                style={{ cursor: "pointer" }}
                            >
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

            {/* Video Modal */}
            {isVideoModalOpen && (
                <div className={styles.modalOverlay} onClick={handleModalClose}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Qo'shish</h2>
                            <button className={styles.closeBtn} onClick={handleModalClose}>
                                <CloseRoundedIcon fontSize="small" />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.uploadBox} onClick={() => fileInputRef.current?.click()}>
                                <CloudUploadOutlinedIcon className={styles.uploadIcon} />
                                <p className={styles.uploadTitle}>
                                    Videofaylni yuklash uchun ushbu hudud ustiga bosing yoki faylni shu yerga olib keling
                                </p>
                                <p className={styles.uploadDesc}>
                                    Videofayl: .mp4, .webm, .mpeg, .avi, .mkv, .m4v, .ogm, .mov formatlaridan birida bo'lishi kerak
                                </p>
                            </div>

                            {selectedVideoFile && (
                                <div className={styles.selectedVideoContainer}>
                                    <table className={styles.selectedVideoTable}>
                                        <thead>
                                            <tr>
                                                <th>File name</th>
                                                <th><span>*</span> Dars</th>
                                                <th><span>*</span> Video nomi</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className={styles.fileNameCol}>{selectedVideoFile.name}</td>
                                                <td>
                                                    <select 
                                                        className={styles.darsSelect} 
                                                        value={selectedLessonId}
                                                        onChange={(e) => setSelectedLessonId(e.target.value)}
                                                    >
                                                        <option value="" disabled>Darsni tanlang</option>
                                                        {groupLessons.map((lesson) => (
                                                            <option key={lesson.id} value={lesson.id}>{lesson.topic || lesson.title || lesson.name}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className={styles.videoNameInput}
                                                        value={videoFileName}
                                                        onChange={(e) => setVideoFileName(e.target.value)}
                                                    />
                                                </td>
                                                <td className={styles.actionsCol}>
                                                    <button className={styles.deleteIconBtn} onClick={() => setSelectedVideoFile(null)}>
                                                        <DeleteOutlineRoundedIcon fontSize="small" />
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept=".mp4,.webm,.mpeg,.avi,.mkv,.m4v,.ogm,.mov"
                                onChange={handleFileSelect}
                            />
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.cancelBtn} onClick={handleModalClose} disabled={isUploadingVideo}>
                                Bekor qilish
                            </button>
                            {selectedVideoFile && (
                                <button 
                                    className={styles.uploadSubmitBtn} 
                                    onClick={handleVideoUpload}
                                    disabled={isUploadingVideo}
                                >
                                    {isUploadingVideo ? "Yuklanmoqda..." : "Fayllarni yuklash"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Video Player Modal */}
            {selectedPlayVideo && (
                <div className={styles.modalOverlay} onClick={() => setSelectedPlayVideo(null)}>
                    <div className={styles.videoPlayerModalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.videoPlayerHeader}>
                            <h2>{selectedPlayVideo.originalname || selectedPlayVideo.title || "Video"}</h2>
                            <button className={styles.closeBtn} onClick={() => setSelectedPlayVideo(null)}>
                                <CloseRoundedIcon fontSize="small" />
                            </button>
                        </div>
                        <div className={styles.videoPlayerContainer}>
                            <video
                                controls
                                autoPlay
                                src={`https://najot-edu.softwareengineer.uz/${selectedPlayVideo.video_url}`}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
