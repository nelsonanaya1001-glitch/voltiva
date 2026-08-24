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

/* ── Hero showcase ──────────────────────────────────────── */
const slides = document.querySelectorAll('.showcase .slide');
const slideInfo = [
  ['Household Electronics',   'Kitchen, smart home & displays · 11,400 SKUs'],
  ['Beauty & Personal Care',  'Skincare, cosmetics & grooming · 9,800 SKUs'],
  ['Health & Wellness',       'Supplements, fitness & devices · 8,600 SKUs'],
  ['Toys & Games',            'STEM, board games & outdoor · 7,300 SKUs']
];

const dotWrap = document.getElementById('slideDots');
const slideCat = document.getElementById('slideCat');
const slideMeta = document.getElementById('slideMeta');
let cur = 0;
let slideTimer;

slides.forEach((_, i) => {
  const b = document.createElement('button');
  b.className = 'sdot' + (i === 0 ? ' active' : '');
  b.type = 'button';
  b.setAttribute('aria-label', 'Show ' + slideInfo[i][0]);
  b.addEventListener('click', () => { goSlide(i); resetTimer(); });
  dotWrap.appendChild(b);
});
const dots = dotWrap.querySelectorAll('.sdot');

function goSlide(n) {
  slides[cur].classList.remove('active');
  dots[cur].classList.remove('active');
  cur = (n + slides.length) % slides.length;
  slides[cur].classList.add('active');
  dots[cur].classList.add('active');
  slideCat.textContent = slideInfo[cur][0];
  slideMeta.textContent = slideInfo[cur][1];
}

function resetTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => goSlide(cur + 1), 4200);
}
resetTimer();

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

/* ── Nav shadow on scroll ───────────────────────────────── */
window.addEventListener('scroll', () => {
  document.querySelector('nav').style.boxShadow =
    window.scrollY > 10 ? '0 4px 24px rgba(14,42,29,0.10)' : 'none';
});
