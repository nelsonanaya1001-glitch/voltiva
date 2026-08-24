/* ============================================================
   VOLTIVA — page switching, showcase, FAQ, forms
   ============================================================ */

/* ── Mobile nav ─────────────────────────────────────────── */
function toggleMenu() {
  document.getElementById('mobileNav').classList.toggle('open');
}

/* ── Page switching ─────────────────────────────────────────
   data-page="home"     → hero, categories, about strip, tiles, FAQ
   data-page="contact"  → shown on home AND on the contact tab
   everything else      → its own standalone page
   ────────────────────────────────────────────────────────── */
function showPage(name) {
  document.querySelectorAll('section[data-page]').forEach(sec => {
    const pg = sec.dataset.page;
    const show = name === 'home' ? (pg === 'home' || pg === 'contact') : pg === name;
    sec.style.display = show ? '' : 'none';
  });

  document.querySelectorAll('.nav-tab').forEach(a => {
    a.classList.toggle(
      'active-tab',
      a.dataset.page === name && !a.classList.contains('nav-cta') && !a.classList.contains('nav-logo')
    );
  });

  document.getElementById('mobileNav').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  revealCards();
}

document.querySelectorAll('.nav-tab').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    showPage(a.dataset.page);
  });
});

/* ── Hero showcase ──────────────────────────────────────────
   One rAF clock drives the progress bar AND the auto-advance, so
   pausing freezes both at exactly the same point.
   ────────────────────────────────────────────────────────── */
const showcase = document.getElementById('showcase');
const slides   = [...document.querySelectorAll('.showcase .slide')];
const thumbs   = [...document.querySelectorAll('.thumb')];
const scBar    = document.getElementById('scBar');
const slideCopy = document.getElementById('slideCopy');
const slideCat  = document.getElementById('slideCat');
const slideMeta = document.getElementById('slideMeta');

const slideInfo = [
  ['Household Electronics',   'Kitchen, smart home & displays · 11,400 SKUs'],
  ['Beauty & Personal Care',  'Skincare, cosmetics & grooming · 9,800 SKUs'],
  ['Health & Wellness',       'Supplements, fitness & devices · 8,600 SKUs'],
  ['Toys & Games',            'STEM, board games & outdoor · 7,300 SKUs']
];

const SLIDE_MS = 5600;
const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let cur = 0, elapsed = 0, lastTs = null, paused = false;

function goSlide(n) {
  const next = (n + slides.length) % slides.length;

  slides[cur].classList.remove('is-active');
  slides[cur].setAttribute('aria-hidden', 'true');
  thumbs[cur].classList.remove('is-active');
  thumbs[cur].setAttribute('aria-selected', 'false');

  cur = next;

  slides[cur].classList.add('is-active');
  slides[cur].setAttribute('aria-hidden', 'false');
  thumbs[cur].classList.add('is-active');
  thumbs[cur].setAttribute('aria-selected', 'true');

  slideCat.textContent  = slideInfo[cur][0];
  slideMeta.textContent = slideInfo[cur][1];

  // restart the copy entrance
  slideCopy.classList.remove('enter');
  void slideCopy.offsetWidth;
  slideCopy.classList.add('enter');

  elapsed = 0;
}

function tick(ts) {
  if (lastTs === null) lastTs = ts;
  const dt = ts - lastTs;
  lastTs = ts;

  // don't burn through slides while the hero is hidden behind another tab
  const onScreen = showcase.offsetParent !== null && !document.hidden;

  if (!paused && !reduced && onScreen) {
    elapsed += dt;
    if (elapsed >= SLIDE_MS) goSlide(cur + 1);
  }
  scBar.style.transform = 'scaleX(' + (reduced ? 0 : Math.min(elapsed / SLIDE_MS, 1)) + ')';
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

function setPaused(v) {
  paused = v;
  showcase.classList.toggle('is-paused', v);
}
showcase.addEventListener('mouseenter', () => setPaused(true));
showcase.addEventListener('mouseleave', () => setPaused(false));
showcase.addEventListener('focusin',    () => setPaused(true));
showcase.addEventListener('focusout',   () => setPaused(false));

thumbs.forEach(t => t.addEventListener('click', () => goSlide(+t.dataset.i)));
document.getElementById('scPrev').addEventListener('click', () => goSlide(cur - 1));
document.getElementById('scNext').addEventListener('click', () => goSlide(cur + 1));

showcase.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  { goSlide(cur - 1); e.preventDefault(); }
  if (e.key === 'ArrowRight') { goSlide(cur + 1); e.preventDefault(); }
});

// swipe
let touchX = null;
showcase.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
showcase.addEventListener('touchend', e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 45) goSlide(cur + (dx < 0 ? 1 : -1));
  touchX = null;
}, { passive: true });

/* ── Card reveal on scroll ──────────────────────────────── */
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 90);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function revealCards() {
  document.querySelectorAll('.cat-card:not(.visible)').forEach(el => observer.observe(el));
}
revealCards();

/* ── FAQ accordion ──────────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const open = item.dataset.open === 'true';
    document.querySelectorAll('.faq-item').forEach(i => (i.dataset.open = 'false'));
    item.dataset.open = open ? 'false' : 'true';
  });
});

/* ── Forms → mailto ─────────────────────────────────────── */
const INBOX = 'wholesale@voltiva.com';
const val = id => (document.getElementById(id).value || '').trim();

function sendMail(subject, body, successId) {
  const el = document.getElementById(successId);
  if (el) el.classList.add('show');
  window.location.href =
    'mailto:' + INBOX +
    '?subject=' + encodeURIComponent(subject) +
    '&body=' + encodeURIComponent(body);
}

function submitContact(e) {
  e.preventDefault();
  let b = 'CONTACT — VOLTIVA WHOLESALE\n============================\n\n';
  b += 'Name: ' + val('c-name') + '\n';
  if (val('c-company')) b += 'Company: ' + val('c-company') + '\n';
  b += 'Email: ' + val('c-email') + '\n';
  if (val('c-phone')) b += 'Phone: ' + val('c-phone') + '\n';
  if (val('c-message')) b += '\nSourcing Needs:\n' + val('c-message') + '\n';
  sendMail('Wholesale Inquiry — Voltiva', b, 'contactSuccess');
}

function submitCatalog(e) {
  e.preventDefault();

  const lines = [
    document.getElementById('cf-electronics').checked && 'Household Electronics',
    document.getElementById('cf-beauty').checked && 'Beauty & Personal Care',
    document.getElementById('cf-health').checked && 'Health & Wellness',
    document.getElementById('cf-toys').checked && 'Toys & Games'
  ].filter(Boolean);

  let b = 'CATALOG REQUEST — VOLTIVA WHOLESALE\n===================================\n\n';
  b += 'Name: ' + val('cf-name') + '\n';
  if (val('cf-company')) b += 'Company: ' + val('cf-company') + '\n';
  b += 'Email: ' + val('cf-email') + '\n';
  if (val('cf-phone')) b += 'Phone: ' + val('cf-phone') + '\n\n';
  if (lines.length) b += 'Categories: ' + lines.join(', ') + '\n';
  if (val('cf-volume')) b += 'Monthly Volume: ' + val('cf-volume') + '\n';
  if (val('cf-type')) b += 'Business Type: ' + val('cf-type') + '\n';
  if (val('cf-timeline')) b += 'Timeline: ' + val('cf-timeline') + '\n';
  if (val('cf-products')) b += '\nSpecific Products / Brands:\n' + val('cf-products') + '\n';
  if (val('cf-message')) b += '\nAbout the Business:\n' + val('cf-message') + '\n';

  sendMail('Catalog Request — Voltiva', b, 'catalogSuccess');
}

/* ── Init ───────────────────────────────────────────────── */
showPage('home');

/* ── Category product menu ──────────────────────────────────
   Builds itself from the category page already in the DOM, so the
   products in the menu can never drift from the products on the page.
   ────────────────────────────────────────────────────────── */
const catModal = document.getElementById('catModal');
let lastFocus = null;

function openCatMenu(page) {
  const sec = document.querySelector(`section[data-page="${page}"]`);
  if (!sec) return;

  document.getElementById('modalTitle').innerHTML = sec.querySelector('.page-hero h1').innerHTML;
  document.getElementById('modalBlurb').textContent = sec.querySelector('.page-hero p').textContent;

  const art = document.getElementById('modalArt');
  art.innerHTML = '';
  const banner = sec.querySelector('.cat-banner .scene');
  if (banner) art.appendChild(banner.cloneNode(true));

  const wrap = document.getElementById('modalProducts');
  wrap.innerHTML = '';
  sec.querySelectorAll('.sub-card').forEach(card => {
    const item = document.createElement('div');
    item.className = 'modal-item';

    const thumb = document.createElement('div');
    thumb.className = 'modal-thumb ' + card.querySelector('.sub-visual').className.replace('sub-visual', '').trim();
    thumb.appendChild(card.querySelector('.sub-visual svg').cloneNode(true));

    const body = document.createElement('div');
    body.innerHTML = card.querySelector('.sub-body').innerHTML;

    item.append(thumb, body);
    wrap.appendChild(item);
  });

  const full = document.getElementById('modalFull');
  full.onclick = e => { e.preventDefault(); closeCatMenu(); showPage(page); };

  lastFocus = document.activeElement;
  catModal.hidden = false;
  document.body.style.overflow = 'hidden';
  document.querySelector('.modal-close').focus();
}

function closeCatMenu() {
  catModal.hidden = true;
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}

catModal.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeCatMenu(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !catModal.hidden) closeCatMenu();
});

/* ── Nav shadow on scroll ───────────────────────────────── */
window.addEventListener('scroll', () => {
  document.querySelector('nav').style.boxShadow =
    window.scrollY > 10 ? '0 4px 24px rgba(14,42,29,0.10)' : 'none';
});
