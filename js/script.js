const header = document.querySelector(".header");
const heroContent = document.querySelector(".hero-content");
const heroVideo = document.querySelector(".hero-video");
const heroOverlay = document.querySelector(".hero-overlay");

window.addEventListener("scroll", () => {

    const scroll = window.scrollY;

    if (scroll > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

    if (heroContent) {
        heroContent.style.opacity = 1 - scroll / 300;
        heroContent.style.transform =
            translateY(${scroll * 0.35}px) scale(${1 - scroll * 0.0007});
    }

    if (heroVideo) {
        heroVideo.style.transform =
            translate(-50%, -50%) scale(${1 + scroll * 0.00055});
    }

    if (heroOverlay) {
        heroOverlay.style.background =
            rgba(75,31,46,${0.30 + scroll * 0.0012});
    }

});

const about = document.querySelector(".about");

if (about) {

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }

        });

    }, {
        threshold: 0.3
    });

    observer.observe(about);

}

const counters = document.querySelectorAll(".counter");

function startCounters() {

    counters.forEach(counter => {

        const target = Number(counter.dataset.target);

        let count = 0;

        const update = () => {

            const increment = Math.ceil(target / 80);

            count += increment;

            if (count >= target) {
                counter.innerText = target;
            } else {
                counter.innerText = count;
                requestAnimationFrame(update);
            }

        };

        update();

    });

}

const stats = document.querySelector(".about-stats");

let started = false;

if (stats) {

    const observer2 = new IntersectionObserver((entries) => {

        if (entries[0].isIntersecting && !started) {

            started = true;
            startCounters();

        }

    }, {
        threshold: 0.5
    });

    observer2.observe(stats);

}
