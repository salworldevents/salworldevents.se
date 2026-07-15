// Lenis smooth scrolling
const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
function raf(t){ lenis.raf(t); requestAnimationFrame(raf); } requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);

// Header behavior (scroll direction)
let lastY = window.scrollY;
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 30);
  if (y > lastY && y > 120) header.style.transform = 'translateY(-110%)';
  else header.style.transform = 'translateY(0)';
  lastY = y;
});

// Hero letter split animation
const title = document.querySelector('.split-chars');
title.innerHTML = title.textContent.split('').map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('');
gsap.from('.split-chars span',{y:80,opacity:0,stagger:0.03,duration:1.1,ease:'power3.out'});
gsap.from('.hero-subtitle,.hero-cta',{y:30,opacity:0,duration:1,stagger:0.2,delay:0.6});

// Hero slow zoom
gsap.to('.hero-video',{scale:1.14,duration:14,repeat:-1,yoyo:true,ease:'sine.inOut'});

// Reveal on scroll
gsap.utils.toArray('.reveal').forEach(el=>{
  gsap.from(el,{opacity:0,y:40,duration:.9,scrollTrigger:{trigger:el,start:'top 85%'}});
});

// Counter animation
document.querySelectorAll('[data-count]').forEach(el=>{
  const target = +el.dataset.count;
  ScrollTrigger.create({
    trigger: el, start: 'top 90%',
    onEnter: () => {
      gsap.fromTo(el,{innerText:0},{innerText:target,duration:1.8,roundProps:'innerText'});
    }, once:true
  });
});

// Services
const services = [
"Wedding Planning","Birthday Events","Engagements","Henna","Corporate Events","Luxury Catering",
"Drink Bar","Dessert Bar","Kids Entertainment","Luxury Decoration","Sound & Lighting","Photography",
"Videography","DJ","Luxury Rentals"
];
const serviceGrid = document.getElementById('serviceGrid');
services.forEach(s=>{
  const card=document.createElement('article');
  card.className='service-card reveal';
  card.innerHTML=`<h3>${s}</h3>`;
  serviceGrid.appendChild(card);
});

// Gallery
const galleryData = [
  ['wedding','assets/g1.jpg'],['birthday','assets/g2.jpg'],['henna','assets/g3.jpg'],
  ['corporate','assets/g4.jpg'],['dessert','assets/g5.jpg'],['decorations','assets/g6.jpg'],
  ['videos','assets/g7.jpg'],['wedding','assets/g8.jpg'],['birthday','assets/g9.jpg']
];
const masonry = document.getElementById('masonry');
function renderGallery(filter='all'){
  masonry.innerHTML='';
  galleryData.filter(([cat])=>filter==='all'||cat===filter).forEach(([cat,src])=>{
    const item=document.createElement('div');
    item.className='masonry-item';
    item.innerHTML=`<img loading="lazy" src="${src}" alt="${cat}">`;
    masonry.appendChild(item);
  });
}
renderGallery();
document.querySelectorAll('.filter-buttons button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelector('.filter-buttons .active')?.classList.remove('active');
    btn.classList.add('active');
    renderGallery(btn.dataset.filter);
  });
});

// Booking form
const bookingForm = document.getElementById('bookingForm');
const formSuccess = document.getElementById('formSuccess');
bookingForm.addEventListener('submit', e=>{
  e.preventDefault();
  formSuccess.style.display='block';
  gsap.fromTo(formSuccess,{opacity:0,y:10},{opacity:1,y:0,duration:.5});
  bookingForm.reset();
});

// Mobile nav
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', ()=> nav.classList.toggle('show'));
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('show')));
