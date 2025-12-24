// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav toggle
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    // Avoid CLS: set explicit max-height when opening (CSS handles transition)
    if (open){
      navList && (navList.style.maxHeight = '480px');
    } else {
      navList && (navList.style.maxHeight = '0px');
    }
  });
}

// Close nav on link click (mobile)
if (navList) {
  navList.addEventListener('click', e => {
    const target = e.target;
    if (target instanceof Element && target.matches('.nav-link')) {
      nav.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
      navList.style.maxHeight = '0px';
    }
  });
}

// Typing effect in hero
(function typingEffect(){
  const el = document.querySelector('.typing');
  if (!el) return;
  const phrases = [
    ' Java • Python • JavaScript',
    ' Full‑stack Developer',
  ];
  let i = 0, j = 0, forward = true;

  function tick(){
    const phrase = phrases[i];
    if (forward) {
      j++;
      if (j === phrase.length + 1){
        forward = false;
        setTimeout(tick, 1100);
        el.textContent = phrase;
        return;
      }
    } else {
      j--;
      if (j === 0){
        forward = true; i = (i + 1) % phrases.length;
      }
    }
    el.textContent = phrase.slice(0, j);
    setTimeout(tick, forward ? 36 : 24);
  }
  tick();
})();

// Reveal on scroll using IntersectionObserver (supports variants)
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries){
      if (entry.isIntersecting){
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('show'));
}

// Active link highlight on scroll
const sections = Array.from(document.querySelectorAll('main[id], section[id]'));
const links = Array.from(document.querySelectorAll('.nav-link'));

function setActiveLink(){
  const scrollY = window.scrollY + 120; // offset for sticky header
  let currentId = 'home';
  for (const sec of sections){
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    if (scrollY >= top && scrollY < top + height){
      currentId = sec.getAttribute('id') || currentId;
    }
  }
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`));
}
setActiveLink();
window.addEventListener('scroll', setActiveLink, { passive:true });

// Optional: smooth scroll fallback for older browsers
// (Most modern browsers support CSS scroll-behavior)
const supportsSmooth = 'scrollBehavior' in document.documentElement.style;
if (!supportsSmooth){
  links.forEach(a => a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')){
      e.preventDefault();
      const target = document.querySelector(href);
      if (target){
        const top = target.getBoundingClientRect().top + window.pageYOffset - 60;
        window.scrollTo({ top, behavior: 'auto' });
      }
    }
  }));
}
  // Hover ripple effect (soft) and click ripple (existing)
  function addRipple(e, type='click'){
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const x = (e.clientX ?? (rect.left + rect.width/2)) - rect.left;
    const y = (e.clientY ?? (rect.top + rect.height/2)) - rect.top;
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    if (type === 'hover') ripple.style.animationDuration = '900ms';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e)=>addRipple(e,'click'));
    btn.addEventListener('mouseenter', (e)=>addRipple(e,'hover'));
    btn.classList.add('magnet');
  });

// Magnetic hover for buttons and icon buttons
function addMagnetListeners(el){
  const strength = 8; // px
  el.addEventListener('mousemove', (ev) => {
    const r = el.getBoundingClientRect();
    const mx = ev.clientX - (r.left + r.width/2);
    const my = ev.clientY - (r.top + r.height/2);
    const tx = (mx / (r.width/2)) * strength;
    const ty = (my / (r.height/2)) * strength;
    el.style.transform = `translate(${tx}px, ${ty}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
}
document.querySelectorAll('.btn, .icon-btn').forEach(addMagnetListeners);

// Card tilt on hover (desktop)
function addTilt(card){
  const maxTilt = 6; // deg
  card.addEventListener('mousemove', (ev) => {
    const r = card.getBoundingClientRect();
    const px = (ev.clientX - r.left) / r.width; // 0..1
    const py = (ev.clientY - r.top) / r.height;
    const tiltX = (py - 0.5) * -2 * maxTilt;
    const tiltY = (px - 0.5) * 2 * maxTilt;
    card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
}
if (window.matchMedia('(hover: hover)').matches){
  document.querySelectorAll('.card[data-tilt]').forEach(addTilt);
}

// Dynamic favicon generator: draw rounded gradient with SK
(function setDynamicFavicon(){
  try{
    const size = 96; // higher res for crispness
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Rounded rect
    const r = 22;
    ctx.beginPath();
    ctx.moveTo(r,0); ctx.arcTo(size,0,size,r,r); ctx.arcTo(size,size,size-r,size,r);
    ctx.arcTo(0,size,r,size,r); ctx.arcTo(0,0, r,0, r); ctx.closePath();
    const grad = ctx.createLinearGradient(0,0,size,size);
    grad.addColorStop(0,'#7c6cff');
    grad.addColorStop(1,'#00d0ff');
    ctx.fillStyle = grad; ctx.fill();
    // Text SK
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px "Space Grotesk", Inter, Arial';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('SK', size/2, size/2 + 2);
    const url = canvas.toDataURL('image/png');
    let link = document.querySelector('link[rel="icon"]');
    if (!link){
      link = document.createElement('link');
      link.rel = 'icon'; link.type = 'image/png';
      document.head.appendChild(link);
    }
    link.href = url;
  }catch(e){/* ignore */}
})();
