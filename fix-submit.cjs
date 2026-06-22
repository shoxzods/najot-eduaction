const fs = require('fs');
let content = fs.readFileSync('src/views/Groups/HomeworkResults/StudentHomeworkDetail.tsx', 'utf-8');

const correctSubmit = `    }
  }, [detail, homeworkDetails, searchParams]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const payload = {
        grade: Number(ballValue || 0),
        title: checkComment ? String(checkComment) : "Tekshirildi",
        homework_answer_id: Number(detail?.id || resultId),
      };
      await api.post(\`/group/\${id}/homework/\${homeworkId}/check\`, payload);
      router.push(\`\${basePath}/\${id}/homework/\${homeworkId}/results?tab=\${searchParams.get('tab') || 'Kutayotganlar'}\`);
    } catch (err) {
      console.error("Error submitting check:", err);
      toast.error("Xatolik yuz berdi");`;

content = content.replace(/    \}\r?\n      toast\.error\("Xatolik yuz berdi"\);/, correctSubmit);

fs.writeFileSync('src/views/Groups/HomeworkResults/StudentHomeworkDetail.tsx', content);
