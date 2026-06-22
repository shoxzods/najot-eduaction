const fs = require('fs');
let content = fs.readFileSync('src/views/Groups/HomeworkResults/StudentHomeworkDetail.tsx', 'utf-8');

const correctTop = `"use client";
import { useRouter, useParams, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import React, { useState, useEffect } from "react";

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

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          \`/group/\${id}/homework/\${homeworkId}/result/\${resultId}\`
        );
        const raw = res.data?.data || res.data || {};
        setDetail(raw);
      } catch (err) {
        console.error("Error fetching detail:", err);`;

const index = content.indexOf('      } finally {');
if (index !== -1) {
    fs.writeFileSync('src/views/Groups/HomeworkResults/StudentHomeworkDetail.tsx', correctTop + '\n' + content.substring(index));
} else {
    console.log("Could not find anchor '} finally {'");
}
