const header = document.getElementById('header');
let lastY = window.scrollY;

if (header) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 20);
    if (y > lastY && y > 120) header.style.transform = 'translateY(-110%)';
    else header.style.transform = 'translateY(0)';
    lastY = y;
  });
}

// Mobile menu
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger?.addEventListener('click', () => nav.classList.toggle('show'));
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('show')));

// Language switcher
const languageToggle = document.getElementById('language-toggle');
const translatableElements = document.querySelectorAll('[data-sv][data-en]');
const defaultLang = 'sv';

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  document.body.dataset.lang = lang;

  translatableElements.forEach((element) => {
    element.innerHTML = element.dataset[lang];
  });

  if (languageToggle) {
    languageToggle.textContent = lang === 'sv' ? 'EN' : 'SV';
    languageToggle.setAttribute('aria-label', lang === 'sv' ? 'Switch to English' : 'Byt till svenska');
  }
}

applyLanguage(defaultLang);

languageToggle?.addEventListener('click', () => {
  const nextLang = document.body.dataset.lang === 'sv' ? 'en' : 'sv';
  applyLanguage(nextLang);
});

// Timeline scroll-reveal
(function () {
  const steps = document.querySelectorAll('.timeline-step');
  if (!steps.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  steps.forEach(step => observer.observe(step));
}());
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  const title = document.querySelector('.split-chars');
  if (title) {
    title.innerHTML = title.textContent.split('').map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('');
    gsap.from('.split-chars span', { y: 60, opacity: 0, stagger: 0.03, duration: 1, ease: 'power3.out' });
  }

  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });
}
