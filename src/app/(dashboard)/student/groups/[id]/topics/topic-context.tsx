"use client";
import { createContext, useContext } from 'react';

export interface ApiVideo {
    id: number;
    video_url: string;
    originalname: string;
    created_at: string;
}

export interface TopicData {
    id: number;
    title: string;
    date: string;
    videoCount: number;
}

export interface TopicDetailContextValue {
    expandedTopicId: number | null;
    currentTopic: TopicData | undefined;
    videos: ApiVideo[];
    selectedVideo: ApiVideo | null;
    setSelectedVideo: (video: ApiVideo) => void;
}

export const TopicDetailContext = createContext<TopicDetailContextValue | null>(null);

export function useTopicDetail() {
    const ctx = useContext(TopicDetailContext);
    if (!ctx) {
        throw new Error("useTopicDetail must be used within the topics/[topicId] layout");
    }
    return ctx;
}
