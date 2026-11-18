document.addEventListener('DOMContentLoaded', () => {
  const root = document.body.dataset.root || './';
  const currentPage = document.body.dataset.page || 'home';

  const navItems = [
    { id: 'home', label: 'الصفحة الرئيسية', href: `${root}index.html` },
    { id: 'basics', label: 'أساسيات المشروع', href: `${root}pages/basics.html` },
    { id: 'concept', label: 'مفهوم المشروع', href: `${root}pages/concept.html` },
    { id: 'components', label: 'مكونات المحتوى', href: `${root}pages/components.html` },
    { id: 'activities', label: 'ركن الطفل التفاعلي', href: `${root}pages/activities.html` },
    { id: 'models', label: 'بعض النماذج', href: `${root}pages/models.html` },
    { id: 'resources', label: 'المصادر', href: `${root}pages/resources.html` },
    { id: 'rubric', label: 'سلم التقييم', href: `${root}pages/rubric.html` }
  ];

  // 1. Inject Accessibility Bar + Navbar
  const headerContainer = document.getElementById('site-header');
  if (headerContainer) {
    const linksHtml = navItems
      .map(
        (item) =>
          `<li><a href="${item.href}" class="${item.id === currentPage ? 'active' : ''}">${item.label}</a></li>`
      )
      .join('');

    headerContainer.innerHTML = `
      <div class="a11y-bar">
        <div class="a11y-inner">
          <span>أدوات سهولة الوصول والدعم السمعي:</span>
          <div class="a11y-controls">
            <button type="button" class="a11y-btn" id="btn-font-up" aria-label="تكبير الخط">تكبير الخط +</button>
            <button type="button" class="a11y-btn" id="btn-font-down" aria-label="تصغير الخط">تصغير الخط -</button>
            <button type="button" class="a11y-btn" id="btn-contrast">تباين عالٍ</button>
            <button type="button" class="a11y-btn" id="btn-read-page">🔊 استماع للصفحة</button>
          </div>
        </div>
      </div>
      <nav class="site-nav" aria-label="التنقل الرئيسي">
        <div class="nav-inner">
          <a href="${root}index.html" class="brand">
            <span class="brand-badge">EDU 314</span>
            <span>تكنولوجيا الطفل</span>
          </a>
          <button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false">القائمة ☰</button>
          <ul class="nav-links" id="nav-links">${linksHtml}</ul>
        </div>
      </nav>
    `;
  }

  // 2. Inject Consistent Bottom Navigation (on subpages) + Footer + Safe Link Modal
  const bottomNav = document.getElementById('page-bottom-nav');
  if (bottomNav) {
    bottomNav.innerHTML = `
      <a href="${root}index.html" class="btn btn-outline">🏠 العودة إلى الصفحة الرئيسية</a>
      <a href="${root}pages/basics.html" class="btn btn-mint">📂 العودة إلى أساسيات المشروع</a>
    `;
  }

  const footerContainer = document.getElementById('site-footer');
  if (footerContainer) {
    footerContainer.innerHTML = `
      <footer class="site-footer">
        <p>مشروع مقرر EDU 314: تكنولوجيا الطفل • نسخة مطوّرة وفق معايير التصميم التعليمي وإمكانية الوصول</p>
      </footer>
      <div class="modal-backdrop" id="external-modal" role="dialog" aria-modal="true" aria-labelledby="ext-title">
        <div class="modal-box">
          <div class="modal-header">
            <h3 id="ext-title">تنبيه انتقال إلى موقع خارجي</h3>
            <button type="button" class="btn btn-outline" id="ext-close" style="min-height:38px;padding:0.3rem 0.7rem;">✕</button>
          </div>
          <p>أنت على وشك الانتقال إلى رابط خارجي. يُنصح بإشراف المعلمة أو ولي الأمر عند فتح الروابط الخارجية للأطفال.</p>
          <p id="ext-url-preview" style="margin-top:0.5rem;font-size:0.85rem;color:var(--text-muted);word-break:break-all;"></p>
          <div class="btn-group">
            <a href="#" target="_blank" rel="noopener noreferrer" class="btn btn-mint" id="ext-confirm">متابعة الفتح</a>
            <button type="button" class="btn btn-outline" id="ext-cancel">البقاء في الموقع</button>
          </div>
        </div>
      </div>
    `;
  }

  // 3. Mobile Menu Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const expanded = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', expanded);
    });
  }

  // 4. Font Size & Contrast Controls (Persisted)
  let fontSize = parseInt(localStorage.getItem('edu314_fontSize') || '17', 10);
  const applyFont = () => {
    document.documentElement.style.setProperty('--base-font-size', `${fontSize}px`);
    localStorage.setItem('edu314_fontSize', fontSize);
  };
  applyFont();

  document.getElementById('btn-font-up')?.addEventListener('click', () => {
    if (fontSize < 24) { fontSize += 2; applyFont(); }
  });
  document.getElementById('btn-font-down')?.addEventListener('click', () => {
    if (fontSize > 14) { fontSize -= 2; applyFont(); }
  });

  if (localStorage.getItem('edu314_contrast') === 'true') {
    document.body.classList.add('high-contrast');
  }
  document.getElementById('btn-contrast')?.addEventListener('click', () => {
    const active = document.body.classList.toggle('high-contrast');
    localStorage.setItem('edu314_contrast', active);
  });

  // 5. Arabic Read-Aloud Helper (Web Speech API)
  window.speakArabic = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('متصفحك لا يدعم القراءة الصوتية التلقائية.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  };

  document.getElementById('btn-read-page')?.addEventListener('click', () => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      window.speakArabic(mainEl.innerText.slice(0, 600));
    }
  });

  // 6. Safe External Link Guard
  const extModal = document.getElementById('external-modal');
  const extConfirm = document.getElementById('ext-confirm');
  const extPreview = document.getElementById('ext-url-preview');

  document.querySelectorAll('a[data-external="true"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (extModal && extConfirm && extPreview) {
        extConfirm.href = link.href;
        extPreview.textContent = link.href;
        extModal.classList.add('open');
      }
    });
  });

  const closeExt = () => extModal?.classList.remove('open');
  document.getElementById('ext-close')?.addEventListener('click', closeExt);
  document.getElementById('ext-cancel')?.addEventListener('click', closeExt);
  extConfirm?.addEventListener('click', closeExt);
});