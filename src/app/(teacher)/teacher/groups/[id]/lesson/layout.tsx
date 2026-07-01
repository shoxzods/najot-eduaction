import LessonLayoutClient from "@/views/Groups/LessonDetail/LessonLayoutClient";

export default function LessonLayout({ children }: { children: React.ReactNode }) {
  return <LessonLayoutClient>{children}</LessonLayoutClient>;
}
