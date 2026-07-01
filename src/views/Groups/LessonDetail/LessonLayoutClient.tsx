"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import { useLessonStore } from "../../../store/lessonStore";
import styles from "./LessonLayout.module.scss";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";

const MONTH_MAP: Record<string, number> = {
  "yan": 0, "jan": 0, "fev": 1, "feb": 1, "mar": 2, "apr": 3,
  "may": 4, "iyun": 5, "jun": 5, "iyul": 6, "jul": 6, "avg": 7,
  "aug": 7, "sen": 8, "sep": 8, "okt": 9, "oct": 9, "noy": 10,
  "nov": 10, "dek": 11, "dec": 11,
};

function resolveMonth(monthStr: string): number {
  const lower = monthStr.toLowerCase();
  for (const [key, val] of Object.entries(MONTH_MAP)) {
    if (lower.startsWith(key)) return val;
  }
  return -1;
}

function buildDateStr(day: string, month: string, year: number): string {
  const mIndex = resolveMonth(month);
  if (mIndex === -1) return "";
  return `${year}-${String(mIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function LessonLayoutClient({ children }: { children: React.ReactNode }) {
  const { id, date } = useParams<{ id: string; date: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname?.startsWith("/teacher") ? "/teacher/groups" : "/dashboard/groups";

  const { schedules, loadedGroupId, setSchedules } = useLessonStore();
  const [currentMonth, setCurrentMonth] = useState(0);

  // Fetch schedules once per group
  useEffect(() => {
    if (!id || loadedGroupId === id) return;
    const fetch = async () => {
      try {
        const res = await api.get(`/groups/${id}/schedules`);
        const formatted: any[] = [];
        (res.data || []).forEach((item: any) => {
          Object.keys(item).sort((a, b) => Number(a) - Number(b)).forEach((key) => {
            const value = item[key];
            formatted.push({
              id: key,
              label: `${key}-o'quv oyi`,
              isCurrent: value.isActive,
              days: value.days.map((d: any, idx: number) => ({
                id: `${key}-${idx}`,
                day: d.day,
                month: d.month,
                isCompleted: d.isCompleted,
              })),
            });
          });
        });
        setSchedules(formatted, id);
      } catch (err) {
        console.error("Error fetching schedules:", err);
      }
    };
    fetch();
  }, [id, loadedGroupId, setSchedules]);

  // Sync currentMonth to active date
  useEffect(() => {
    if (!date || schedules.length === 0) return;
    const [, m, d] = (date as string).split("-");
    const mIndex = parseInt(m, 10) - 1;
    const dayInt = parseInt(d, 10);
    const found = schedules.findIndex((sm) =>
      sm.days.some((item) => {
        const mi = resolveMonth(item.month);
        return mi === mIndex && parseInt(item.day, 10) === dayInt;
      })
    );
    if (found !== -1) setCurrentMonth(found);
  }, [schedules, date]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className={styles.wrapper}>
      {/* Persistent header */}
      <div className={styles.pageHeader}>
        <button className={styles.backBtn} onClick={() => router.push(`${basePath}/${id}`)}>
          <ArrowBackIosNewRoundedIcon fontSize="small" />
        </button>
        <h2>Dars tafsilotlari</h2>
      </div>

      {/* Persistent date navigator */}
      <div className={styles.dateNavigatorContainer}>
        <div className={styles.monthNavRow}>
          <button
            className={styles.navArrow}
            onClick={() => setCurrentMonth((p) => Math.max(0, p - 1))}
            disabled={currentMonth === 0}
          >
            <KeyboardArrowLeftRoundedIcon fontSize="small" />
          </button>
          <span className={styles.monthLabel}>
            {schedules[currentMonth]?.label || ""}
          </span>
          <button
            className={styles.navArrow}
            onClick={() => setCurrentMonth((p) => Math.min(schedules.length - 1, p + 1))}
            disabled={schedules.length === 0 || currentMonth === schedules.length - 1}
          >
            <KeyboardArrowRightRoundedIcon fontSize="small" />
          </button>
        </div>

        <div className={styles.dateChips}>
          {schedules[currentMonth]?.days.map((d, index) => {
            const year = today.getFullYear();
            const mIndex = resolveMonth(d.month);
            if (mIndex === -1) return null;
            const itemDate = new Date(year, mIndex, parseInt(d.day, 10));
            const isFuture = itemDate > today;
            const dateStr = buildDateStr(d.day, d.month, year);
            const isActive = date === dateStr;

            let chipClass = styles.dateChip;
            if (isActive) chipClass += ` ${styles.active}`;
            else if (!isFuture) chipClass += ` ${styles.past}`;
            else chipClass += ` ${styles.future} ${styles.disabled}`;

            return (
              <div
                key={index}
                className={chipClass}
                style={{ cursor: isFuture ? "not-allowed" : "pointer", opacity: isFuture ? 0.5 : 1 }}
                onClick={() => { if (!isFuture && dateStr) router.replace(`${basePath}/${id}/lesson/${dateStr}`); }}
                onMouseEnter={() => { if (!isFuture && dateStr) router.prefetch(`${basePath}/${id}/lesson/${dateStr}`); }}
              >
                <span className={styles.chipMonth}>{d.month}</span>
                <span className={styles.chipDay}>{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Animated page content — remounts on date change */}
      <div key={pathname} className={styles.pageContent}>
        {children}
      </div>
    </div>
  );
}
