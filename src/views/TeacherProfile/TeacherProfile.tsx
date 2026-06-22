"use client";
import { useEffect, useState } from "react";
import styles from "./TeacherProfile.module.scss";
import { fetchMyProfile, getFileUrl } from "../../api/api";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface TeacherData {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  photo: string | null;
  created_at: string;
  groups: string[];
}

function formatDate(dateString: string): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export default function TeacherProfile() {
  const [teacher, setTeacher] = useState<TeacherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchMyProfile()
      .then(data => setTeacher(data))
      .catch(err => console.error("Failed to load teacher profile:", err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
        <CircularProgress sx={{ color: "#22c55e" }} />
      </Box>
    );
  }

  const initials = teacher?.full_name
    ? teacher.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "T";

  const photoUrl = teacher?.photo ? getFileUrl(teacher.photo) : null;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Profil</h1>

      <div className={styles.layout}>
        {/* ── LEFT: Avatar card ── */}
        <div className={styles.avatarCard}>
          <div className={styles.avatarBg} />
          <div className={styles.avatarRing}>
            {photoUrl ? (
              <img src={photoUrl} alt={teacher?.full_name} className={styles.avatarImg} />
            ) : (
              <div className={styles.avatarInitials}>{initials}</div>
            )}
          </div>
          <h2 className={styles.teacherName}>{teacher?.full_name || "—"}</h2>
          <p className={styles.teacherRole}>O&apos;qituvchi</p>
        </div>

        {/* ── RIGHT: Info card ── */}
        <div className={styles.infoCard}>
          {/* Personal info section */}
          <p className={styles.sectionTitle}>Shaxsiy ma&apos;lumotlar</p>

          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <div className={styles.iconWrap}>
                <EmailRoundedIcon className={styles.icon} />
              </div>
              <div className={styles.infoText}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{teacher?.email || "—"}</span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconWrap}>
                <LocalPhoneRoundedIcon className={styles.icon} />
              </div>
              <div className={styles.infoText}>
                <span className={styles.infoLabel}>Telefon raqam</span>
                <span className={styles.infoValue}>{teacher?.phone || "—"}</span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconWrap}>
                <LocationOnRoundedIcon className={styles.icon} />
              </div>
              <div className={styles.infoText}>
                <span className={styles.infoLabel}>Manzil</span>
                <span className={styles.infoValue}>{teacher?.address || "—"}</span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconWrap}>
                <CalendarMonthRoundedIcon className={styles.icon} />
              </div>
              <div className={styles.infoText}>
                <span className={styles.infoLabel}>Ro&apos;yxatdan o&apos;tgan sana</span>
                <span className={styles.infoValue}>{formatDate(teacher?.created_at || "")}</span>
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Groups section */}
          <p className={styles.sectionTitle}>Guruhlar</p>

          <div className={styles.groupsRow}>
            {teacher?.groups && teacher.groups.length > 0 ? (
              teacher.groups.map((group, index) => (
                <span key={index} className={styles.groupChip}>
                  <GroupsRoundedIcon style={{ fontSize: 16 }} />
                  {group}
                </span>
              ))
            ) : (
              <span className={styles.emptyText}>Guruh biriktirilmagan</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
