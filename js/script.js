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

function injectGlobalLuxuryElements() {
  if (!document.body) return;

  const isKontaktPage = window.location.pathname.endsWith('contact.html') ||
                        (window.location.pathname === '/' && document.title.toLowerCase().includes('kontakt'));

  if (isKontaktPage && !document.querySelector('.sal-floating-whatsapp')) {
    const whatsapp = document.createElement('a');
    whatsapp.className = 'sal-floating-whatsapp';
    whatsapp.href = 'https://wa.me/46707117795';
    whatsapp.target = '_blank';
    whatsapp.rel = 'noopener noreferrer';
    whatsapp.setAttribute('aria-label', 'Kontakta oss på WhatsApp');
    whatsapp.innerHTML = `
      <span class="sal-whatsapp-icon" aria-hidden="true">
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.1 3.2A12.7 12.7 0 0 0 5.4 22.6L3 29l6.6-2.3a12.8 12.8 0 1 0 6.5-23.5Zm0 23.2a10.5 10.5 0 0 1-5.4-1.5l-.4-.2-3.9 1.4 1.4-3.8-.2-.4a10.6 10.6 0 1 1 8.5 4.5Zm5.8-7.8c-.3-.2-1.9-.9-2.1-1-.3-.1-.5-.2-.7.2l-.8 1c-.2.2-.4.2-.7.1a8.6 8.6 0 0 1-2.5-1.6 9.3 9.3 0 0 1-1.7-2.2c-.2-.3 0-.4.1-.6l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.2c-.2-.4-.4-.4-.7-.4h-.6c-.2 0-.6 0-.9.4-.3.3-1.2 1.1-1.2 2.8 0 1.6 1.2 3.1 1.4 3.3.1.2 2.3 3.5 5.5 5 .8.4 1.4.6 1.9.8.8.2 1.5.2 2 .1.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4Z"/>
        </svg>
      </span>
      <span class="sal-whatsapp-text">WhatsApp</span>
    `;
    document.body.appendChild(whatsapp);
  }

  if (!document.querySelector('.sal-site-footer')) {
    const footer = document.createElement('footer');
    footer.className = 'sal-site-footer';
    footer.innerHTML = `
      <div class="container sal-footer-grid">
        <div class="sal-footer-brand">
          <img src="images/Sallogo.png.PNG" alt="SÀLWORLD EVENTS logotyp" class="sal-footer-logo">
          <p>Vi skapar exklusiva och minnesvärda evenemang med elegans, värme och precision.</p>
        </div>
        <div class="sal-footer-col">
          <h3>Snabblänkar</h3>
          <ul>
            <li><a href="index.html">Hem</a></li>
            <li><a href="about.html">Om Oss</a></li>
            <li><a href="tjanster.html">Tjänster</a></li>
            <li><a href="salcups.html">SÀL CUPS</a></li>
            <li><a href="gallery.html">Galleri</a></li>
            <li><a href="contact.html">Kontakt</a></li>
          </ul>
        </div>
        <div class="sal-footer-col">
          <h3>Kontaktinformation</h3>
          <ul>
            <li><a href="mailto:info@salworldevents.se">info@salworldevents.se</a></li>
            <li><a href="tel:+46707117795">+46 70 711 77 95</a></li>
            <li>Sverige</li>
          </ul>
        </div>
        <div class="sal-footer-col">
          <h3>Sociala medier</h3>
          <ul>
            <li><a href="https://www.instagram.com/salworldevents?igsh=MTI5azYwdWltamZhMQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://www.facebook.com/share/1F4LNUwGtr/" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://www.tiktok.com/@salworldevents?_r=1&_t=ZN-984isSbvLLa" target="_blank" rel="noopener noreferrer">TikTok</a></li>
            <li><a href="#">Integritetspolicy</a></li>
            <li><a href="#">Villkor</a></li>
          </ul>
        </div>
      </div>
      <div class="sal-footer-bottom">
        <div class="container">
          <p>© 2026 SÀLWORLD EVENTS. All Rights Reserved.</p>
        </div>
      </div>
    `;

    const footerLogo = footer.querySelector('.sal-footer-logo');
    footerLogo?.addEventListener('error', () => {
      footerLogo.src = 'images/logo.png';
    }, { once: true });

    document.body.appendChild(footer);
  }
}

injectGlobalLuxuryElements();
