/* ── Configuration ─────────────────────────────────────── */
const HERO_PHRASES = [
    "building at the edge of what AI can do.",
    "turning ideas into tools, one commit at a time.",
    "obsessed with software long before the LLM era.",
];
const NOW_COMMAND = "cd /Now";

/* ── Welcome overlay — remove from DOM after fade completes ── */
const overlay = document.getElementById('welcome-overlay');
if (overlay) {
    overlay.addEventListener('animationend', () => overlay.remove());
}

/* ── Hero Typing Logic ─────────────────────────────────── */
const heroEl = document.getElementById('typed-text');
let pi = 0, ci = 0, deleting = false;

function tickHero() {
    if (!heroEl) return;
    const phrase = HERO_PHRASES[pi];

    if (!deleting) {
        heroEl.textContent = phrase.slice(0, ++ci);
        if (ci === phrase.length) {
            deleting = true;
            setTimeout(tickHero, 2200);
            return;
        }
    } else {
        heroEl.textContent = phrase.slice(0, --ci);
        if (ci === 0) {
            deleting = false;
            pi = (pi + 1) % HERO_PHRASES.length;
        }
    }
    setTimeout(tickHero, deleting ? 30 : 50);
}

/* ── "Now" Section Command Animation ──────────────────── */
const commandEl = document.getElementById('command-text');
const nowContent = document.getElementById('now-content');
let hasTypedNow = false;

const typeNowCommand = () => {
    if (!commandEl || !nowContent) return;

    let i = 0;
    commandEl.textContent = "";

    function type() {
        if (i < NOW_COMMAND.length) {
            commandEl.textContent += NOW_COMMAND.charAt(i);
            i++;
            setTimeout(type, 100);
        } else {
            setTimeout(() => {
                // Use visibility:hidden to avoid layout shift
                const cursor = document.querySelector('.cursor-mini');
                if (cursor) cursor.style.visibility = 'hidden';

                nowContent.classList.add('is-visible');
            }, 500);
        }
    }
    type();
};

/* ── Intersection Observer ─────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.id === 'now' && !hasTypedNow) {
                hasTypedNow = true;
                typeNowCommand();
            }

            if (entry.target.classList.contains('timeline-item')) {
                entry.target.classList.add('is-visible');
            }

            if (entry.target.classList.contains('project-card')) {
                entry.target.classList.add('is-visible');
            }

            if (entry.target.classList.contains('read-item')) {
                entry.target.classList.add('is-visible');
            }
        }
    });
}, { threshold: 0.15 });

/* ── Mouse Tracker for Project Glow ───────────────────── */
const handleMouseMove = (e) => {
    const cards = document.getElementsByClassName("project-card");
    for (const card of cards) {
        const rect = card.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    tickHero();

    document.querySelectorAll('section').forEach(s => observer.observe(s));
    document.querySelectorAll('.project-card').forEach(p => observer.observe(p));
    document.querySelectorAll('.timeline-item').forEach(t => observer.observe(t));
    document.querySelectorAll('.read-item').forEach(item => observer.observe(item));

    window.addEventListener("mousemove", handleMouseMove);
});

/* ── Footer Clock ──────────────────────────────────────── */
function updateClock() {
    const timeEl = document.getElementById('footer-time');
    if (!timeEl) return;

    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

setInterval(updateClock, 1000);
updateClock();