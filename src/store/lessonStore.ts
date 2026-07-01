import { create } from 'zustand';

interface ScheduleDay {
  id: string;
  day: string;
  month: string;
  isCompleted: boolean;
}

interface ScheduleMonth {
  id: string;
  label: string;
  isCurrent: boolean;
  days: ScheduleDay[];
}

interface LessonStore {
  schedules: ScheduleMonth[];
  loadedGroupId: string | null;
  setSchedules: (schedules: ScheduleMonth[], groupId: string) => void;
}

export const useLessonStore = create<LessonStore>((set) => ({
  schedules: [],
  loadedGroupId: null,
  setSchedules: (schedules, groupId) => set({ schedules, loadedGroupId: groupId }),
}));
