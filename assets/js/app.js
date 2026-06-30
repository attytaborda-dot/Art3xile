/* ART3XILE — portfolio app (data-driven via data/portfolio.json) */

const GRID_SIZES = '(min-width:1024px) 30vw, (min-width:640px) 47vw, 92vw';

let portfolio = null;
let conceptProjects = [];
let illustrations = [];
let exileLead = null;
let exileWorks = [];
let featured = [];
let stepLabels = [];
let lightboxPool = [];
let lbIndex = 0;

function hiRes(url) {
    return url.replace('/large/', '/4k/').replace('/medium/', '/4k/');
}

function thumbAttrs(src, sizes) {
    if (src.includes('/large/')) {
        const med = src.replace('/large/', '/medium/');
        return `src="${src}" srcset="${med} 600w, ${src} 1920w" sizes="${sizes}"`;
    }
    return `src="${src}"`;
}

function registerLB(item) {
    lightboxPool.push(item);
    return lightboxPool.length - 1;
}

function countLabel(cat, items, catKey = 'cat') {
    if (cat === 'All') return `All (${items.length})`;
    const n = items.filter(i => i[catKey] === cat).length;
    return `${cat} (${n})`;
}

function showGridLoading(gridId, count = 3) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';
    grid.className = grid.className.replace('grid-3', '').trim() + ' grid-loading';
    for (let i = 0; i < count; i++) {
        const sk = document.createElement('div');
        sk.className = 'skeleton';
        grid.appendChild(sk);
    }
}

function renderFeatured() {
    const grid = document.getElementById('featured-grid');
    grid.className = 'grid grid-3';
    grid.innerHTML = '';

    featured.forEach(f => {
        const card = document.createElement('div');
        card.className = 'card';
        if (f.type === 'project') {
            const p = conceptProjects.find(x => x.id === f.id);
            if (!p) return;
            card.innerHTML = `
                <div class="thumb"><img ${thumbAttrs(p.cover, GRID_SIZES)} alt="${p.title}" loading="lazy" decoding="async"></div>
                <div class="meta">
                    <span class="kicker">${p.kicker}</span>
                    <h3>${p.title}</h3>
                    <p>${p.role}</p>
                    <span class="view">View case study <i class="fas fa-arrow-right"></i></span>
                </div>`;
            card.onclick = () => openProject(p.id);
        } else {
            const cover = f.cover || exileLead.src;
            card.innerHTML = `
                <div class="thumb"><img ${thumbAttrs(cover, GRID_SIZES)} alt="${f.title}" loading="lazy" decoding="async"${f.pos ? ` style="object-position:${f.pos}"` : ''}></div>
                <div class="meta">
                    <span class="kicker">${f.kicker}</span>
                    <h3>${f.title}</h3>
                    <p>${f.role || '&nbsp;'}</p>
                    <span class="view">${f.sub}</span>
                </div>`;
            card.onclick = () => document.querySelector(f.href).scrollIntoView({ behavior: 'smooth' });
        }
        grid.appendChild(card);
    });
}

function renderConcept() {
    const grid = document.getElementById('concept-grid');
    grid.className = 'grid grid-3';
    grid.innerHTML = '';

    conceptProjects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.cat = p.cat || '';
        card.innerHTML = `
            <div class="thumb"><img ${thumbAttrs(p.cover, GRID_SIZES)} alt="${p.title}" loading="lazy" decoding="async"></div>
            <div class="meta">
                <span class="kicker">${p.kicker}</span>
                <h3>${p.title}</h3>
                <p>${p.images.length} design sheets</p>
                <span class="view">View case study <i class="fas fa-arrow-right"></i></span>
            </div>`;
        card.onclick = () => openProject(p.id);
        grid.appendChild(card);
    });

    const conceptFilters = document.getElementById('concept-filters');
    conceptFilters.innerHTML = '';
    ['All', 'Characters', 'Creatures'].forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn' + (cat === 'All' ? ' active' : '');
        btn.innerHTML = countLabel(cat, conceptProjects);
        btn.setAttribute('role', 'tab');
        btn.onclick = () => {
            conceptFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
            grid.querySelectorAll('.card').forEach(el => {
                const show = cat === 'All' || el.dataset.cat === cat;
                el.classList.toggle('hide', !show);
            });
        };
        conceptFilters.appendChild(btn);
    });
}

function renderIllustrations() {
    const grid = document.getElementById('ill-grid');
    grid.innerHTML = '';

    illustrations.forEach(im => {
        const idx = registerLB({ src: im.src, title: im.title, tag: im.tag });
        const el = document.createElement('div');
        el.className = 'ill';
        el.dataset.cat = im.cat || '';
        el.innerHTML = `<img ${thumbAttrs(im.src, GRID_SIZES)} alt="${im.title}" loading="lazy" decoding="async">
            <div class="cap"><span>${im.tag}</span><b>${im.title}</b></div>`;
        el.onclick = () => openLB(idx);
        grid.appendChild(el);
    });

    const illFilters = document.getElementById('ill-filters');
    illFilters.innerHTML = '';
    const categories = ['All', ...[...new Set(illustrations.map(i => i.cat).filter(Boolean))]];
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn' + (cat === 'All' ? ' active' : '');
        btn.innerHTML = countLabel(cat, illustrations);
        btn.setAttribute('role', 'tab');
        btn.onclick = () => {
            illFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
            grid.querySelectorAll('.ill').forEach(el => {
                const show = cat === 'All' || el.dataset.cat === cat;
                el.classList.toggle('hide', !show);
            });
        };
        illFilters.appendChild(btn);
    });
    illFilters.style.display = categories.length <= 2 ? 'none' : '';
}

function renderExile() {
    const leadIdx = registerLB({ src: exileLead.src, title: exileLead.title, tag: exileLead.tag });
    const leadArt = document.getElementById('exile-lead-art');
    leadArt.className = 'hero-art';
    leadArt.innerHTML = `<img src="${exileLead.src}" alt="${exileLead.title}" loading="lazy">`;
    leadArt.onclick = () => openLB(leadIdx);

    const grid = document.getElementById('exile-grid');
    grid.innerHTML = '';
    exileWorks.forEach(w => {
        const idx = registerLB({ src: w.src, title: w.title, tag: w.tag });
        const el = document.createElement('div');
        el.className = 'exile-tile';
        el.innerHTML = `<img ${thumbAttrs(w.src, GRID_SIZES)} alt="${w.title}" loading="lazy" decoding="async">
            <div class="cap"><b>${w.title}</b></div>`;
        el.onclick = () => openLB(idx);
        grid.appendChild(el);
    });
}

/* Lightbox */
const lb = document.getElementById('lightbox');

function openLB(i) {
    lbIndex = i;
    renderLB();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function renderLB() {
    const it = lightboxPool[lbIndex];
    const img = document.getElementById('lb-img');
    img.alt = it.title || '';
    img.onerror = () => { img.onerror = null; img.src = it.src; };
    img.src = hiRes(it.src);
    document.getElementById('lb-cap').innerHTML = `<span>${it.tag || ''}</span>${it.title || ''}`;
}

function stepLB(d) {
    lbIndex = (lbIndex + d + lightboxPool.length) % lightboxPool.length;
    renderLB();
}

function closeLB() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
}

lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });

/* Project viewer */
const pv = document.getElementById('projectView');
const pvBody = document.getElementById('pv-body');

function openProject(id) {
    const p = conceptProjects.find(x => x.id === id);
    if (!p) return;
    const steps = p.images.map((src, i) => `
        <div class="pv-step">
            <div class="step-label">${stepLabels[i] || 'Sheet ' + (i + 1)}</div>
            <img src="${src}" alt="${p.title} — ${stepLabels[i] || ''}" loading="lazy">
        </div>`).join('');
    pvBody.innerHTML = `
        <div class="pv-head">
            <span class="kicker">${p.kicker}</span>
            <h2>${p.title}</h2>
            <div class="role">${p.role}</div>
            <p class="brief">${p.brief}</p>
        </div>
        <div class="pv-stage">${steps}</div>
        <div class="pv-foot">
            <p>Want to see this character in motion, or commission your own?</p>
            <button class="btn btn-cta" onclick="closeProject(); setTimeout(()=>document.querySelector('#contact').scrollIntoView({behavior:'smooth'}),200);">Get in touch</button>
        </div>`;
    pv.classList.add('open');
    pv.scrollTop = 0;
    document.body.style.overflow = 'hidden';
}

function closeProject() {
    pv.classList.remove('open');
    document.body.style.overflow = '';
}

window.closeLB = closeLB;
window.stepLB = stepLB;
window.closeProject = closeProject;

document.addEventListener('keydown', e => {
    if (lb.classList.contains('open')) {
        if (e.key === 'Escape') closeLB();
        if (e.key === 'ArrowLeft') stepLB(-1);
        if (e.key === 'ArrowRight') stepLB(1);
    } else if (pv.classList.contains('open') && e.key === 'Escape') {
        closeProject();
    }
});

/* Nav */
const toggle = document.getElementById('toggle');
const menu = document.getElementById('menu');
const menuOverlay = document.getElementById('menuOverlay');

function setMenuOpen(open) {
    toggle.classList.toggle('active', open);
    menu.classList.toggle('open', open);
    menuOverlay.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open);
    menuOverlay.setAttribute('aria-hidden', !open);
}

toggle.addEventListener('click', () => setMenuOpen(!menu.classList.contains('open')));
menuOverlay.addEventListener('click', () => setMenuOpen(false));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenuOpen(false)));

const navEl = document.getElementById('nav');
const links = document.querySelectorAll('.nav-link');
const secs = [...links].map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

function updateNav() {
    navEl.classList.toggle('scrolled', window.scrollY > 30);
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 88) cur = s.id; });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
}

window.addEventListener('scroll', updateNav);

/* Section highlight on scroll */
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(en => {
        if (en.isIntersecting) {
            document.querySelectorAll('section.section-active').forEach(s => s.classList.remove('section-active'));
            en.target.classList.add('section-active');
        }
    });
}, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });

document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

/* Scroll reveal */
const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* Hero FX */
(function heroFX() {
    const hero = document.querySelector('.hero');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'hero-fx';
    canvas.setAttribute('aria-hidden', 'true');
    hero.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let w = 0, h = 0, dpr = 1, raf = null, t = 0;
    const isMobile = window.matchMedia('(max-width:640px)').matches;
    const EMBERS = isMobile ? 9 : 16;
    const MOTES = isMobile ? 20 : 40;
    const rand = (a, b) => a + Math.random() * (b - a);
    let parts = [];

    function size() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const r = hero.getBoundingClientRect();
        w = r.width; h = r.height;
        canvas.width = w * dpr; canvas.height = h * dpr;
        canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function ember() {
        return { type: 'e', x: rand(0, w), y: rand(h * 0.45, h + 20),
            r: rand(0.6, 1.7), vx: rand(-0.12, 0.12), vy: rand(-0.55, -0.22),
            a: 0, aMax: rand(0.12, 0.40), d: rand(0, 6.28),
            c: Math.random() < 0.5 ? '224,163,62' : '226,120,74' };
    }
    function mote() {
        return { type: 'm', x: rand(0, w), y: rand(-20, h * 0.5),
            r: rand(0.5, 1.5), vx: rand(-0.08, 0.08), vy: rand(0.20, 0.45),
            a: 0, aMax: rand(0.15, 0.45), d: rand(0, 6.28), c: '237,234,228' };
    }
    function seed() {
        parts = [];
        for (let i = 0; i < EMBERS; i++) parts.push(ember());
        for (let i = 0; i < MOTES; i++) parts.push(mote());
    }
    function frame() {
        ctx.clearRect(0, 0, w, h);
        t += 0.008;
        const gx = w * 0.75, gy = h * 0.30;
        const flicker = 0.55 + 0.18 * Math.sin(t * 7.0) + 0.12 * Math.sin(t * 13.0 + 1.3)
            + 0.10 * Math.sin(t * 23.0 + 2.1) + 0.05 * (Math.random() - 0.5);
        const fl = Math.max(0, Math.min(1, flicker));
        const gr = Math.max(w, h) * (0.40 + 0.05 * fl);
        const ga = 0.10 + 0.16 * fl;
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        g.addColorStop(0, 'rgba(255,214,140,' + ga + ')');
        g.addColorStop(0.4, 'rgba(224,163,62,' + (ga * 0.6) + ')');
        g.addColorStop(1, 'rgba(224,163,62,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

        for (const p of parts) {
            p.d += 0.01;
            p.x += p.vx + Math.sin(p.d) * 0.14;
            p.y += p.vy;
            if (p.type === 'e') {
                if (p.a < p.aMax) p.a += 0.005;
                if (p.y < h * 0.28) p.a -= 0.006;
                if (p.y < -10 || p.a <= 0) Object.assign(p, ember());
            } else {
                if (p.a < p.aMax) p.a += 0.004;
                if (p.y > h * 0.82) p.a -= 0.005;
                if (p.y > h + 10 || p.a <= 0) Object.assign(p, mote());
            }
            const a = Math.max(0, p.a);
            ctx.beginPath();
            ctx.shadowBlur = p.type === 'e' ? 6 : 3;
            ctx.shadowColor = 'rgba(' + p.c + ',' + a + ')';
            ctx.fillStyle = 'rgba(' + p.c + ',' + a + ')';
            ctx.arc(p.x, p.y, p.r, 0, 6.2832);
            ctx.fill();
        }
        ctx.shadowBlur = 0;
        raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf) raf = requestAnimationFrame(frame); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    size(); seed();
    window.addEventListener('resize', size);
    new IntersectionObserver(es => {
        es.forEach(e => e.isIntersecting ? start() : stop());
    }).observe(hero);
})();

/* About banner FX */
(function aboutFX() {
    const banner = document.querySelector('.about-banner');
    if (!banner || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'about-fx';
    canvas.setAttribute('aria-hidden', 'true');
    banner.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let w = 0, h = 0, dpr = 1, raf = null;
    const isMobile = window.matchMedia('(max-width:640px)').matches;
    const COUNT = isMobile ? 14 : 40;
    const rand = (a, b) => a + Math.random() * (b - a);
    let parts = [];

    function size() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const r = banner.getBoundingClientRect();
        w = r.width; h = r.height;
        canvas.width = w * dpr; canvas.height = h * dpr;
        canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spark() {
        return { x: rand(0, w), y: rand(-20, h),
            r: rand(0.6, 2.0), vx: rand(-0.15, 0.15), vy: rand(0.15, 0.50),
            a: 0, aMax: rand(0.25, 0.70), d: rand(0, 6.28),
            c: Math.random() < 0.5 ? '226,75,74' : '255,90,80' };
    }
    function seed() {
        parts = [];
        for (let i = 0; i < COUNT; i++) { const s = spark(); s.y = rand(0, h); parts.push(s); }
    }
    function frame() {
        ctx.clearRect(0, 0, w, h);
        for (const p of parts) {
            p.d += 0.02;
            p.x += p.vx + Math.sin(p.d) * 0.20;
            p.y += p.vy;
            if (p.a < p.aMax) p.a += 0.01;
            if (p.y > h * 0.80) p.a -= 0.01;
            if (p.y > h + 10 || p.a <= 0) Object.assign(p, spark());
            const a = Math.max(0, p.a);
            ctx.beginPath();
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(' + p.c + ',' + a + ')';
            ctx.fillStyle = 'rgba(' + p.c + ',' + a + ')';
            ctx.arc(p.x, p.y, p.r, 0, 6.2832);
            ctx.fill();
        }
        ctx.shadowBlur = 0;
        raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf) raf = requestAnimationFrame(frame); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    size(); seed();
    window.addEventListener('resize', size);
    new IntersectionObserver(es => {
        es.forEach(e => e.isIntersecting ? start() : stop());
    }).observe(banner);
})();

/* Load portfolio data and render */
async function init() {
    showGridLoading('featured-grid');
    showGridLoading('concept-grid');

    try {
        const res = await fetch('data/portfolio.json');
        if (!res.ok) throw new Error('Failed to load portfolio data');
        portfolio = await res.json();

        const { site } = portfolio;
        conceptProjects = portfolio.conceptProjects.filter(p => p.published !== false);
        illustrations = portfolio.illustrations.filter(i => i.published !== false);
        exileLead = portfolio.exile.lead;
        exileWorks = portfolio.exile.works;
        featured = portfolio.featured;
        stepLabels = portfolio.stepLabels;

        if (site.heroImage) {
            document.querySelector('.hero').style.setProperty('--hero-img', `url('${site.heroImage}')`);
        }
        if (site.aboutBannerImage) {
            const banner = document.querySelector('.about-banner');
            banner.style.setProperty('--ab-img', `url('${site.aboutBannerImage}')`);
            banner.querySelector('.ab-base').src = site.aboutBannerImage;
        }

        lightboxPool = [];
        renderFeatured();
        renderConcept();
        renderIllustrations();
        renderExile();
        updateNav();
    } catch (err) {
        console.error(err);
        document.getElementById('featured-grid').innerHTML =
            '<p style="color:var(--muted);grid-column:1/-1">Could not load portfolio. Please refresh.</p>';
    }
}

init();
