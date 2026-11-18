document.addEventListener('DOMContentLoaded', () => {
  const rows = document.querySelectorAll('.rubric-row');
  const totalDisplay = document.getElementById('rubric-total');
  const statusDisplay = document.getElementById('rubric-status');

  const updateScore = () => {
    let total = 0;
    let answered = 0;

    rows.forEach((row) => {
      const selected = row.querySelector('.rubric-option.selected');
      if (selected) {
        total += Number(selected.dataset.score);
        answered++;
      }
    });

    const maxScore = rows.length * 4;
    totalDisplay.textContent = `${total} / ${maxScore}`;

    if (answered < rows.length) {
      statusDisplay.textContent = `تم تقييم ${answered} من ${rows.length} معايير.`;
    } else if (total >= 17) {
      statusDisplay.textContent = 'التقدير: ممتاز — الموقع جاهز ومطابق لمعايير الجودة التربوية والفنية!';
    } else if (total >= 13) {
      statusDisplay.textContent = 'التقدير: جيد جداً — يحتاج إلى تعديلات بسيطة في بعض الجوانب.';
    } else {
      statusDisplay.textContent = 'التقدير: يحتاج إلى تحسين — يُنصح بمراجعة المعايير ذات الدرجات المنخفضة.';
    }
  };

  rows.forEach((row) => {
    const options = row.querySelectorAll('.rubric-option');
    options.forEach((cell) => {
      cell.addEventListener('click', () => {
        options.forEach((c) => c.classList.remove('selected'));
        cell.classList.add('selected');
        updateScore();
      });
    });
  });

  document.getElementById('btn-reset-rubric')?.addEventListener('click', () => {
    document.querySelectorAll('.rubric-option.selected').forEach((c) => c.classList.remove('selected'));
    updateScore();
  });
});