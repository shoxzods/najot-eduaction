// ─── Core Domain Types ───────────────────────────────────────────────────────

export interface Teacher {
  id: number;
  full_name: string;
  phone?: string;
  photo?: string;
  email?: string;
}

export interface Course {
  id: number;
  name: string;
  duration_month: number;
  description?: string;
}

export interface Room {
  id: number;
  name: string;
  capacity?: number;
}

export interface Student {
  id: number;
  full_name: string;
  phone?: string;
  photo?: string;
  email?: string;
  group_id?: number;
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  course: Course;
  room: string;
  room_id?: number;
  start_time: string;
  start_date?: string;
  week_day: string[];
  teachers: Teacher[];
  students: Student[];
  max_student?: number;
}

export interface Staff {
  id: number;
  full_name: string;
  phone?: string;
  photo?: string;
  role?: string;
  email?: string;
}

export interface Homework {
  id: number;
  title: string;
  description?: string;
  deadline?: string;
  group_id?: number;
  created_at?: string;
}

export interface HomeworkResult {
  id: number;
  student: Student;
  homework_id: number;
  score?: number;
  status?: string;
  submitted_at?: string;
  file_url?: string;
  comment?: string;
}

export interface Exam {
  id: number;
  title: string;
  group_id?: number;
  date?: string;
}

export interface ExamResult {
  id: number;
  student: Student;
  exam_id: number;
  score?: number;
  status?: string;
}

export interface Lesson {
  id: number;
  date: string;
  group_id?: number;
  attendance?: LessonAttendance[];
}

export interface LessonAttendance {
  student_id: number;
  student?: Student;
  status: 'present' | 'absent' | 'late' | string;
}

export interface Gift {
  id: number;
  name: string;
  coin_price?: number;
  photo?: string;
  description?: string;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiListResponse<T> {
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ApiSingleResponse<T> {
  data: T;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
}

// ─── Modal / UI State Types ───────────────────────────────────────────────────

export interface ConfirmDialogState<T = unknown> {
  isOpen: boolean;
  item: T | null;
}

export interface GroupFormData {
  name: string;
  description: string;
  courseId: string | number;
  roomId: string | number;
  startDate: string;
  startTime: string;
  maxStudent: number;
  weekDays: string[];
  teachers: (string | number)[];
  students: (string | number)[];
}
