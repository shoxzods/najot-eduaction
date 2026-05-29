import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import styles from "./HomeworkResults.module.scss";

const STATUS_MAP = {
  "Kutayotganlar": "PENDING",
  "Qaytarilganlar": "REJECTED",
  "Qabul qilinganlar": "ACCEPTED",
  "Bajarilmagan": "CHECKED",
};

export default function HomeworkResults() {
  const { id, homeworkId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Kutayotganlar");
  const [resultsData, setResultsData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (tab) => {
    setLoading(true);
    try {
      let res;
      if (tab === "Bajarilmagan") {
        // Status jo'natilmaydi
        res = await api.get(`/group/${id}/homework/${homeworkId}/results`);
      } else {
        res = await api.get(`/group/${id}/homework/${homeworkId}/results`, {
          params: { status: STATUS_MAP[tab] }
        });
      }

      const raw = res.data?.data || res.data || {};

      // Agar response massiv bo'lsa (Bajarilmagan uchun)
      if (Array.isArray(raw)) {
        setResultsData(null);
        setStudents(raw);
      } else {
        setResultsData(raw);
        const list = raw.students || raw.results || raw.homeworks || raw.list || [];
        setStudents(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error("Xatolik:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && homeworkId) {
      fetchResults(activeTab);
    }
  }, [id, homeworkId, activeTab]);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date)) return "-";
    const months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const mins = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${months[date.getMonth()]}, ${date.getFullYear()} ${hours}:${mins}`;
  };

  const counts = resultsData?.counts || resultsData?.statusCounts || {};

  const tabs = [
    { id: "Kutayotganlar",     label: "Kutayotganlar",     count: counts.PENDING   ?? resultsData?.pending   ?? 0, colorClass: styles.badgeOrange },
    { id: "Qaytarilganlar",   label: "Qaytarilganlar",    count: counts.REJECTED  ?? resultsData?.rejected  ?? 0, colorClass: styles.badgeRed    },
    { id: "Qabul qilinganlar",label: "Qabul qilinganlar", count: counts.ACCEPTED  ?? resultsData?.accepted  ?? 0, colorClass: styles.badgeGreen  },
    { id: "Bajarilmagan",     label: "Bajarilmagan",      count: counts.CHECKED   ?? resultsData?.checked   ?? 0, colorClass: styles.badgeGreen  },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          &#8249;
        </button>
        <h1>{resultsData?.topic || resultsData?.homework?.topic || "Uyga vazifa"}</h1>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.infoGroup}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Mavzu</span>
            <span className={styles.value}>
              {resultsData?.topic || resultsData?.homework?.topic || "-"}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Tugash vaqti</span>
            <span className={styles.value}>
              {formatDateTime(resultsData?.deadline || resultsData?.homework?.deadline || resultsData?.end_date)}
            </span>
          </div>
        </div>
        <div className={styles.largeNumber}>
          {resultsData?.total ?? resultsData?.homework?.total ?? ""}
        </div>
      </div>

      <div className={styles.tabsContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className={`${styles.badge} ${tab.colorClass}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      <div className={styles.tableSection}>
        <table>
          <thead>
            <tr>
              <th>O'quvchi ismi</th>
              <th style={{ textAlign: "right" }}>Uyga vazifa jo'natilgan vaqt</th>
            </tr>
          </thead>
          <tbody>
            {!loading && students.map((student, idx) => (
              <tr key={student.id || idx}>
                <td>{student.full_name || student.name || student.student?.full_name || "-"}</td>
                <td style={{ textAlign: "right" }}>
                  {formatDateTime(student.submitted_at || student.created_at || student.sent_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className={styles.emptyState}>Yuklanmoqda...</div>}
        {!loading && students.length === 0 && (
          <div className={styles.emptyState}>Ma'lumot mavjud emas</div>
        )}
      </div>
    </div>
  );
}
