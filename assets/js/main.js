// SALWORLD EVENTS - Main interactions

// 1) Dynamic year
document.getElementById("year").textContent = new Date().getFullYear();

// 2) Sticky header on scroll
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 30);
});

// 3) Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

navToggle.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
});

// Close nav when clicking link (mobile UX)
navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// 4) Scroll reveal animations
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => io.observe(el));

// 5) Gallery lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const galleryItems = document.querySelectorAll(".gallery-item");

galleryItems.forEach(item => {
  item.addEventListener("click", () => {
    const src = item.getAttribute("data-src");
    lightboxImage.src = src;
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// 6) Testimonials slider
const testimonials = document.querySelectorAll(".testimonial");
const prevBtn = document.getElementById("prevTestimonial");
const nextBtn = document.getElementById("nextTestimonial");
let current = 0;

function showTestimonial(index) {
  testimonials.forEach((t, i) => t.classList.toggle("active", i === index));
}
function nextTestimonial() {
  current = (current + 1) % testimonials.length;
  showTestimonial(current);
}
function prevTestimonial() {
  current = (current - 1 + testimonials.length) % testimonials.length;
  showTestimonial(current);
}

nextBtn.addEventListener("click", nextTestimonial);
prevBtn.addEventListener("click", prevTestimonial);

// Auto play every 6 seconds
setInterval(nextTestimonial, 6000);

// 7) Contact form demo handler
const form = document.querySelector(".contact-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Tack! Din förfrågan har skickats. Vi kontaktar dig snart.");
  form.reset();
});
