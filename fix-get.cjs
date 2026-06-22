const fs = require('fs');
let content = fs.readFileSync('src/views/Groups/HomeworkResults/StudentHomeworkDetail.tsx', 'utf-8');

const replacement = `  useEffect(() => {
    const fetchDetail = async () => {
      // Yangi api formati bo'yicha lessonId kerak:
      const queryLessonId = searchParams.get("lessonId");
      const finalLessonId = queryLessonId || homeworkDetails?.id;
      
      if (!finalLessonId) return;

      setLoading(true);
      try {
        const res = await api.get(
          \`/group/\${id}/lesson/\${finalLessonId}/homework/\${homeworkId}/student/\${resultId}\`
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
      try {
        const res = await api.get(\`/homework/\${id}\`);
        const data = res.data?.data || res.data || [];
        const hwList = Array.isArray(data) ? data : [data];`;

// Let's replace the whole block from "useEffect(() => { \n const fetchDetail =" down to "const hwList = Array.isArray(data) ? data : [data];"
// Wait, since fuzzy match broke it, I'll just use a regex to match from "useEffect(() => {" up to "const hwList"
content = content.replace(/  useEffect\(\(\) => \{\r?\n    const fetchDetail = async \(\) => \{[\s\S]*?const hwList = Array\.isArray\(data\) \? data : \[data\];/, replacement);

fs.writeFileSync('src/views/Groups/HomeworkResults/StudentHomeworkDetail.tsx', content);
