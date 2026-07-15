const header = document.getElementById('header');
let lastY = window.scrollY;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 20);
  if (y > lastY && y > 120) header.style.transform = 'translateY(-110%)';
  else header.style.transform = 'translateY(0)';
  lastY = y;
});

// Mobile menu
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger?.addEventListener('click', () => nav.classList.toggle('show'));
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('show')));

// Safe GSAP (only if loaded)
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
