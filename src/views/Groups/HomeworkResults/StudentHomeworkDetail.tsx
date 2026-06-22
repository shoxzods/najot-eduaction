"use client";
import { useRouter, useParams, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from "react";

import { api } from "../../../api/api";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import styles from "./StudentHomeworkDetail.module.scss";
import { toast } from '../../../utils/toast';

const STATUS_LABELS = {
  PENDING: "Kutayabti",
  ACCEPTED: "Qabul qilindi",
  REJECTED: "Qaytarildi",
  CHECKED: "Tekshirildi",
};

const STATUS_COLORS = {
  PENDING: styles.statusPending,
  ACCEPTED: styles.statusAccepted,
  REJECTED: styles.statusRejected,
  CHECKED: styles.statusChecked,
};

const TAB_TO_STATUS = {
  "Kutayotganlar": "PENDING",
  "Qabul qilinganlar": "ACCEPTED",
  "Qaytarilganlar": "REJECTED",
  "Tekshirilganlar": "CHECKED"
};

export default function StudentHomeworkDetail() {
  const { id, homeworkId, resultId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname?.startsWith('/teacher') ? '/teacher/groups' : '/dashboard/groups';

  const tabLabel = searchParams.get("tab") || "Kutayotganlar";

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [ballValue, setBallValue] = useState(60);
  const [checkComment, setCheckComment] = useState("");
  const [homeworkDetails, setHomeworkDetails] = useState(null);
  const [isLate, setIsLate] = useState(false);

  const sliderColor = ballValue >= 60 ? '#22c55e' : '#ef4444';

  const detailFetchedRef = useRef(null);
  const hwFetchedRef = useRef(null);

  useEffect(() => {
    const fetchDetail = async () => {
      // Yangi api formati bo'yicha lessonId kerak:
      const queryLessonId = searchParams.get("lessonId");
      const finalLessonId = queryLessonId || homeworkDetails?.id;
      
      if (!finalLessonId) return;
      if (detailFetchedRef.current === finalLessonId) return;
      detailFetchedRef.current = finalLessonId;

      setLoading(true);
      try {
        const res = await api.get(
          `/group/${id}/lesson/${finalLessonId}/homework/${homeworkId}/student/${resultId}`
        );
        const raw = res.data?.data || res.data || {};
        setDetail(raw);
      } catch (err) {
        console.error("Error fetching detail:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id && homeworkId && resultId) {
      fetchDetail();
    }
  }, [id, homeworkId, resultId, homeworkDetails, searchParams]);

  useEffect(() => {
    const fetchHomeworkDetails = async () => {
      if (hwFetchedRef.current === id) return;
      hwFetchedRef.current = id;
      try {
        const res = await api.get(`/homework/${id}`);
        const data = res.data?.data || res.data || [];
        const hwList = Array.isArray(data) ? data : [data];

        // Match strictly by homework[0].id — that is the homeworkId in the URL
        const hw = hwList.find(lesson =>
          String(lesson.homework?.[0]?.id) === String(homeworkId)
        );

        if (hw) {
          // Attach homework sent date for accurate deadline calculation
          hw._homeworkSentAt = hw.homework?.[0]?.created_at || hw.created_at;
          setHomeworkDetails(hw);
        }
      } catch (err) {
        console.error("Error fetching homework details:", err);
      }
    };
    if (id && homeworkId) {
      fetchHomeworkDetails();
    }
  }, [id, homeworkId]);

  useEffect(() => {
    if (detail) {
      let deadlineDate = null;
      // Use homework[0].created_at (when HW was sent to students) for deadline
      const homeworkSentAt = homeworkDetails?._homeworkSentAt;
      if (homeworkSentAt) {
        deadlineDate = new Date(new Date(homeworkSentAt).getTime() + 2 * 24 * 60 * 60 * 1000);
      } else if (detail.deadline) {
        deadlineDate = new Date(detail.deadline);
      }

      const submittedStr = searchParams.get("date") || detail.submitted_at || detail.created_at || detail.sent_at;
      let submittedDate = submittedStr ? new Date(submittedStr) : null;

      if (deadlineDate && submittedDate && submittedDate.getTime() > deadlineDate.getTime()) {
        setIsLate(true);
        setBallValue(0);
      } else {
        setIsLate(false);
        if (detail.ball !== undefined && detail.ball !== null) {
          setBallValue(detail.ball);
        } else if (!isLate && ballValue === 0) {
          setBallValue(60);
        }
      }
    }
  }, [detail, homeworkDetails, searchParams]);
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const payload = {
        grade: Number(ballValue || 0),
        title: checkComment ? String(checkComment) : "Tekshirildi",
        homework_answer_id: Number(detail?.id || resultId),
      };
      await api.post(`/group/${id}/homework/${homeworkId}/check`, payload);
      router.push(`${basePath}/${id}/homework/${homeworkId}/results?tab=${searchParams.get('tab') || 'Kutayotganlar'}`);
    } catch (err) {
      console.error("Error submitting check:", err);
      toast.error("Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    const months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const mins = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${months[date.getMonth()]}, ${date.getFullYear()} ${hours}:${mins}`;
  };

  const getFileUrl = (file) => {
    if (!file) return "";
    const path = typeof file === "string" ? file : (file.url || file.path || file.file_url || file.filename || file);
    if (typeof path === "string" && path.startsWith("http")) return path;
    return `https://najot-edu.softwareengineer.uz/files/files/${path}`;
  };

  const isImage = (file) => {
    const path = (typeof file === "string" ? file : (file.url || file.path || file.filename || "")).toString().toLowerCase();
    return /\.(jpg|jpeg|png|gif|webp|svg)$/.test(path);
  };

  // --- Real data from API ---
  const displayStudentName = detail?.students?.full_name || detail?.student?.full_name || detail?.full_name || "O'quvchi";
  const displayStatus = detail?.status || TAB_TO_STATUS[tabLabel] || "PENDING";
  const displayTitle = detail?.title || detail?.comment || "";

  // file can be a single string or an array
  const rawFile = detail?.file || detail?.files;
  const displayFiles = rawFile
    ? (Array.isArray(rawFile) ? rawFile : [rawFile])
    : [];
  const displayFileCount = displayFiles.length;
  const displayComment = detail?.title || "";

  const dateParam = searchParams.get("date");
  const displaySubmittedAt = dateParam || detail?.submitted_at || detail?.created_at || detail?.sent_at || "";

  const displayHomeworkDescription = detail?.homework?.description || detail?.homework?.topic || "";
  const displayBreadcrumbMain = "Uyga vazifa";
  const displayCardTitle = "Uy vazifasi";
  const displayCommentLabel = "Izoh:";
  // --------------------------

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <button
            className={styles.breadcrumbLink}
            onClick={() => router.push(`${basePath}/${id}/homework/${homeworkId}/results?tab=${searchParams.get('tab') || 'Kutayotganlar'}`)}
          >
            {tabLabel}
          </button>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{displayBreadcrumbMain}</span>
        </div>

        {loading ? (
          <div className={styles.loading}>Yuklanmoqda...</div>
        ) : (
          <>
            {/* Homework card */}
            {displayHomeworkDescription && (
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>{displayCardTitle}</h3>
                <div className={styles.cardInner}>
                  <span className={styles.izohLabel}>{displayCommentLabel}</span>
                  <p className={styles.izohText}>{displayHomeworkDescription}</p>
                </div>
              </div>
            )}

            {/* Student submission card */}
            <div className={styles.card}>
              <h2 className={styles.studentName}>{displayStudentName}</h2>

              <div className={styles.metaRow}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Vaqti:</span>
                  <strong className={styles.metaValue}>{formatDateTime(displaySubmittedAt)}</strong>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Fayllar soni:</span>
                  <strong className={styles.metaValue}>{displayFileCount}</strong>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Status:</span>
                  <span className={`${styles.statusBadge} ${STATUS_COLORS[displayStatus] || styles.statusPending}`}>
                    {STATUS_LABELS[displayStatus] || displayStatus}
                  </span>
                </div>
              </div>

              {/* Files and Comment wrapper */}
              {(displayFiles.length > 0 || displayComment) && (
                <div className={styles.filesSection}>
                  {displayFiles.length > 0 && (
                    <>
                      <p className={styles.filesLabel}>
                        Fayl: <strong>{displayFiles.length}</strong>
                      </p>
                      <div className={styles.filesGrid}>
                        {displayFiles.map((file, idx) =>
                          isImage(file) ? (
                            <img
                              key={idx}
                              src={getFileUrl(file)}
                              alt={`fayl-${idx + 1}`}
                              className={styles.fileImg}
                              onClick={() => setLightboxImg(getFileUrl(file))}
                            />
                          ) : (
                            <a
                              key={idx}
                              href={getFileUrl(file)}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.fileLink}
                            >
                              📎 {file.filename || file.name || `Fayl ${idx + 1}`}
                            </a>
                          )
                        )}
                      </div>
                    </>
                  )}

                  {displayComment && (
                    <div className={styles.commentBox}>
                      <p className={styles.commentLabel}>Uyga vazifa izohi:</p>
                      <p className={styles.commentText}>
                        {displayComment.startsWith("http") ? (
                          <a href={displayComment} target="_blank" rel="noreferrer">
                            {displayComment}
                          </a>
                        ) : (
                          displayComment
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Grading section */}
            <div className={styles.card}>
              <div className={styles.infoBanner}>
                <InfoOutlinedIcon className={styles.infoIcon} />
                <span>
                  60-100 oralig'ida ball qo'yilgan vazifa 'Qabul qilingan', 0-59 oralig'ida ball qo'yilgan vazifa 'Qaytarilgan' hisoblanadi.
                </span>
              </div>

              <h3 className={styles.sectionTitle}>Ball</h3>

              <div className={styles.sliderContainer}>
                <div className={styles.sliderWrapper}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={ballValue}
                    onChange={(e) => {
                      if (!isLate) {
                        setBallValue(Number(e.target.value));
                      }
                    }}
                    className={styles.rangeSlider}
                    style={{ '--val': `${ballValue}%`, '--color': sliderColor, cursor: isLate ? 'not-allowed' : 'pointer', opacity: isLate ? 0.6 : 1 } as React.CSSProperties}
                    disabled={isLate}
                  />
                  <div className={styles.sliderLabel}>O'tish bali</div>
                </div>
                <div className={styles.sliderValueBox} style={{ color: sliderColor, borderColor: sliderColor }}>{ballValue}</div>
              </div>

              <h3 className={styles.sectionTitle}>Fayllar</h3>
              <div className={styles.uploadArea}>
                <CloudUploadOutlinedIcon className={styles.uploadIcon} />
                <p className={styles.uploadMainText}>
                  Faylni yuklash uchun ushbu hudud ustiga bosing yoki faylni shu yerga olib keling
                </p>
                <p className={styles.uploadSubText}>
                  .jpg, .png, .pdf, .mp4, .docs formatlaridan birida bo'lishi mumkin
                </p>
              </div>

              <div className={styles.commentInputContainer}>
                <textarea
                  className={styles.commentInput}
                  placeholder="Izohingiz"
                  rows={4}
                  value={checkComment}
                  onChange={(e) => setCheckComment(e.target.value)}
                ></textarea>
                <button className={styles.micButton}>
                  <MicNoneOutlinedIcon fontSize="small" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button
                className={styles.cancelBtn}
                onClick={() => router.push(`${basePath}/${id}/homework/${homeworkId}/results?tab=${searchParams.get('tab') || 'Kutayotganlar'}`)}
                disabled={submitting}
              >
                Bekor qilish
              </button>
              <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Yuborilmoqda..." : "Yuborish"}
              </button>
            </div>
          </>
        )}

        {/* Lightbox */}
        {lightboxImg && (
          <div className={styles.lightboxOverlay} onClick={() => setLightboxImg(null)}>
            <img src={lightboxImg} alt="preview" className={styles.lightboxImg} />
          </div>
        )}
      </div>
    </div>
  );
}
