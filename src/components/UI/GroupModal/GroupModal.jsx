import React, { useEffect, useState } from "react";
import styles from "./GroupModal.module.scss";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { createPortal } from "react-dom";
import AddStudentModal from "./AddStudentModal/AddStudentModal";
import AddTeacherModal from "./AddTeacherModal/AddTeacherModal";
import { api } from "../../../api/api";

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
    const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
    
    const [courses, setCourses] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [groupData, setGroupData] = useState({
        name: "",
        description: "",
        courseId: "",
        roomId: "",
        startDate: "",
        startTime: "09:00",
        maxStudent: 15,
        weekDays: [],
        teachers: [],
        students: []
    });

    const toggleAddStudentModal = () => setIsAddStudentModalOpen(!isAddStudentModalOpen);
    const toggleAddTeacherModal = () => setIsAddTeacherModalOpen(!isAddTeacherModalOpen);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGroupData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDayCheckboxChange = (dayId) => {
        setGroupData(prev => {
            const exists = prev.weekDays.includes(dayId);
            return {
                ...prev,
                weekDays: exists 
                    ? prev.weekDays.filter(d => d !== dayId) 
                    : [...prev.weekDays, dayId]
            };
        });
    };

    const resetForm = () => {
        setGroupData({
            name: "",
            description: "",
            courseId: "",
            roomId: "",
            startDate: "",
            startTime: "09:00",
            maxStudent: 15,
            weekDays: [],
            teachers: [],
            students: []
        });
    };

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            document.body.style.overflow = 'hidden';
            
            // Fetch courses dynamically for the Kurs dropdown select
            api.get('/courses', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            }).then(res => {
                const coursesList = res.data?.data || res.data || [];
                setCourses(coursesList);
            }).catch(err => {
                console.error("Error fetching courses for select:", err);
            });

            // Fetch rooms dynamically for the Xona dropdown select
            api.get('/rooms', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            }).then(res => {
                const roomsList = res.data?.data || res.data || [];
                setRooms(roomsList);
            }).catch(err => {
                console.error("Error fetching rooms for select:", err);
            });
        } else {
            const timer = setTimeout(() => {
                setShouldRender(false);
                document.body.style.overflow = 'unset';
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        const { name, description, courseId, roomId, startDate, startTime, maxStudent, weekDays, teachers, students } = groupData;

        if (!name || !courseId || !roomId || !startDate || !startTime || !maxStudent || weekDays.length === 0) {
            alert("Iltimos, barcha majburiy maydonlarni to'ldiring!");
            return;
        }

        // Map week days to standard MONDAY, TUESDAY format
        const dayMap = {
            'mon': 'MONDAY',
            'tue': 'TUESDAY',
            'wed': 'WEDNESDAY',
            'thu': 'THURSDAY',
            'fri': 'FRIDAY',
            'sat': 'SATURDAY',
            'sun': 'SUNDAY'
        };
        const weekDaysMapped = weekDays.map(day => dayMap[day]);

        let formattedDate = startDate;
        // Parse and convert dd/mm/yyyy or dd.mm.yyyy to YYYY-MM-DD ISO format automatically
        const ddmmyyyyRegex = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/;
        const match = startDate.match(ddmmyyyyRegex);
        if (match) {
            const day = match[1].padStart(2, '0');
            const month = match[2].padStart(2, '0');
            const year = match[3];
            formattedDate = `${year}-${month}-${day}`;
        }

        const payload = {
            name,
            description,
            course_id: Number(courseId),
            room_id: Number(roomId),
            start_date: formattedDate,
            start_time: startTime,
            max_student: Number(maxStudent),
            week_day: weekDaysMapped,
            teachers: teachers.map(Number),
            students: students.map(Number)
        };

        api.post('/groups', payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).then(
            res => {
                console.log("Group created successfully:", res.status);
                if (onSave) {
                    onSave();
                }
                resetForm();
                onClose();
            }
        ).catch(
            err => {
                const responseData = err.response?.data;
                console.error("Error creating group:", responseData);
                
                // Extract detailed error messages
                let errorMsg = err.message;
                if (responseData) {
                    if (responseData.errors && typeof responseData.errors === 'object') {
                        const messages = [];
                        for (const key in responseData.errors) {
                            if (Array.isArray(responseData.errors[key])) {
                                messages.push(`${key}: ${responseData.errors[key].join(", ")}`);
                            } else {
                                messages.push(`${key}: ${responseData.errors[key]}`);
                            }
                        }
                        errorMsg = messages.join(" | ");
                    } else if (Array.isArray(responseData.message)) {
                        errorMsg = responseData.message.join(", ");
                    } else if (responseData.message) {
                        errorMsg = responseData.message;
                    } else if (responseData.error) {
                        errorMsg = responseData.error;
                    } else {
                        errorMsg = JSON.stringify(responseData);
                    }
                }
                alert("Xatolik yuz berdi: " + errorMsg);
            }
        );
    };

    if (!shouldRender) return null;

    return createPortal(
        <div
            className={`${styles.overlay} ${!isOpen ? styles.fadeOut : ""}`}
            onClick={onClose}
        >
            <form
                className={`${styles.modal} ${!isOpen ? styles.slideOut : ""}`}
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <div className={styles.header}>
                    <div className={styles.headerTop}>
                        <h2 className={styles.title}>Guruh qo'shish</h2>
                        <button type="button" className={styles.closeBtn} onClick={onClose}>
                            <CloseRoundedIcon />
                        </button>
                    </div>
                    <p className={styles.subtitle}>Yangi guruh yaratish uchun quyidagi ma'lumotlarni kiriting.</p>
                </div>

                <div className={styles.body}>
                    <div className={styles.formGroup}>
                        <label>Guruh nomi <span>*</span></label>
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Frontend 2024" 
                            value={groupData.name} 
                            onChange={handleInputChange} 
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Kurs <span>*</span></label>
                        <select name="courseId" value={groupData.courseId} onChange={handleInputChange}>
                            <option value="" disabled>Tanlang</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Xona <span>*</span></label>
                        <select name="roomId" value={groupData.roomId} onChange={handleInputChange}>
                            <option value="" disabled>Tanlang</option>
                            {rooms.map(room => (
                                <option key={room.id} value={room.id}>
                                    {room.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Dars kunlari <span>*</span></label>
                        <div className={styles.daysGrid}>
                            {DAYS.map(day => (
                                <label key={day.id} className={styles.dayItem}>
                                    <input 
                                        type="checkbox" 
                                        checked={groupData.weekDays.includes(day.id)}
                                        onChange={() => handleDayCheckboxChange(day.id)}
                                    />
                                    <span>{day.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Dars vaqti <span>*</span></label>
                        <input 
                            type="time" 
                            name="startTime" 
                            value={groupData.startTime} 
                            onChange={handleInputChange} 
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Maksimal talabalar soni <span>*</span></label>
                        <input 
                            type="number" 
                            name="maxStudent" 
                            placeholder="15" 
                            value={groupData.maxStudent} 
                            onChange={handleInputChange} 
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Boshlanish sanasi <span>*</span></label>
                        <div className={styles.dateInputWrapper}>
                            <input 
                                type="text" 
                                name="startDate"
                                placeholder="dd/mm/yyyy" 
                                value={groupData.startDate}
                                onChange={handleInputChange}
                                onFocus={(e) => e.target.type = 'date'}
                                onBlur={(e) => {
                                    if (!e.target.value) e.target.type = 'text';
                                }}
                            />
                            <CalendarTodayRoundedIcon className={styles.calendarIcon} />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Tavsif</label>
                        <textarea 
                            name="description" 
                            placeholder="Guruh haqida qo'shimcha ma'lumot (ixtiyoriy)"
                            value={groupData.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            O'qituvchilar 
                            {groupData.teachers.length > 0 && (
                                <span className={styles.countBadge}> ({groupData.teachers.length} ta tanlandi)</span>
                            )}
                        </label>
                        <button type="button" className={styles.addOptionBtn} onClick={toggleAddTeacherModal}>
                            <AddRoundedIcon fontSize="small" />
                            <span>Qo'shish</span>
                        </button>
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            Talabalar 
                            {groupData.students.length > 0 && (
                                <span className={styles.countBadge}> ({groupData.students.length} ta tanlandi)</span>
                            )}
                        </label>
                        <button type="button" className={styles.addOptionBtn} onClick={toggleAddStudentModal}>
                            <AddRoundedIcon fontSize="small" />
                            <span>Qo'shish</span>
                        </button>
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.footerButtons}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Bekor qilish</button>
                        <button type="submit" className={styles.saveBtn}>Saqlash</button>
                    </div>
                    <div className={styles.logoWrapper}>
                        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50 20L80 35V65L50 80L20 65V35L50 20Z" stroke="#6c35de" strokeOpacity="0.1" strokeWidth="1" />
                            <path d="M50 30L70 40V60L50 70L30 60V40L50 30Z" stroke="#6c35de" strokeOpacity="0.1" strokeWidth="1" />
                        </svg>
                    </div>
                </div>

                <AddTeacherModal 
                    isOpen={isAddTeacherModalOpen} 
                    onClose={toggleAddTeacherModal} 
                    onAdd={(selected) => {
                        setGroupData(prev => ({
                            ...prev,
                            teachers: selected
                        }));
                        toggleAddTeacherModal();
                    }}
                />

                <AddStudentModal 
                    isOpen={isAddStudentModalOpen} 
                    onClose={toggleAddStudentModal} 
                    onAdd={(selected) => {
                        setGroupData(prev => ({
                            ...prev,
                            students: selected
                        }));
                        toggleAddStudentModal();
                    }}
                />
            </form>
        </div>,
        document.body
    );
}
