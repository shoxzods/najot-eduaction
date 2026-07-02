"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from "react";

import { api } from "../../../api/api";
import { useLessonStore } from "../../../store/lessonStore";
import styles from "./LessonDetail.module.scss";
import Switch from '@mui/material/Switch';
import { toast } from '../../../utils/toast';

export default function LessonDetail({ optimisticDate }: { optimisticDate?: string }) {
  const params = useParams();
  const id = params.id;
  const date = optimisticDate || params.date;

  const { schedules } = useLessonStore();

  const [activeTab, setActiveTab] = useState("Teacher");
  const [topicType, setTopicType] = useState("Boshqa");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [students, setStudents] = useState([]);
  const [curriculumLessons, setCurriculumLessons] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isPast, setIsPast] = useState(false);
  const [isMavzuOpen, setIsMavzuOpen] = useState(false);
  const mavzuRef = useRef(null);

  useEffect(() => {
    if (date) {
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const currentLessonDate = new Date(date as string);
      currentLessonDate.setHours(0, 0, 0, 0);
      setIsPast(currentLessonDate < todayDate);
    }
  }, [date]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mavzuRef.current && !mavzuRef.current.contains(e.target)) {
        setIsMavzuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const lastFetchedDateRef = useRef("");

  useEffect(() => {
    const fetchCurriculumLessons = async () => {
      try {
        const res = await api.get(`/lessons/my/group/${id}`);
        setCurriculumLessons(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching curriculum lessons:", err);
      }
    };
    if (id && topicType === "O'quv reja bo'yicha" && curriculumLessons.length === 0) {
      fetchCurriculumLessons();
    }
  }, [id, topicType, curriculumLessons.length]);

  useEffect(() => {
    if (!id || !date) return;
    if (lastFetchedDateRef.current === date) return;
    lastFetchedDateRef.current = date as string;

    const fetchAll = async () => {
      try {
        const [groupRes, studentsRes] = await Promise.all([
          api.get(`/groups/${id}`).catch(() => ({ data: {} })),
          api.get(`/groups/${id}/lesson?date=${date}`).catch(() => ({ data: {} })),
        ]);

        // Teachers
        const groupData = groupRes.data?.data || groupRes.data || {};
        if (groupData.teachers && Array.isArray(groupData.teachers)) {
          setTeachers(groupData.teachers);
        }

        // Students / attendance
        const mainData = studentsRes.data?.data || studentsRes.data || {};
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
        console.error("Error fetching lesson data:", err);
        lastFetchedDateRef.current = "";
      }
    };

    fetchAll();
  }, [id, date]);

  const handleToggleStudent = (studentId) => {
    setStudents(students.map(s => s.id === studentId ? { ...s, present: !s.present } : s));
  };

  const handleSave = async () => {
    if (!topic.trim()) {
      toast.error("Iltimos, dars mavzusini kiriting.");
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
      toast.success("Ma'lumotlar saqlandi!");
    } catch (error) {
      console.error("Saqlashda xatolik yuz berdi:", error);
      toast.error("Saqlashda xatolik yuz berdi.");
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  const currentDayInfo = (() => {
    if (!date || schedules.length === 0) return null;
    const [y, m, d] = (date as string).split('-');
    const mIndex = parseInt(m, 10) - 1;
    const dayInt = parseInt(d, 10);

    for (const sm of schedules) {
      for (const item of sm.days) {
        const monthMap = {
          "yan": 0, "jan": 0, "fev": 1, "feb": 1, "mar": 2, "apr": 3, "may": 4, "iyun": 5, "jun": 5,
          "iyul": 6, "jul": 6, "avg": 7, "aug": 7, "sen": 8, "sep": 8, "okt": 9, "oct": 9,
          "noy": 10, "nov": 10, "dek": 11, "dec": 11
        };
        let itemMIndex = -1;
        for (const [key, val] of Object.entries(monthMap)) {
          if (item.month && item.month.toLowerCase().startsWith(key)) {
            itemMIndex = val; break;
          }
        }
        if (itemMIndex === mIndex && parseInt(item.day, 10) === dayInt) {
          return item;
        }
      }
    }
    return null;
  })();

  const isCompleted = currentDayInfo?.isCompleted || false;

  return (
    <>
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
          {activeTab === "Teacher" ? (
            teachers.length > 0 ? (
              <div className={styles.mentorProfile}>
                <div className={styles.avatar}>{getInitials(teachers[0].full_name || teachers[0].name)}</div>
                <div className={styles.details}>
                  <span className={styles.name}>{teachers[0].full_name || teachers[0].name}</span>
                  <span className={styles.role}>Teacher</span>
                </div>
              </div>
            ) : (
              <div className={styles.mentorProfile}>
                <div className={styles.details}>
                  <span className={styles.name}>Topilmadi</span>
                  <span className={styles.role}>Teacher</span>
                </div>
              </div>
            )
          ) : (
            teachers.slice(1).length > 0 ? (
              <div className={styles.assistantsList}>
                {teachers.slice(1).map((assistant, idx) => (
                  <div key={assistant.id || idx} className={styles.mentorProfile} style={{ flexShrink: 0 }}>
                    <div className={styles.avatar}>{getInitials(assistant.full_name || assistant.name)}</div>
                    <div className={styles.details}>
                      <span className={styles.name}>{assistant.full_name || assistant.name}</span>
                      <span className={styles.role}>Assistant</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.mentorProfile}>
                <div className={styles.details}>
                  <span className={styles.name}>Topilmadi</span>
                  <span className={styles.role}>Assistant</span>
                </div>
              </div>
            )
          )}

          <div className={styles.infoItem}>
            <span className={styles.label}>Dars kuni</span>
            <span className={styles.value}>{date ? (date as string).replace(/-/g, ' M') : "2026 M05 21"}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Holat</span>
            <span className={styles.status}>{isCompleted ? "Dars tugagan" : "Dars o'tilmagan"}</span>
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
                disabled={isPast}
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
                disabled={isPast}
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
            <div className={styles.selectWrapper} ref={mavzuRef}>
              <button
                type="button"
                className={`${styles.select} ${isMavzuOpen ? styles.selectOpen : ""}`}
                onClick={() => !isPast && setIsMavzuOpen((o) => !o)}
                disabled={isPast}
              >
                <span className={topic ? styles.selectValue : styles.selectPlaceholder}>
                  {topic || "Mavzuni tanlang..."}
                </span>
                <span className={styles.selectIcon}></span>
              </button>

              <div className={`${styles.selectDropdown} ${isMavzuOpen ? styles.selectDropdownOpen : ""}`}>
                {curriculumLessons.length === 0 && (
                  <div className={styles.selectEmpty}>Mavzular topilmadi</div>
                )}
                {curriculumLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`${styles.selectOption} ${lesson.topic === topic ? styles.selectOptionActive : ""}`}
                    onClick={() => { setTopic(lesson.topic); setIsMavzuOpen(false); }}
                  >
                    {lesson.topic}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <input
              type="text"
              placeholder="Mavzuni kiriting..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isPast}
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
            disabled={isPast}
          />
        </div>

        <table className={styles.studentsTable}>
          <thead>
            <tr>
              <th style={{ width: "5%" }}>#</th>
              <th style={{ width: "80%" }}>O'quvchi ismi</th>
              <th style={{ width: "15%" }} className={styles.attendanceCell}>Keldi</th>
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
                    disabled={isPast}
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
          <button
            onClick={handleSave}
            disabled={isPast}
            style={isPast ? { backgroundColor: '#cbd5e1', cursor: 'not-allowed', color: '#64748b' } : {}}
          >
            Saqlash
          </button>
        </div>
      </div>
    </>
  );
}
