"use client";
import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import styles from './topic-detail.module.scss';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import { api } from '@/api/api';
import { TopicDetailContext, ApiVideo, TopicData } from './topic-context';

interface ApiLesson {
    id: number;
    topic: string;
    created_at: string;
    status: string;
    videoCount: number;
}

const formatCustomDate = (isoString: string) => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]}, ${d.getFullYear()}`;
};

export default function TopicsLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const router = useRouter();
    const topicId = Number(params.topicId);
    const groupId = params.id as string;

    const [topics, setTopics] = useState<TopicData[]>([]);
    const [expandedTopicId, setExpandedTopicId] = useState<number | null>(topicId);
    const [videos, setVideos] = useState<ApiVideo[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<ApiVideo | null>(null);

    // Keep the active topic in sync with the route in case navigation happens
    // by some path other than clicking a topic in this sidebar (e.g. back/forward).
    useEffect(() => {
        setExpandedTopicId(topicId);
    }, [topicId]);

    // Topics list only needs to be fetched once per group — this layout stays
    // mounted across topic navigation, so it no longer refetches/reloads on
    // every page change like it did when this lived in the page component.
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

    const videosFetchedForTopicRef = useRef<number | null>(null);
    useEffect(() => {
        if (expandedTopicId && videosFetchedForTopicRef.current !== expandedTopicId) {
            videosFetchedForTopicRef.current = expandedTopicId;
            setVideos([]);
            setSelectedVideo(null);
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
                    videosFetchedForTopicRef.current = null;
                });
        }
    }, [groupId, expandedTopicId]);

    const currentTopic = topics.find(t => t.id === expandedTopicId) || topics[0];

    const toggleAccordion = (id: number) => {
        setExpandedTopicId(prev => prev === id ? null : id);
    };

    const navigateToTopic = (id: number) => {
        router.push(`/student/groups/${groupId}/topics/${id}`);
        setExpandedTopicId(id);
    };

    return (
        <TopicDetailContext.Provider value={{ expandedTopicId, currentTopic, videos, selectedVideo, setSelectedVideo }}>
            <div className={styles.container}>

                {/* Left Content */}
                <div className={styles.mainContent}>
                    {children}
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
            </div>
        </TopicDetailContext.Provider>
    );
}
