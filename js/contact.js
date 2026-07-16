/**
 * contact.js — Booking modal + scroll-reveal for contact.html
 * SALWORLD EVENTS
 *
 * Booking storage: localStorage (client-side).
 * TODO: Replace localStorage with a real backend / Google Calendar API
 *       to persist bookings across devices and enable admin management.
 *
 * Email sending:
 * - Contact form uses FormSubmit.co (no backend needed).
 * - Booking confirmations: wire BOOKING_EMAIL_ENDPOINT to your backend
 *   or an email service (e.g., EmailJS, SendGrid serverless function).
 */

/* ── Constants ──────────────────────────────────────────────── */

const BOOKING_EMAIL_ENDPOINT = ''; // TODO: set your backend/EmailJS endpoint
const STORAGE_KEY = 'salworld_bookings';
const AVAILABLE_TIMES = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

const SWEDISH_MONTHS = [
    'Januari','Februari','Mars','April','Maj','Juni',
    'Juli','Augusti','September','Oktober','November','December'
];

const SWEDISH_DAYS_SHORT = ['Mån','Tis','Ons','Tor','Fre','Lör','Sön'];

/* ── State ──────────────────────────────────────────────────── */

let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth();
let selectedDate = null;  // 'YYYY-MM-DD'
let selectedTime = null;  // 'HH:MM'

/* ── Helpers ────────────────────────────────────────────────── */

function getBookings() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
        return {};
    }
}

function saveBooking(dateStr, timeStr, details) {
    const b = getBookings();
    if (!b[dateStr]) b[dateStr] = {};
    b[dateStr][timeStr] = details;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(b));
}

function isTimeBooked(dateStr, timeStr) {
    const b = getBookings();
    return !!(b[dateStr] && b[dateStr][timeStr]);
}

function isDateFullyBooked(dateStr) {
    const b = getBookings();
    if (!b[dateStr]) return false;
    return AVAILABLE_TIMES.every(t => b[dateStr][t]);
}

function pad2(n) {
    return String(n).padStart(2, '0');
}

function formatDateSv(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return `${d} ${SWEDISH_MONTHS[m - 1]} ${y}`;
}

/* ── Calendar ───────────────────────────────────────────────── */

function renderCalendar() {
    const grid = document.getElementById('cal-grid');
    const label = document.getElementById('cal-month-year');
    if (!grid || !label) return;

    label.textContent = `${SWEDISH_MONTHS[calMonth]} ${calYear}`;

    // Remove old day cells (keep the 7 day-name headers)
    const dayNames = Array.from(grid.querySelectorAll('.cal-day-name'));
    grid.innerHTML = '';
    dayNames.forEach(d => grid.appendChild(d));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // First day of month (0=Sun … 6=Sat). Convert to Mon-first (0=Mon … 6=Sun)
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const offset = (firstDay + 6) % 7; // Mon-first offset

    // Empty cells before first day
    for (let i = 0; i < offset; i++) {
        const empty = document.createElement('div');
        empty.className = 'cal-day empty';
        grid.appendChild(empty);
    }

    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'cal-day';
        cell.textContent = day;

        const date = new Date(calYear, calMonth, day);
        const dateStr = `${calYear}-${pad2(calMonth + 1)}-${pad2(day)}`;

        if (date < today) {
            cell.classList.add('past');
        } else if (isDateFullyBooked(dateStr)) {
            cell.classList.add('booked');
            cell.title = 'Fullt bokat';
        } else {
            if (date.getTime() === today.getTime()) cell.classList.add('today');
            if (selectedDate === dateStr) cell.classList.add('selected');

            cell.addEventListener('click', () => {
                selectedDate = dateStr;
                document.getElementById('step1-next').disabled = false;
                renderCalendar(); // re-render to update selection highlight
            });
        }

        grid.appendChild(cell);
    }
}

/* ── Time Slots ─────────────────────────────────────────────── */

function renderTimeSlots() {
    const container = document.getElementById('time-slots-container');
    const display   = document.getElementById('selected-date-display');
    if (!container || !selectedDate) return;

    display.textContent = `Tillgängliga tider — ${formatDateSv(selectedDate)}`;
    container.innerHTML = '';
    selectedTime = null;
    document.getElementById('step2-next').disabled = true;

    AVAILABLE_TIMES.forEach(t => {
        const btn = document.createElement('div');
        btn.className = 'time-slot';
        btn.textContent = t;

        if (isTimeBooked(selectedDate, t)) {
            btn.classList.add('booked-slot');
            btn.title = 'Redan bokad';
        } else {
            btn.addEventListener('click', () => {
                selectedTime = t;
                container.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected-slot'));
                btn.classList.add('selected-slot');
                document.getElementById('step2-next').disabled = false;
            });
        }

        container.appendChild(btn);
    });
}

/* ── Steps navigation ───────────────────────────────────────── */

function goToStep(step) {
    document.querySelectorAll('.booking-panel').forEach((p, i) => {
        p.classList.toggle('active', i + 1 === step);
    });
    document.querySelectorAll('.booking-step-tab').forEach((t, i) => {
        t.classList.remove('active', 'done');
        if (i + 1 === step) t.classList.add('active');
        if (i + 1 < step) t.classList.add('done');
    });

    if (step === 2) renderTimeSlots();

    if (step === 3) {
        document.getElementById('booking-summary-date').textContent = formatDateSv(selectedDate);
        document.getElementById('booking-summary-time').textContent = selectedTime;
    }
}

/* ── Booking form submit ─────────────────────────────────────── */

function handleBookingSubmit(e) {
    e.preventDefault();

    const name  = document.getElementById('b-name').value.trim();
    const email = document.getElementById('b-email').value.trim();
    const phone = document.getElementById('b-phone').value.trim();
    const type  = document.getElementById('b-type').value;
    const msg   = document.getElementById('b-msg').value.trim();

    if (!name || !email) return;

    // Mark slot as booked in localStorage
    saveBooking(selectedDate, selectedTime, { name, email, phone, type, msg });

    // Populate confirmation
    document.getElementById('conf-date').textContent  = formatDateSv(selectedDate);
    document.getElementById('conf-time').textContent  = selectedTime;
    document.getElementById('conf-name').textContent  = name;
    document.getElementById('conf-email').textContent = email;

    // Send booking details to owner via FormSubmit (if endpoint set)
    sendBookingEmail({ name, email, phone, type, msg, date: selectedDate, time: selectedTime });

    goToStep(4);
}

/* ── Email sender (FormSubmit fetch) ─────────────────────────── */

function sendBookingEmail(data) {
    // Method 1: POST to a backend/serverless endpoint
    if (BOOKING_EMAIL_ENDPOINT) {
        fetch(BOOKING_EMAIL_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: 'info@salworldevents.se',
                subject: `Ny konsultationsbokning — ${data.date} kl ${data.time}`,
                ...data
            })
        }).catch(() => { /* silent fail – booking is still stored locally */ });
        return;
    }

    // Method 2: Fallback — open mailto (works without backend).
    // The mailto URL is constructed below but intentionally not triggered
    // to avoid interrupting the UX; the confirmation modal is already shown.
    // Uncomment the window.location line below to activate it.
    const mailtoSubject = encodeURIComponent(`Ny konsultationsbokning — ${data.date} kl ${data.time}`);
    const mailtoBody = encodeURIComponent(
        `Ny konsultationsbokning\n\n` +
        `Namn: ${data.name}\n` +
        `E-post: ${data.email}\n` +
        `Telefon: ${data.phone || '—'}\n` +
        `Evenemangstyp: ${data.type || '—'}\n` +
        `Datum: ${formatDateSv(data.date)}\n` +
        `Tid: ${data.time}\n` +
        `Meddelande: ${data.msg || '—'}`
    );
    // window.location.href = `mailto:info@salworldevents.se?subject=${mailtoSubject}&body=${mailtoBody}`;
    void mailtoSubject; void mailtoBody;
}

/* ── Open / close modal ─────────────────────────────────────── */

function openBooking() {
    // Reset state
    selectedDate = null;
    selectedTime = null;

    calYear  = new Date().getFullYear();
    calMonth = new Date().getMonth();

    goToStep(1);
    renderCalendar();

    document.getElementById('step1-next').disabled = true;
    document.getElementById('step2-next').disabled = true;

    document.getElementById('booking-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeBooking() {
    document.getElementById('booking-overlay').classList.remove('open');
    document.body.style.overflow = '';
}

/* ── Success banner on form redirect ───────────────────────── */

function checkFormSuccess() {
    if (new URLSearchParams(window.location.search).get('skickat') === '1') {
        const banner = document.getElementById('form-success');
        const form   = document.getElementById('contact-form');
        if (banner) banner.style.display = 'block';
        if (form)   form.style.display   = 'none';
        // Clean URL
        history.replaceState({}, '', window.location.pathname);
    }
}

/* ── Scroll-reveal ──────────────────────────────────────────── */

function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
}

/* ── Init ───────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

    checkFormSuccess();
    initReveal();

    // Calendar navigation
    document.getElementById('cal-prev')?.addEventListener('click', () => {
        calMonth--;
        if (calMonth < 0) { calMonth = 11; calYear--; }
        renderCalendar();
    });

    document.getElementById('cal-next')?.addEventListener('click', () => {
        calMonth++;
        if (calMonth > 11) { calMonth = 0; calYear++; }
        renderCalendar();
    });

    // Step 1 → 2
    document.getElementById('step1-next')?.addEventListener('click', () => goToStep(2));

    // Step 2 → 3 / back
    document.getElementById('step2-next')?.addEventListener('click', () => goToStep(3));
    document.getElementById('step2-back')?.addEventListener('click', () => goToStep(1));

    // Step 3 → back
    document.getElementById('step3-back')?.addEventListener('click', () => goToStep(2));

    // Booking form submit
    document.getElementById('booking-form')?.addEventListener('submit', handleBookingSubmit);

    // Open buttons
    document.getElementById('open-booking')?.addEventListener('click', openBooking);

    // Close buttons
    document.getElementById('close-booking')?.addEventListener('click', closeBooking);
    document.getElementById('close-booking-final')?.addEventListener('click', closeBooking);

    // Click outside modal
    document.getElementById('booking-overlay')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeBooking();
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeBooking();
    });
});
