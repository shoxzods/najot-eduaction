"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './group-detail.module.scss';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import { api } from '@/api/api';

interface ApiLesson {
    id: number;
    topic: string;
    created_at: string;
    status: string;
    videoCount: number;
}

interface TopicData {
    id: number;
    title: string;
    isExam?: boolean;
    videoCount: number;
    hwStatus: string;
    hwDeadline: string;
    date: string;
}

const formatCustomDate = (isoString: string) => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]}, ${d.getFullYear()}`;
};

const formatDeadlineDate = (isoString: string) => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    d.setDate(d.getDate() + 2); // Add two days
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    const timeString = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]}, ${d.getFullYear()} ${timeString}`;
};

const statuses = [
    { label: 'Barchasi', colorClass: styles.optWhite },
    { label: 'Qabul qilingan', colorClass: styles.optGreen },
    { label: 'Berilmagan', colorClass: styles.optGray },
    { label: 'Qaytarilgan', colorClass: styles.optYellow },
    { label: 'Bajarilmagan', colorClass: styles.optRed },
    { label: 'Kutayotganlar', colorClass: styles.optBlue },
];

export default function GroupDetailPage() {
    const router = useRouter();
    const params = useParams();
    const groupId = params.id as string;
    
    const [filter, setFilter] = useState('Barchasi');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [topics, setTopics] = useState<TopicData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchedRef = useRef(false);
    useEffect(() => {
        const fetchLessons = async () => {
            fetchedRef.current = true;
            try {
                setLoading(true);
                const res = await api.get(`/groups/${groupId}/lessons/all`);
                if (res.data) {
                    const mapped: TopicData[] = res.data.map((item: ApiLesson) => ({
                        id: item.id,
                        title: item.topic,
                        videoCount: item.videoCount,
                        hwStatus: item.status,
                        date: formatCustomDate(item.created_at),
                        hwDeadline: formatDeadlineDate(item.created_at),
                        isExam: item.topic.toLowerCase().includes('exam')
                    }));
                    setTopics(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch lessons:", error);
                fetchedRef.current = false;
            } finally {
                setLoading(false);
            }
        };
        if (groupId && !fetchedRef.current) {
            fetchLessons();
        }
    }, [groupId]);

    const filteredTopics = filter === 'Barchasi' 
        ? topics 
        : topics.filter(t => t.hwStatus === filter);

    const getHwBadgeStyle = (status: string) => {
        switch (status) {
            case 'Berilmagan': return styles.hwGray;
            case 'Qaytarilgan': return styles.hwYellow;
            case 'Bajarilmagan': return styles.hwRed;
            case 'Bajarilgan': return styles.hwGreen;
            case 'Qabul qilingan': return styles.hwGreen;
            default: return styles.hwGray;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Uy vazifa statusi</h1>
                
                <div 
                    className={styles.customSelectWrapper} 
                    tabIndex={0} 
                    onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                            setIsDropdownOpen(false);
                        }
                    }}
                >
                    <div 
                        className={styles.customSelectHeader} 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {filter === 'Barchasi' ? (
                            <span>{filter}</span>
                        ) : (
                            <div className={`${styles.selectedBadge} ${statuses.find(s => s.label === filter)?.colorClass}`}>
                                {filter}
                            </div>
                        )}
                        <span className={styles.arrowIcon}>&#9662;</span>
                    </div>
                    <div className={`${styles.customSelectList} ${isDropdownOpen ? styles.customSelectListOpen : ''}`}>
                        {statuses.map(status => (
                            <div 
                                key={status.label}
                                className={`${styles.customSelectOption} ${status.colorClass}`}
                                onClick={() => {
                                    setFilter(status.label);
                                    setIsDropdownOpen(false);
                                }}
                            >
                                {status.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Mavzular</th>
                            <th>Video</th>
                            <th>Uyga vazifa Holati</th>
                            <th>
                                Uyga vazifa tugash vaqti
                                <ArrowDownwardRoundedIcon className={styles.sortIcon} fontSize="small" />
                            </th>
                            <th>
                                Dars sanasi
                                <ArrowUpwardRoundedIcon className={styles.sortIconGreen} fontSize="small" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTopics.map(topic => (
                            <tr 
                                key={topic.id}
                                className={styles.clickableRow}
                                onClick={() => router.push(`/student/groups/${groupId}/topics/${topic.id}`)}
                            >
                                <td>
                                    <div className={styles.titleCell}>
                                        {topic.title}
                                        {topic.isExam && <span className={styles.examBadge}>Imtihon</span>}
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.videoBadge}>
                                        {topic.videoCount}
                                    </div>
                                </td>
                                <td>
                                    <span className={`${styles.hwBadge} ${getHwBadgeStyle(topic.hwStatus)}`}>
                                        {topic.hwStatus}
                                    </span>
                                </td>
                                <td>{topic.hwDeadline}</td>
                                <td>{topic.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.pagination}>
                    <span>10 &darr; 0-0 gacha, 0 tadan</span>
                    <button className={styles.pageBtn}>&lt;</button>
                    <button className={styles.pageBtn}>&gt;</button>
                </div>
            </div>
        </div>
    );
}
