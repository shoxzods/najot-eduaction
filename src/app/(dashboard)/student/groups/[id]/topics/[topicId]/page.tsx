"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './topic-detail.module.scss';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { api, getFileUrl } from '@/api/api';

interface ApiLesson {
    id: number;
    topic: string;
    created_at: string;
    status: string;
    videoCount: number;
}

interface ApiVideo {
    id: number;
    video_url: string;
    originalname: string;
    created_at: string;
}

interface TopicData {
    id: number;
    title: string;
    date: string;
    videoCount: number;
}

const formatCustomDate = (isoString: string) => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]}, ${d.getFullYear()}`;
};

const getDeadlineDate = (isoString: string) => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    d.setDate(d.getDate() + 2); // add 2 days
    
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    
    return `${year} M${month} ${day} ${hours}:${minutes}`;
};

const getAttachmentUrl = (filename: string) => {
    if (!filename) return '#';
    if (filename.startsWith('http')) return filename;
    const clean = filename.replace(/^\//, '');
    return `https://najot-edu.softwareengineer.uz/files/files/${clean}`;
};

export default function TopicDetailPage() {
    const params = useParams();
    const router = useRouter();
    const topicId = Number(params.topicId);
    const groupId = params.id as string;
    
    const [topics, setTopics] = useState<TopicData[]>([]);
    const [expandedTopicId, setExpandedTopicId] = useState<number | null>(topicId);
    const [activeTab, setActiveTab] = useState<'video' | 'vazifa'>('video');
    const [videos, setVideos] = useState<ApiVideo[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<ApiVideo | null>(null);
    const [homeworkData, setHomeworkData] = useState<any>(null);
    const [submissionComment, setSubmissionComment] = useState("");
    const [submissionFile, setSubmissionFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const topicsFetchedRef = useRef(false);
    useEffect(() => {
        const fetchTopics = async () => {
            topicsFetchedRef.current = true;
            try {
                const res = await api.get(`/groups/${groupId}/lessons/all`);
                if (res.data) {
                    const mapped = res.data.map((item: ApiLesson) => ({
                        id: item.id,
                        title: item.topic,
                        date: formatCustomDate(item.created_at),
                        videoCount: item.videoCount
                    }));
                    setTopics(mapped);
                    // use functional update if possible, but safe here since it's just mount
                    setExpandedTopicId(prev => {
                        if (!mapped.some((t: TopicData) => t.id === prev) && mapped.length > 0) {
                            return mapped[0].id;
                        }
                        return prev;
                    });
                }
            } catch (err) {
                console.error("Failed to fetch topics", err);
                topicsFetchedRef.current = false;
            }
        };
        if (groupId && !topicsFetchedRef.current) {
            fetchTopics();
        }
    }, [groupId]);

    const detailsFetchedForTopicRef = useRef<number | null>(null);
    useEffect(() => {
        if (expandedTopicId && detailsFetchedForTopicRef.current !== expandedTopicId) {
            detailsFetchedForTopicRef.current = expandedTopicId;
            setVideos([]); // reset while fetching
            setSelectedVideo(null);
            setHomeworkData(null);
            setSubmissionComment("");
            setSubmissionFile(null);
            api.get(`/groups/${groupId}/lessons/${expandedTopicId}/videos`)
                .then(res => {
                    if (res.data && res.data.success) {
                        setVideos(res.data.data);
                        if (res.data.data.length > 0) {
                            setSelectedVideo(res.data.data[0]);
                        }
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch videos", err);
                    detailsFetchedForTopicRef.current = null;
                });

            api.get(`/groups/${groupId}/lessons/${expandedTopicId}/homeworks`)
                .then(res => {
                    if (res.data && res.data.success) {
                        setHomeworkData(res.data.data);
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch homeworks", err);
                    detailsFetchedForTopicRef.current = null;
                });
        }
    }, [groupId, expandedTopicId]);

    const handleHomeworkSubmit = async () => {
        if (!homeworkData?.homework?.id) return;
        if (!submissionComment.trim() && !submissionFile) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', submissionComment);
            if (submissionFile) {
                formData.append('file', submissionFile);
            }

            const res = await api.post(`/students/homeworkAnswer/${homeworkData.homework.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data && res.data.success) {
                setSnackbar({ open: true, message: "Vazifa muvaffaqiyatli yuborildi!", severity: 'success' });
                setSubmissionComment("");
                setSubmissionFile(null);
                
                // Re-fetch homeworks to refresh the UI
                const newRes = await api.get(`/groups/${groupId}/lessons/${expandedTopicId}/homeworks`);
                if (newRes.data && newRes.data.success) {
                    setHomeworkData(newRes.data.data);
                }
            } else {
                setSnackbar({ open: true, message: "Xatolik yuz berdi", severity: 'error' });
            }
        } catch (err) {
            console.error("Failed to submit homework", err);
            setSnackbar({ open: true, message: "Xatolik: Server bilan bog'lanib bo'lmadi", severity: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentTopic = topics.find(t => t.id === expandedTopicId) || topics[0];

    const toggleAccordion = (id: number) => {
        setExpandedTopicId(prev => prev === id ? null : id);
    };

    const navigateToTopic = (id: number) => {
        router.push(`/student/groups/${groupId}/topics/${id}`);
        setExpandedTopicId(id);
    };

    return (
        <div className={styles.container}>
            
            {/* Left Content */}
            <div className={styles.mainContent}>
                
                <div className={styles.contentBody}>
                    <div className={styles.videoWrapper}>
                        {selectedVideo ? (
                            <video
                                key={selectedVideo.id}
                                className={styles.videoPlayer}
                                controls
                                src={selectedVideo.video_url?.startsWith('http') ? selectedVideo.video_url : `https://najot-edu.softwareengineer.uz/files/files/${selectedVideo.video_url?.replace(/^\//, '')}`}
                            >
                                Sizning brauzeringiz videoni qo'llab-quvvatlamaydi.
                            </video>
                        ) : currentTopic && currentTopic.videoCount > 0 && videos.length === 0 ? (
                            <div className={styles.noVideoPlaceholder}>
                                <strong>Video yuklanmoqda...</strong>
                            </div>
                        ) : (
                            <div className={styles.noVideoPlaceholder}>
                                <img 
                                    src="/najot_edu.svg" 
                                    alt="NajotEdu" 
                                    className={styles.noVideoLogo}
                                />
                                <strong>Video mavjud emas</strong>
                            </div>
                        )}
                    </div>

                    {videos.map(v => (
                        <div key={v.id} className={styles.fileBlock}>
                            {currentTopic?.title} ({v.originalname})
                        </div>
                    ))}

                    {/* Vazifalarim section */}
                    <div className={styles.vazifalarimSection}>
                        {/* Header */}
                        <div className={styles.vazifalarimHeader}>
                            <span className={styles.vazifalarimTitle}>Vazifalarim</span>
                            {homeworkData?.result?.grade !== undefined && <span className={styles.vazifalarimBall}>Ball: {homeworkData.result.grade}</span>}
                        </div>

                        {/* Uyga vazifa */}
                        {homeworkData?.homework && (
                        <div className={styles.vazifaCard}>
                            <div className={styles.vazifaCardHeader}>
                                <strong>Uyga vazifa</strong>
                                <div className={styles.headerRight}>
                                    <div className={styles.deadlineBadge}>
                                        <InfoOutlinedIcon fontSize="small" />
                                        Uyga vazifa muddati: {getDeadlineDate(homeworkData.homework.created_at)}
                                    </div>
                                    <span className={styles.fileCount}>Fayllar soni: 1</span>
                                </div>
                            </div>
                            <p className={styles.vazifaDesc}>{homeworkData.homework.title}</p>
                            <a 
                                href={getAttachmentUrl(homeworkData.homework.file)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.fileAttachment}
                            >
                                <span className={styles.fileIcon}>📄</span>
                                <span>{homeworkData.homework.file}</span>
                            </a>
                            <div className={styles.vazifaDate}>{formatCustomDate(homeworkData.homework.created_at)}</div>
                        </div>
                        )}

                        {/* Homework submission input (only if homework exists and answer does not exist) */}
                        {homeworkData?.homework && !homeworkData?.answer && (
                            <div className={styles.submissionBox} style={{ opacity: isSubmitting ? 0.6 : 1, pointerEvents: isSubmitting ? 'none' : 'auto' }}>
                                <div className={styles.submissionInputWrapper}>
                                    <input 
                                        type="text" 
                                        placeholder={submissionFile ? submissionFile.name : "Fayl biriktiring va izoh qoldiring"} 
                                        className={styles.submissionInput}
                                        value={submissionComment}
                                        onChange={(e) => setSubmissionComment(e.target.value)}
                                        maxLength={1000}
                                        disabled={isSubmitting}
                                    />
                                    <div className={styles.submissionActions}>
                                        <input 
                                            type="file" 
                                            id="homeworkFileInput"
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setSubmissionFile(e.target.files[0]);
                                                }
                                            }}
                                            disabled={isSubmitting}
                                        />
                                        <button 
                                            className={styles.iconBtn} 
                                            onClick={() => document.getElementById('homeworkFileInput')?.click()}
                                            disabled={isSubmitting}
                                            title="Fayl biriktirish"
                                        >
                                            <AttachFileOutlinedIcon fontSize="small" color={submissionFile ? "primary" : "inherit"} />
                                        </button>
                                        <button 
                                            className={styles.iconBtn}
                                            onClick={handleHomeworkSubmit}
                                            disabled={isSubmitting || (!submissionComment.trim() && !submissionFile)}
                                        >
                                            <SendOutlinedIcon fontSize="small" color={(submissionComment.trim() || submissionFile) ? "primary" : "inherit"} />
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.charCount}>{submissionComment.length} / 1000</div>
                            </div>
                        )}

                        {/* Mening jo'natmalarim */}
                        {homeworkData?.answer && (
                        <div className={styles.vazifaCard}>
                            <div className={styles.vazifaCardHeader}>
                                <strong>Mening jo'natmalarim</strong>
                                <span className={styles.fileCount}>Fayllar soni: {homeworkData.answer.file ? 1 : 0}</span>
                            </div>
                            <p className={styles.vazifaDesc}>{homeworkData.answer.title || "Jo'natilgan"}</p>
                            {homeworkData.answer.file && (
                            <a 
                                href={getAttachmentUrl(homeworkData.answer.file)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.fileAttachment}
                            >
                                <span className={styles.fileIcon}>🖼</span>
                                <span>{homeworkData.answer.file}</span>
                            </a>
                            )}
                            <div className={styles.vazifaDate}>{formatCustomDate(homeworkData.answer.created_at)}</div>
                        </div>
                        )}

                        {/* Sizning vazifangiz tekshirilmoqda... */}
                        {homeworkData?.homework && homeworkData?.answer && !homeworkData?.result && (
                            <div className={styles.pendingWrapper}>
                                <div className={styles.pendingCard}>
                                    <HourglassTopIcon sx={{ color: '#475569' }} />
                                    <p>Sizning vazifangiz tekshirilmoqda...</p>
                                </div>
                                <p className={styles.noResubmitText}>Qayta topshirish imkoniyati berilmagan</p>
                            </div>
                        )}

                        {/* O'qituvchi izohi */}
                        {homeworkData?.result && (
                        <div className={styles.vazifaCard}>
                            <div className={styles.vazifaCardHeader}>
                                <strong>O'qituvchi izohi</strong>
                                <span className={homeworkData.result.homeworkStatus === 'REJECTED' ? styles.statusError : styles.statusSuccess}>
                                    {homeworkData.result.homeworkStatus === 'REJECTED' ? 'Vazifa qaytarildi' : 'Vazifa qabul qilindi'}
                                </span>
                            </div>
                            <p className={styles.teacherNote}>{homeworkData.result.title || 'Tekshirildi'}</p>
                            <p className={styles.teacherName}>Tekshiruvchi: {homeworkData.result.checker || '-'}</p>
                            <div className={styles.vazifaDate}>{formatCustomDate(homeworkData.result.created_at)}</div>
                        </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Topics List */}
            <div className={styles.topicsSidebar}>
                <div className={styles.topicsScrollArea}>
                <div className={styles.topicsList}>
                    {topics.map(topic => {
                        const isActive = topic.id === expandedTopicId;

                        if (topic.videoCount === 0) {
                            return (
                                <div 
                                    key={topic.id}
                                    className={`${styles.staticTopicCard} ${isActive ? styles.staticTopicCardActive : ''}`}
                                    onClick={() => {
                                        navigateToTopic(topic.id);
                                        setExpandedTopicId(topic.id);
                                    }}
                                >
                                    <strong>{topic.title}</strong>
                                    <span>Dars sanasi: {topic.date}</span>
                                </div>
                            );
                        }

                        return (
                            <div 
                                key={topic.id}
                                className={styles.topicItem}
                                onClick={() => toggleAccordion(topic.id)}
                            >
                                {/* Header row: navigate on title click, arrow toggles */}
                                <div className={styles.topicRow}>
                                    <div 
                                        className={`${styles.topicHeaderBox} ${isActive ? styles.topicHeaderBoxActive : ''}`}
                                        onClick={(e) => { e.stopPropagation(); navigateToTopic(topic.id); }}
                                    >
                                        <h4>{topic.title}</h4>
                                        <span>Dars sanasi: {topic.date}</span>
                                    </div>
                                    <div className={`${styles.topicArrow} ${isActive ? styles.topicArrowUp : ''}`}>
                                        <KeyboardArrowDownRoundedIcon />
                                    </div>
                                </div>

                                {/* Collapsible video list */}
                                <div className={`${styles.accordionBody} ${isActive ? styles.accordionBodyOpen : ''}`}>
                                    {topic.videoCount > 0 ? (
                                        <div className={styles.videoList}>
                                            {isActive && videos.length > 0 ? videos.map((v, i) => (
                                                <div 
                                                    key={v.id} 
                                                    className={`${styles.videoBox} ${selectedVideo?.id === v.id ? styles.activeVideoBox : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedVideo(v);
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <PlayCircleOutlineRoundedIcon
                                                        className={styles.playCircleIcon}
                                                        fontSize="small"
                                                        color={selectedVideo?.id === v.id ? 'primary' : 'inherit'}
                                                    />
                                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 8 }} title={v.originalname}>
                                                        {i + 1}-video: {v.originalname}
                                                    </span>
                                                </div>
                                            )) : Array.from({ length: topic.videoCount }).map((_, i) => (
                                                <div key={i} className={styles.videoBox}>
                                                    <PlayCircleOutlineRoundedIcon
                                                        className={styles.playCircleIcon}
                                                        fontSize="small"
                                                    />
                                                    <span>{i + 1}-video: yuklanmoqda...</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={styles.noVideoBox}>
                                            <strong>{topic.title}</strong>
                                            <span>Dars sanasi: {topic.date}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                </div>
            </div>

            {/* Notifications */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', fontFamily: 'inherit' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            
        </div>
    );
}
