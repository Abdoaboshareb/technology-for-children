document.addEventListener('DOMContentLoaded', () => {
  const questions = {
    1: [
      {
        prompt: 'أي أداة نستخدمها لنلتقط صورة جميلة في رحلة الروضة؟',
        hint: 'تلميح: هذه الأداة لها عدسة صغيرة وتصدر صوت "تشك" عند التصوير!',
        correct: 'camera',
        options: [
          { id: 'camera', icon: '📷', label: 'الكاميرا' },
          { id: 'headphones', icon: '🎧', label: 'سماعة الأذن' },
          { id: 'printer', icon: '🖨️', label: 'الطابعة' }
        ]
      },
      {
        prompt: 'أي أداة نضعها على الأذن لنسمع القصة بصوت هادئ دون إزعاج أصدقائنا؟',
        hint: 'تلميح: نضعها فوق أذنينا لنستمع للموسيقى أو القصص الصوتية.',
        correct: 'headphones',
        options: [
          { id: 'mouse', icon: '🖱️', label: 'الفأرة' },
          { id: 'headphones', icon: '🎧', label: 'سماعة الأذن' },
          { id: 'camera', icon: '📷', label: 'الكاميرا' }
        ]
      },
      {
        prompt: 'كيف نستخدم الجهاز اللوحي (التابلت) بطريقة آمنة وصحية؟',
        hint: 'تلميح: تذكر نصيحة المعلمة عن راحة العينين وطلب الإذن.',
        correct: 'safe',
        options: [
          { id: 'safe', icon: '✅', label: 'بإذن المعلمة ولوقت قصير' },
          { id: 'long', icon: '🌙', label: 'طوال الليل قبل النوم' },
          { id: 'eat', icon: '🧃', label: 'بجانب العصير والماء' }
        ]
      }
    ],
    2: [
      {
        prompt: 'نريد كتابة اسمنا على الحاسوب. أي أداة نضغط على حروفها؟',
        hint: 'تلميح: تحتوي على أزرار كثيرة فيها الحروف والأرقام.',
        correct: 'keyboard',
        options: [
          { id: 'keyboard', icon: '⌨️', label: 'لوحة المفاتيح' },
          { id: 'camera', icon: '📷', label: 'الكاميرا' },
          { id: 'mic', icon: '🎤', label: 'الميكروفون' }
        ]
      },
      {
        prompt: 'إذا رأينا رسالة أو صورة غير مألوفة على الشاشة، ماذا نفعل؟',
        hint: 'تلميح: الكبار يساعدوننا على البقاء آمنين.',
        correct: 'tell_adult',
        options: [
          { id: 'click', icon: '👆', label: 'نضغط عليها بسرعة' },
          { id: 'tell_adult', icon: '👩‍🏫', label: 'نخبر المعلمة أو الوالدين فوراً' },
          { id: 'hide', icon: '🙈', label: 'نغلق الشاشة دون إخبار أحد' }
        ]
      },
      {
        prompt: 'بعد الانتهاء من اللعب بالجهاز اللوحي، ما هو السلوك الأفضل؟',
        hint: 'تلميح: اللعب والحركة خارج الشاشة ينشطان جسمنا!',
        correct: 'play_real',
        options: [
          { id: 'play_real', icon: '🧩', label: 'نلعب بالمكعبات أو الرسم الواقعي' },
          { id: 'more', icon: '📱', label: 'نفتح جهازاً آخر فوراً' },
          { id: 'drop', icon: '💥', label: 'نترك الجهاز مفتوحاً على الأرض' }
        ]
      }
    ]
  };

  let currentLevel = 1;
  let qIndex = 0;
  let stars = 0;

  const stepPills = document.querySelectorAll('.step-pill');
  const stepPanels = document.querySelectorAll('.step-panel');
  const mascotMsg = document.getElementById('mascot-message');

  const goToStep = (stepNum) => {
    stepPills.forEach((pill) => {
      const s = Number(pill.dataset.step);
      pill.classList.toggle('active', s === stepNum);
      if (s < stepNum) pill.classList.add('done');
    });
    stepPanels.forEach((panel) => {
      panel.classList.toggle('active', Number(panel.dataset.step) === stepNum);
    });

    if (stepNum === 1) mascotMsg.textContent = 'مرحباً يا بطل! اضغط على كل أداة لنتعرف عليها معاً.';
    if (stepNum === 2) {
      mascotMsg.textContent = 'الآن دورك! اختر الإجابة الصحيحة، ولا تقلق لو أخطأت؛ سأساعدك بتلميح!';
      renderQuestion();
    }
    if (stepNum === 3) {
      mascotMsg.textContent = `أحسنت يا مبدع! حصلت على ${stars} نجوم! هيا ننفذ نشاطاً حقيقياً بعيداً عن الشاشة.`;
      document.getElementById('final-stars').textContent = '⭐'.repeat(Math.max(1, stars));
    }
  };

  stepPills.forEach((pill) => {
    pill.addEventListener('click', () => goToStep(Number(pill.dataset.step)));
  });

  document.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => goToStep(Number(btn.dataset.goto)));
  });

  // Step 1: Clickable Watch Cards
  document.querySelectorAll('.learn-card').forEach((card) => {
    card.addEventListener('click', () => {
      const info = card.dataset.say;
      mascotMsg.textContent = info;
      if (window.speakArabic) window.speakArabic(info);
    });
  });

  // Step 2: Quiz Renderer with Gradual Hints & Retry
  const renderQuestion = () => {
    const list = questions[currentLevel];
    const q = list[qIndex];
    const qPrompt = document.getElementById('quiz-prompt');
    const qOptions = document.getElementById('quiz-options');
    const feedback = document.getElementById('quiz-feedback');
    const nextBtn = document.getElementById('btn-next-q');

    qPrompt.textContent = `السؤال ${qIndex + 1} من ${list.length}: ${q.prompt}`;
    feedback.className = 'feedback-banner';
    feedback.textContent = '';
    nextBtn.style.display = 'none';

    qOptions.innerHTML = q.options
      .map(
        (opt) => `
        <button type="button" class="choice-btn" data-id="${opt.id}">
          <span class="choice-icon">${opt.icon}</span>
          <span>${opt.label}</span>
        </button>`
      )
      .join('');

    qOptions.querySelectorAll('.choice-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.dataset.id === q.correct) {
          stars = Math.min(3, stars + 1);
          document.getElementById('stars-display').textContent = '⭐'.repeat(stars);
          feedback.className = 'feedback-banner success';
          feedback.textContent = 'أحسنت! إجابة رائعة 👏';
          if (window.speakArabic) window.speakArabic('أحسنت! إجابة رائعة');
          nextBtn.style.display = 'inline-flex';
        } else {
          feedback.className = 'feedback-banner hint';
          feedback.textContent = `${q.hint} (حاول مرة أخرى، أنا أثق بك!)`;
          if (window.speakArabic) window.speakArabic(q.hint);
        }
      });
    });
  };

  document.getElementById('btn-next-q')?.addEventListener('click', () => {
    const list = questions[currentLevel];
    if (qIndex < list.length - 1) {
      qIndex++;
      renderQuestion();
    } else {
      goToStep(3);
    }
  });

  document.getElementById('btn-restart')?.addEventListener('click', () => {
    qIndex = 0;
    stars = 0;
    document.getElementById('stars-display').textContent = '☆☆☆';
    goToStep(1);
  });

  document.getElementById('btn-mascot-speak')?.addEventListener('click', () => {
    if (window.speakArabic) window.speakArabic(mascotMsg.textContent);
  });

  // Teacher/Parent Mode & Level Switcher (Differentiation)
  const teacherToggle = document.getElementById('btn-teacher-mode');
  const teacherPanel = document.getElementById('teacher-panel');
  teacherToggle?.addEventListener('click', () => {
    teacherPanel?.classList.toggle('hidden');
  });

  document.getElementById('level-select')?.addEventListener('change', (e) => {
    currentLevel = Number(e.target.value);
    qIndex = 0;
    stars = 0;
    document.getElementById('stars-display').textContent = '☆☆☆';
    renderQuestion();
  });
});