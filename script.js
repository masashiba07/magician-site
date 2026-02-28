/* ===========================
   マジックまぁちゃん - JavaScript
   =========================== */

// ===========================
// 星フィールド（Canvas）
// ===========================
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x:        Math.random() * canvas.width,
        y:        Math.random() * canvas.height,
        r:        Math.random() * 1.5 + 0.3,
        opacity:  Math.random(),
        speed:    Math.random() * 0.3 + 0.05,
        twinkle:  Math.random() * Math.PI * 2,
        color:    Math.random() > 0.85
                    ? `hsl(${Math.random() > 0.5 ? 50 : 280}, 100%, 80%)`
                    : '#ffffff',
      });
    }
  }

  function drawStars(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.twinkle += 0.02;
      const alpha = (Math.sin(s.twinkle) * 0.4 + 0.6) * s.opacity;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;
      ctx.shadowBlur  = s.r > 1.2 ? 6 : 2;
      ctx.shadowColor = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(drawStars);
  }

  resize();
  createStars(220);
  requestAnimationFrame(drawStars);

  window.addEventListener('resize', () => {
    resize();
    createStars(220);
  });
})();

// ===========================
// パーティクル（金の光の粒）
// ===========================
(function initParticles() {
  const container = document.getElementById('particles');
  const colors = ['#f0c040', '#ffd700', '#e040fb', '#9b30ff', '#ffffff'];

  function spawnParticle() {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 5 + 2;
    const duration = Math.random() * 10 + 8;
    const delay = Math.random() * 6;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      box-shadow: 0 0 ${size * 2}px currentColor;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), (duration + delay) * 1000);
  }

  for (let i = 0; i < 30; i++) spawnParticle();
  setInterval(spawnParticle, 600);
})();

// ===========================
// ナビゲーション
// ===========================
const navbar = document.querySelector('.navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// ナビリンクをクリックしたらメニューを閉じる
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===========================
// スクロールアニメーション（IntersectionObserver）
// ===========================
function addFadeIn(selector) {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('fade-in');
  });
}
addFadeIn('.show-card');
addFadeIn('.gallery-item');
addFadeIn('.testimonial-card');
addFadeIn('.stat-card');
addFadeIn('.about-text');
addFadeIn('.contact-info');
addFadeIn('.contact-form');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ===========================
// カウントアップアニメーション
// ===========================
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

// ===========================
// スキルバーアニメーション
// ===========================
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.classList.add('animated');
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.querySelector('.skills');
if (skillsSection) skillObserver.observe(skillsSection);

// ===========================
// ショーカード（モバイル用タップ）
// ===========================
document.querySelectorAll('.show-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

// ===========================
// クリック時の魔法スパークル
// ===========================
document.addEventListener('click', function(e) {
  createSparkle(e.clientX, e.clientY);
});

function createSparkle(x, y) {
  const count = 8;
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.textContent = ['✦','✧','★','✨','⭐'][Math.floor(Math.random() * 5)];
    const angle  = (360 / count) * i + Math.random() * 20;
    const dist   = Math.random() * 60 + 40;
    const duration = Math.random() * 600 + 500;
    const size   = Math.random() * 12 + 10;

    span.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: ${size}px;
      color: ${['#f0c040','#ffd700','#e040fb','#ffffff'][Math.floor(Math.random() * 4)]};
      pointer-events: none;
      z-index: 9999;
      user-select: none;
      animation: none;
      transform: translate(-50%, -50%);
      text-shadow: 0 0 8px currentColor;
    `;
    document.body.appendChild(span);

    const rad = (angle * Math.PI) / 180;
    const dx  = Math.cos(rad) * dist;
    const dy  = Math.sin(rad) * dist;

    span.animate([
      { transform: `translate(-50%, -50%) scale(0)`,           opacity: 1 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1)`, opacity: 1, offset: 0.3 },
      { transform: `translate(calc(-50% + ${dx * 1.5}px), calc(-50% + ${dy * 1.5}px)) scale(0.5)`, opacity: 0 },
    ], { duration, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' })
      .finished.then(() => span.remove());
  }
}

// ===========================
// フォーム送信
// ===========================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type=submit]');
    const original = btn.innerHTML;
    btn.innerHTML = '✨ 送信しました！ありがとうございます！';
    btn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    btn.disabled = true;

    // 魔法エフェクトを出す
    const rect = btn.getBoundingClientRect();
    createSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2);

    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });
}

// ===========================
// スムーズスクロールのアクティブリンク
// ===========================
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? '#f0c040' : '';
  });
}, { passive: true });

// ===========================
// ヒーロー視差効果（軽量）
// ===========================
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && y < window.innerHeight) {
    heroBg.style.transform = `translateY(${y * 0.3}px)`;
  }
}, { passive: true });

// ===========================
// ギャラリーホバー時のパーティクル
// ===========================
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mouseenter', function(e) {
    const rect = item.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    for (let i = 0; i < 5; i++) {
      setTimeout(() => createSparkle(cx + (Math.random()-0.5)*rect.width*0.8, cy + (Math.random()-0.5)*rect.height*0.8), i * 80);
    }
  });
});
