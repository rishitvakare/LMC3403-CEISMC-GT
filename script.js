(() => {
'use strict';

// 1. Mobile Menu & Scroll Progress Bar
const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav-links');
if (menu && nav) {
    menu.addEventListener('click', () => {
        const open = menu.getAttribute('aria-expanded') !== 'true';
        menu.setAttribute('aria-expanded', String(open));
        nav.classList.toggle('open', open);
        menu.textContent = open ? 'Close' : 'Menu';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        nav.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
        menu.textContent = 'Menu';
    }));
}

const progress = document.querySelector('.progress');
if (progress) {
    window.addEventListener('scroll', () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    }, { passive: true });
}

// 2. Intersection Observer Scroll Animations
if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// 3. Project Filter Buttons
const filters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('[data-category]');
filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    let count = 0;
    cards.forEach(card => {
        const hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
        card.hidden = hidden;
        if (!hidden) { count++; card.classList.add('visible'); }
    });
    const statusEl = document.querySelector('#filter-status');
    if (statusEl) {
        statusEl.textContent = button.dataset.filter === 'all'
            ? 'Showing all 3 projects'
            : `Showing ${count} ${button.textContent.toLowerCase()} project${count === 1 ? '' : 's'}`;
    }
}));

// 4. Resource Clipboard Button
const copyBtn = document.getElementById('copy-resource');
const shareStatus = document.getElementById('share-status');
if (copyBtn && shareStatus) {
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText('https://ceismc.gatech.edu/');
            shareStatus.textContent = 'Link copied. Share it with an educator or school leader.';
        } catch {
            shareStatus.textContent = 'Copy this link: https://ceismc.gatech.edu/';
        }
    });
}

// 5. D3 Globe Animation Logic
const canvas = document.getElementById('georgia-globe');
if (!canvas) return;
const ctx = canvas.getContext('2d');
if (!ctx) return;

const rad = Math.PI / 180;
const pause = document.getElementById('globe-pause');
const replay = document.getElementById('globe-replay');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

let elapsed = 0, last = 0, raf = 0, paused = false, finished = false, visible = true;
const duration = 10500;
const ease = t => t * t * (3 - 2 * t);

// Retrieve land and georgia coordinates safely from global window object
const landData = window.LAND_DATA || {};
const land = landData.land;
const georgia = landData.georgia;

if (land && land.geometries) {
    for (const polygon of land.geometries) {
        if (d3.geoArea(polygon) > 2 * Math.PI) polygon.coordinates.forEach(ring => ring.reverse());
    }
}

const georgiaFeature = { type: 'Polygon', coordinates: georgia ? [georgia] : [[[-84.39, 33.75]]] };
if (d3.geoArea(georgiaFeature) > 2 * Math.PI) georgiaFeature.coordinates.forEach(ring => ring.reverse());

const projection = d3.geoOrthographic().clipAngle(90).clipExtent([[-2, -2], [602, 692]]).precision(.2);
const geoPath = d3.geoPath(projection, ctx);
const graticule = d3.geoGraticule().step([20, 15]).precision(2)();

function sizeCanvas() {
    const factor = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(600 * factor);
    canvas.height = Math.round(690 * factor);
    ctx.setTransform(factor, 0, 0, factor, 0, 0);
}
sizeCanvas();

function draw(ms) {
    const w = 600, h = 690;
    ctx.clearRect(0, 0, w, h);
    let lon, lat, zoom;
    if (ms < 5700) {
        const t = ease(ms / 5700);
        lon = 65 + (-84.39 - 65) * t;
        lat = 8 + (33.75 - 8) * t;
        zoom = 1;
    } else {
        const t = ease(Math.min(1, (ms - 5700) / 4200));
        lon = -84.39;
        lat = 33.75;
        zoom = 1 + 19 * t;
    }

    const r = 215 * zoom, cx = 300, cy = 320;
    projection.rotate([-lon, -lat, 0]).scale(r).translate([cx, cy]);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    const water = ctx.createRadialGradient(cx - r * .35, cy - r * .4, r * .05, cx, cy, r);
    water.addColorStop(0, '#183d56');
    water.addColorStop(1, '#07192d');
    ctx.fillStyle = water;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#c7c6a424';
    ctx.lineWidth = .65;
    ctx.beginPath();
    geoPath(graticule);
    ctx.stroke();

    if (land) {
        ctx.fillStyle = '#a99564';
        ctx.strokeStyle = '#d5bc8355';
        ctx.lineWidth = .45;
        ctx.beginPath();
        geoPath(land);
        ctx.fill();
        ctx.stroke();
    }

    if (ms > 5300) {
        ctx.fillStyle = '#efd49a';
        ctx.strokeStyle = '#fff1ce';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        geoPath(georgiaFeature);
        ctx.fill();
        ctx.stroke();
    }

    const project = point => {
        const xy = projection(point);
        return [xy[0], xy[1], d3.geoDistance([lon, lat], point) < Math.PI / 2 ? 1 : -1];
    };

    const [x, y, z] = project([-84.388, 33.749]);
    if (z > 0 && ms > 3500) {
        const alpha = Math.min(1, (ms - 3500) / 1200);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#fff1ce';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(x, y, 12 + Math.sin(ms / 500) * 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#fff5d8';
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '600 12px Arial';
        ctx.fillStyle = '#051e39';
        ctx.fillRect(x + 17, y - 18, 80, 29);
        ctx.fillStyle = '#fff0cf';
        ctx.fillText('ATLANTA', x + 27, y + 1);
        ctx.globalAlpha = 1;
    }

    ctx.restore();
    ctx.strokeStyle = '#d5bc8355';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    if (ms > 7600) {
        ctx.fillStyle = '#051e39';
        ctx.fillRect(195, 418, 210, 43);
        ctx.fillStyle = '#fff0cf';
        ctx.font = '19px Georgia';
        ctx.textAlign = 'center';
        ctx.fillText('GEORGIA, USA', 300, 446);
        ctx.textAlign = 'left';
    }
}

function frame(ts) {
    raf = 0;
    if (paused || finished || !visible || document.hidden) return;
    if (last) elapsed += ts - last;
    last = ts;
    draw(elapsed);
    if (elapsed >= duration) {
        finished = true;
        if (pause) { pause.textContent = 'Complete'; pause.disabled = true; }
        return;
    }
    raf = requestAnimationFrame(frame);
}

function start() {
    if (!raf && !paused && !finished && visible && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(frame);
    }
}

if (pause) {
    pause.addEventListener('click', () => {
        paused = !paused;
        pause.textContent = paused ? 'Resume' : 'Pause';
        pause.setAttribute('aria-pressed', String(paused));
        if (paused) { cancelAnimationFrame(raf); raf = 0; } else start();
    });
}

if (replay) {
    replay.addEventListener('click', () => {
        cancelAnimationFrame(raf);
        raf = 0; elapsed = 0; last = 0; paused = false; finished = false;
        if (pause) { pause.disabled = false; pause.textContent = 'Pause'; pause.setAttribute('aria-pressed', 'false'); }
        if (reduce.matches) { draw(duration); finished = true; if (pause) { pause.textContent = 'Still view'; pause.disabled = true; } } else { draw(0); start(); }
    });
}

function applyPreference() {
    cancelAnimationFrame(raf);
    raf = 0;
    elapsed = reduce.matches ? duration : 0;
    finished = reduce.matches;
    paused = false;
    if (pause) { pause.disabled = reduce.matches; pause.textContent = reduce.matches ? 'Still view' : 'Pause'; pause.setAttribute('aria-pressed', 'false'); }
    draw(elapsed);
    start();
}

reduce.addEventListener('change', applyPreference);
document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; last = 0; } else start();
});

if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) start(); else { cancelAnimationFrame(raf); raf = 0; last = 0; }
    }, { threshold: 0 }).observe(canvas);
}

applyPreference();


})();