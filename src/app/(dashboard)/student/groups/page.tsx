"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './groups.module.scss';
import { api, fetchGroupsCached } from '@/api/api';

interface TeacherDetail {
    name: string;
    role: string;
    days: string;
    time: string;
}

interface GroupData {
    id: number;
    name: string;
    course: string;
    teacherInitials: string;
    teacherColor: string;
    startDate: string;
    status: 'active' | 'completed';
    teachersList: TeacherDetail[];
}

interface ApiTeacher {
    full_name: string;
    role: string;
    week_day: string[];
    start_time: string;
    duration_hours: number;
}

interface ApiGroup {
    groupName: string;
    courseName: string;
    teachersCount: number;
    startDate: string;
    groupId: number;
    teachers: ApiTeacher[];
}

const DAYS_MAP: Record<string, string> = {
    MONDAY: 'Du',
    TUESDAY: 'Se',
    WEDNESDAY: 'Ch',
    THURSDAY: 'Pa',
    FRIDAY: 'Ju',
    SATURDAY: 'Sha',
    SUNDAY: 'Ya'
};

const formatCustomDate = (isoString: string) => {
    const d = new Date(isoString);
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]}, ${d.getFullYear()}`;
};

const calculateTimeRange = (startTime: string, durationMinutes: number) => {
    if (!startTime) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const startObj = new Date();
    startObj.setHours(hours, minutes, 0, 0);

    const endObj = new Date(startObj.getTime() + durationMinutes * 60000);
    
    const formatTime = (date: Date) => 
        `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        
    return `${formatTime(startObj)} - ${formatTime(endObj)}`;
};

export default function StudentGroupsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
    const [selectedGroup, setSelectedGroup] = useState<GroupData | null>(null);
    const [groups, setGroups] = useState<GroupData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                setLoading(true);
                const apiData = await fetchGroupsCached('/students/my/groups');
                if (apiData) {
                    const mappedData: GroupData[] = apiData.map((g: ApiGroup, index: number) => {
                        const colors = ['#c2916b', '#6b7280', '#10b981', '#3b82f6', '#f59e0b'];
                        const color = colors[index % colors.length];
                        
                        return {
                            id: g.groupId,
                            name: g.groupName,
                            course: g.courseName,
                            teacherInitials: g.teachersCount.toString(),
                            teacherColor: color,
                            startDate: formatCustomDate(g.startDate),
                            status: 'active', // Defaulting to active as per current structure
                            teachersList: g.teachers.map((t) => ({
                                name: t.full_name,
                                role: t.role,
                                days: t.week_day.map(d => DAYS_MAP[d] || d).join(', '),
                                time: calculateTimeRange(t.start_time, t.duration_hours)
                            }))
                        };
                    });
                    setGroups(mappedData);
                }
            } catch (err) {
                console.error("Failed to fetch groups", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const filteredGroups = groups.filter(g => g.status === activeTab);

    const closeModal = () => setSelectedGroup(null);

    return (
        <div className={styles.container}>
            {/* Tabs */}
            <div className={styles.tabsHeader}>
                <button 
                    className={`${styles.tabBtn} ${activeTab === 'active' ? styles.active : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    Faol
                </button>
                <button 
                    className={`${styles.tabBtn} ${activeTab === 'completed' ? styles.active : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Tugagan
                </button>
            </div>

            {/* Table */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Guruh nomi</th>
                            <th>Yo'nalishi</th>
                            <th>O'qituvchi</th>
                            <th>Boshlash vaqti</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGroups.length > 0 ? (
                            filteredGroups.map((group, index) => (
                                <tr 
                                    key={group.id} 
                                    className={styles.clickableRow}
                                    onClick={() => router.push(`/student/groups/${group.id}`)}
                                >
                                    <td>{index + 1}</td>
                                    <td>{group.name}</td>
                                    <td>{group.course}</td>
                                    <td>
                                        <div 
                                            className={styles.teacherAvatar}
                                            style={{ backgroundColor: group.teacherColor }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedGroup(group);
                                            }}
                                        >
                                            {group.teacherInitials}
                                        </div>
                                    </td>
                                    <td>{group.startDate}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className={styles.emptyState}>Ma'lumot topilmadi</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {selectedGroup && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>{selectedGroup.name}</h2>
                        <p className={styles.modalStatus}>{selectedGroup.status === 'active' ? 'Faol' : 'Tugagan'}</p>
                        
                        <div className={styles.modalTableContainer}>
                            <table className={styles.modalTable}>
                                <thead>
                                    <tr>
                                        <th>O'qituvchi</th>
                                        <th>Roli</th>
                                        <th>Dars kunlari</th>
                                        <th>Dars vaqti</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedGroup.teachersList?.map((t, i) => (
                                        <tr key={i}>
                                            <td>{t.name}</td>
                                            <td>{t.role}</td>
                                            <td>{t.days}</td>
                                            <td>{t.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
