import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import styles from "./LessonDetail.module.scss";
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import Switch from '@mui/material/Switch';

export default function LessonDetail() {
  const { id, date } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Teacher");
  const [topicType, setTopicType] = useState("Boshqa");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");

  const [students, setStudents] = useState([]);
  const [curriculumLessons, setCurriculumLessons] = useState([]);

  useEffect(() => {
    const fetchCurriculumLessons = async () => {
      try {
        const res = await api.get(`/lessons/my/group/${id}`);
        setCurriculumLessons(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching curriculum lessons:", err);
      }
    };
    if (id) {
      fetchCurriculumLessons();
    }
  }, [id]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get(`/groups/${id}/lesson?date=${date}`);
        const mainData = res.data?.data || res.data || {};
        const lessonData = mainData.lesson || null;
        const attendanceData = mainData.attendance || mainData.attendances || [];

        setTopic(lessonData?.topic || mainData.topic || "");
        setDescription(lessonData?.description || mainData.description || "");

        setStudents(
          attendanceData.map(s => ({
            id: s.student_id,
            name: s.full_name || "Noma'lum",
            photo: s.photo,
            present: String(s.isPresent).toLowerCase() === "true" || s.isPresent === 1
          }))
        );
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };

    if (id && date) {
      fetchStudents();
    }
  }, [id, date]);

  const dates = [
    { day: 2, month: "May" },
    { day: 5, month: "May" },
    { day: 7, month: "May" },
    { day: 9, month: "May" },
    { day: 12, month: "May" },
    { day: 14, month: "May" },
    { day: 16, month: "May" },
    { day: 19, month: "May" },
    { day: 21, month: "May" },
    { day: 23, month: "May" },
    { day: 26, month: "May" },
    { day: 28, month: "May" },
    { day: 30, month: "May" },
  ];

  const handleToggleStudent = (studentId) => {
    setStudents(students.map(s => s.id === studentId ? { ...s, present: !s.present } : s));
  };

  const handleSave = async () => {
    if (!topic.trim()) {
      alert("Iltimos, dars mavzusini kiriting.");
      return;
    }

    try {
      const payload = {
        group_id: Number(id),
        topic: topic,
        lesson_date: date,
        description: description,
        attendances: students
          .filter(student => student.present)
          .map(student => ({
            student_id: student.id,
            isPresent: student.present
          }))
      };

      await api.post(`/groups/${id}/lesson`, payload);
      alert("Ma'lumotlar saqlandi!");
    } catch (error) {
      console.error("Saqlashda xatolik yuz berdi:", error);
      alert("Saqlashda xatolik yuz berdi.");
    }
  };

  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className={styles.container}>
      <div className={styles.dateNavigatorContainer}>
        <div className={styles.monthNavRow}>
          <button className={styles.navArrow}><KeyboardArrowLeftRoundedIcon fontSize="small" /></button>
          <span className={styles.monthLabel}>1-o'quv oyi</span>
          <button className={styles.navArrow}><KeyboardArrowRightRoundedIcon fontSize="small" /></button>
        </div>

        <div className={styles.dateChips}>
          {dates.map((d, index) => {
            const formattedDay = String(d.day).padStart(2, '0');
            const dateStr = `2026-05-${formattedDay}`;
            const chipDate = new Date(dateStr);
            chipDate.setHours(0, 0, 0, 0);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const isActive = date === dateStr;
            const isFuture = chipDate > today;

            let chipClass = styles.dateChip;
            if (isActive) {
              chipClass += ` ${styles.active}`;
            } else if (!isFuture) {
              chipClass += ` ${styles.past}`;
            } else {
              chipClass += ` ${styles.future} ${styles.disabled}`;
            }

            return (
              <div
                key={index}
                className={chipClass}
                onClick={() => {
                  if (!isFuture) {
                    navigate(`/dashboard/groups/${id}/lesson/${dateStr}`);
                  }
                }}
              >
                <span className={styles.chipMonth}>{d.month}</span>
                <span className={styles.chipDay}>{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tab} ${activeTab === "Assistant" ? styles.active : ""}`}
          onClick={() => setActiveTab("Assistant")}
        >
          Assistant
        </button>
        <button
          className={`${styles.tab} ${activeTab === "Teacher" ? styles.active : ""}`}
          onClick={() => setActiveTab("Teacher")}
        >
          Teacher
        </button>
      </div>

      <div className={styles.section}>
        <h3>Ma'lumot</h3>
        <div className={styles.infoContent}>
          <div className={styles.mentorProfile}>
            <div className={styles.avatar}>M</div>
            <div className={styles.details}>
              <span className={styles.name}>Mohirbek</span>
              <span className={styles.role}>Teacher</span>
            </div>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Dars kuni</span>
            <span className={styles.value}>{date ? date.replace(/-/g, ' M') : "2026 M05 21"}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Holat</span>
            <span className={styles.status}>Dars o'tilmagan</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Yo'qlama va mavzu kiritish</h3>

        <div className={styles.formGroup}>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="topicType"
                value="O'quv reja bo'yicha"
                checked={topicType === "O'quv reja bo'yicha"}
                onChange={(e) => setTopicType(e.target.value)}
              />
              O'quv reja bo'yicha
            </label>
            <label>
              <input
                type="radio"
                name="topicType"
                value="Boshqa"
                checked={topicType === "Boshqa"}
                onChange={(e) => setTopicType(e.target.value)}
                style={{ accentColor: "#10b981" }}
              />
              <span style={{ color: topicType === "Boshqa" ? "#10b981" : "inherit", fontWeight: topicType === "Boshqa" ? 500 : 400 }}>Boshqa</span>
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.inputLabel}>
            <span className={styles.required}>*</span> Mavzu
          </label>
          {topicType === "O'quv reja bo'yicha" ? (
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", outline: "none", backgroundColor: "white" }}
            >
              <option value="" disabled>Mavzuni tanlang...</option>
              {curriculumLessons.map((lesson) => (
                <option key={lesson.id} value={lesson.topic}>
                  {lesson.topic}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder="Mavzuni kiriting..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.inputLabel}>
            Tavsif (ixtiyoriy)
          </label>
          <textarea
            placeholder="Dars haqida qo'shimcha ma'lumot..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <table className={styles.studentsTable}>
          <thead>
            <tr>
              <th width="5%">#</th>
              <th width="80%">O'quvchi ismi</th>
              <th width="15%" className={styles.attendanceCell}>Keldi</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr key={student.id}>
                <td>{idx + 1}</td>
                <td>
                  <div className={styles.studentNameCell}>
                    <div className={styles.avatar}>{getInitials(student.name)}</div>
                    {student.name}
                  </div>
                </td>
                <td className={styles.attendanceCell}>
                  <Switch
                    checked={student.present}
                    onChange={() => handleToggleStudent(student.id)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#10b981',
                        '&:hover': {
                          backgroundColor: 'rgba(16, 185, 129, 0.08)',
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#10b981',
                      },
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.saveButtonWrapper}>
          <button onClick={handleSave}>Saqlash</button>
        </div>
      </div>
    </div>
  );
}
