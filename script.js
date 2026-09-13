document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initScrollReveal();
  initTeam();
  initWaterBackground();
  initDescentStory();
  initDepthFade();
});

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.about h2, .about p, .section-heading, .team-card, .community-inner'
  );

  targets.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---------- Scroll-driven "descent" story sections ---------- */

function initDescentStory() {
  const steps = document.querySelectorAll('.descent-step');
  if (!steps.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    { threshold: 0.35 }
  );

  steps.forEach((step) => observer.observe(step));
}

/* Darkens the background gradient gradually as the user scrolls further down,
   selling the feeling of sinking deeper underwater. */
function initDepthFade() {
  const root = document.documentElement;
  let ticking = false;

  const update = () => {
    const scrollable = document.body.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    root.style.setProperty('--depth', Math.min(progress * 1.4, 1).toFixed(3));
    ticking = false;
  };

  update();
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  window.addEventListener('resize', update, { passive: true });
}

const TEAM = [
  {
    name: 'Brian',
    role: 'Founder',
    avatar:
      'https://cdn.discordapp.com/avatars/1152888630533173278/47e9635c912b60bf2a31f4b01ac31815.webp?size=1024',
  },
  {
    name: 'Cruey',
    role: 'Developer',
    avatar:
      'https://cdn.discordapp.com/avatars/203379230036328449/4a7b8c3efe7e225f0c2d27bb6161f065.webp?size=1024',
  },
  {
    name: 'Cyclone',
    role: 'Developer',
    avatar:
      'https://cdn.discordapp.com/avatars/1063662980077719573/a_8348fd7f6ebe895dbb590d8d6beea3e2.webp?size=1024&animated=true',
  },
  {
    name: 'Kaalan',
    role: 'Developer',
    avatar:
      'https://cdn.discordapp.com/avatars/143842384399171587/30d7c3f176c81c3975b882048d3ea1c6.webp?size=1024',
  },
  {
    name: 'Justin',
    role: 'Developer',
    avatar:
      'https://cdn.discordapp.com/avatars/1143296941757829191/0c87f7088c29873f49a4a25fce8b46c4.webp?size=1024',
  },
  {
    name: 'Cl1cks',
    role: 'Developer',
    avatar:
      'https://cdn.discordapp.com/avatars/666101752545935366/a291184987c910481dd9ae320cf5195e.webp?size=1024',
  },
  {
    name: 'Izzy',
    role: 'Community Lead',
    avatar:
      'https://cdn.discordapp.com/avatars/1313630076809510975/f20e82dd57d845756fcb2af9b0f4a76f.webp?size=1024',
    lanyardId: '1313630076809510975',
  },
  {
    name: 'Neboskript',
    role: 'Game Contributor',
    avatar:
      'https://cdn.discordapp.com/avatars/954757805531889715/c145587f7192449a028ec56318b4ab09.webp?size=1024',
  },
];

function initTeam() {
  const grid = document.getElementById('teamGrid');
  if (!grid) return;

  const initials = (name) => name.trim().charAt(0).toUpperCase();

  TEAM.forEach((member) => {
    const card = document.createElement('div');
    card.className = 'team-card';

    const showStatusDot = Boolean(member.lanyardId);

    card.innerHTML = `
      <div class="team-avatar-wrap">
        <img
          class="team-avatar"
          src="${member.avatar}"
          alt="${member.name}"
          loading="lazy"
          onerror="this.onerror=null; this.src='${fallbackAvatarDataUri(initials(member.name))}';"
        />
        ${showStatusDot ? '<span class="status-dot" data-role="status-dot"></span>' : ''}
      </div>
      <div class="team-name">${member.name}</div>
      <div class="team-role">${member.role}</div>
      ${member.lanyardId ? '<div class="team-presence" data-role="presence"></div>' : ''}
    `;

    grid.appendChild(card);

    if (member.lanyardId) {
      fetchLanyard(member.lanyardId, card);
    }
  });
}

function fallbackAvatarDataUri(letter) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
      <rect width="64" height="64" rx="32" fill="#141c27"/>
      <text x="50%" y="54%" font-family="-apple-system, sans-serif" font-size="24" font-weight="600"
        fill="#576270" text-anchor="middle" dominant-baseline="middle">${letter}</text>
    </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function fetchLanyard(userId, cardEl) {
  const dot = cardEl.querySelector('[data-role="status-dot"]');
  const presenceEl = cardEl.querySelector('[data-role="presence"]');

  fetch(`https://api.lanyard.rest/v1/users/${userId}`)
    .then((res) => {
      if (!res.ok) throw new Error('Lanyard request failed');
      return res.json();
    })
    .then((json) => {
      if (!json || !json.success || !json.data) throw new Error('Lanyard bad response');
      applyLanyardData(json.data, dot, presenceEl, cardEl);
    })
    .catch(() => {
      if (dot) dot.classList.add('offline');
    });
}

function applyLanyardData(data, dot, presenceEl, cardEl) {
  const status = data.discord_status || 'offline';
  if (dot) {
    dot.classList.remove('online', 'idle', 'dnd', 'offline');
    dot.classList.add(['online', 'idle', 'dnd', 'offline'].includes(status) ? status : 'offline');
  }

  const user = data.discord_user;
  if (user && user.avatar_decoration_data && user.avatar_decoration_data.asset) {
    const wrap = cardEl.querySelector('.team-avatar-wrap');
    if (wrap) {
      const deco = document.createElement('img');
      deco.className = 'avatar-decoration';
      deco.alt = '';
      deco.loading = 'lazy';
      deco.src = `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png?size=96`;
      deco.style.cssText =
        'position:absolute;inset:-8px;width:80px;height:80px;pointer-events:none;';
      wrap.appendChild(deco);
    }
  }

  if (!presenceEl) return;

  const customStatus = (data.activities || []).find((a) => a.type === 4);
  const otherActivity = (data.activities || []).find((a) => a.type !== 4);

  if (customStatus && customStatus.state) {
    presenceEl.textContent = customStatus.state;
  } else if (otherActivity && otherActivity.name) {
    const verb = otherActivity.type === 0 ? 'Playing' : otherActivity.type === 2 ? 'Listening to' : otherActivity.type === 3 ? 'Watching' : '';
    presenceEl.innerHTML = `<span class="activity">${verb ? verb + ' ' : ''}${escapeHtml(otherActivity.name)}</span>`;
  } else {
    presenceEl.textContent = '';
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- Realistic water background ----------
   Layered approach:
   - deep gradient wash that shifts with scroll depth (handled in CSS via --depth)
   - multiple sine-based wave bands with slightly randomized phase/amplitude for a
     non-repeating look, rendered with soft additive-style gradients
   - a subtle refraction-like "caustics" layer: overlapping translucent ellipses
     that drift and pulse, approximating light patterns underwater
   - light shafts (God rays) that sway
   - bubbles with parallax speed variation and soft highlights
   - fine surface "noise" specks for texture, like suspended particulate
*/
function initWaterBackground() {
  const canvas = document.getElementById('waterCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let bubbles = [];
  let waveLayers = [];
  let rays = [];
  let caustics = [];
  let particles = [];
  let time = 0;
  let animationId;
  let scrollFactor = 0;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function setupWaves() {
    waveLayers = [
      { amplitude: 12, wavelength: 380, speed: 0.09, yOffset: height * 0.10, opacity: 0.045, hueTop: '150,200,255', hueBottom: '20,60,110' },
      { amplitude: 18, wavelength: 300, speed: 0.14, yOffset: height * 0.26, opacity: 0.055, hueTop: '120,180,250', hueBottom: '10,40,90' },
      { amplitude: 24, wavelength: 230, speed: 0.20, yOffset: height * 0.46, opacity: 0.065, hueTop: '95,155,235', hueBottom: '6,24,58' },
      { amplitude: 30, wavelength: 170, speed: 0.27, yOffset: height * 0.68, opacity: 0.07, hueTop: '70,130,215', hueBottom: '3,14,38' },
    ];
  }

  function setupRays() {
    const count = 5;
    rays = Array.from({ length: count }, (_, i) => ({
      x: (width / (count + 1)) * (i + 1) + (Math.random() - 0.5) * 60,
      width: 50 + Math.random() * 55,
      swaySpeed: 0.12 + Math.random() * 0.12,
      swayAmount: 24 + Math.random() * 20,
      phase: Math.random() * Math.PI * 2,
      flickerSpeed: 0.6 + Math.random() * 0.8,
      flickerPhase: Math.random() * Math.PI * 2,
    }));
  }

  function setupCaustics() {
    const count = Math.max(5, Math.min(9, Math.floor(width / 220)));
    caustics = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.8,
      radiusX: 90 + Math.random() * 140,
      radiusY: 30 + Math.random() * 50,
      driftSpeed: 0.05 + Math.random() * 0.08,
      pulseSpeed: 0.3 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      angle: Math.random() * Math.PI,
    }));
  }

  function spawnBubble(randomY) {
    const radius = 1.2 + Math.random() * 3.4;
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + radius + 10,
      radius,
      speed: 0.1 + Math.random() * 0.32,
      drift: (Math.random() - 0.5) * 0.28,
      opacity: 0.05 + Math.random() * 0.11,
      wobble: Math.random() * Math.PI * 2,
    };
  }

  function setupBubbles() {
    const count = Math.max(12, Math.min(26, Math.floor(width / 75)));
    bubbles = Array.from({ length: count }, () => spawnBubble(true));
  }

  function spawnParticle(randomY) {
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -5,
      radius: 0.4 + Math.random() * 0.8,
      speed: 0.04 + Math.random() * 0.08,
      drift: (Math.random() - 0.5) * 0.1,
      opacity: 0.03 + Math.random() * 0.05,
    };
  }

  function setupParticles() {
    const count = Math.max(20, Math.min(46, Math.floor((width * height) / 26000)));
    particles = Array.from({ length: count }, () => spawnParticle(true));
  }

  function drawWaveLayer(layer, t) {
    const { amplitude, wavelength, speed, yOffset, opacity, hueTop, hueBottom } = layer;
    const phase = t * speed;
    const ampBoost = 1 + scrollFactor * 0.35;

    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, yOffset);

    const step = 10;
    for (let x = 0; x <= width; x += step) {
      const y =
        yOffset +
        Math.sin(x / wavelength + phase) * amplitude * ampBoost +
        Math.sin(x / (wavelength * 0.4) + phase * 1.7) * (amplitude * 0.18);
      ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, yOffset - amplitude, 0, height);
    gradient.addColorStop(0, `rgba(${hueTop}, ${opacity})`);
    gradient.addColorStop(1, `rgba(${hueBottom}, ${opacity * 0.4})`);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    for (let x = 0; x <= width; x += step) {
      const y =
        yOffset +
        Math.sin(x / wavelength + phase) * amplitude * ampBoost +
        Math.sin(x / (wavelength * 0.4) + phase * 1.7) * (amplitude * 0.18);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(205, 228, 255, ${opacity * 2})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  function drawRays(t) {
    rays.forEach((ray) => {
      const sway = Math.sin(t * ray.swaySpeed + ray.phase) * ray.swayAmount;
      const flicker = 0.7 + Math.sin(t * ray.flickerSpeed + ray.flickerPhase) * 0.3;
      const x = ray.x + sway;

      const gradient = ctx.createLinearGradient(x, 0, x, height * 0.8);
      gradient.addColorStop(0, `rgba(170, 205, 255, ${0.055 * flicker})`);
      gradient.addColorStop(1, 'rgba(170, 205, 255, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x - ray.width / 2, 0);
      ctx.lineTo(x + ray.width / 2, 0);
      ctx.lineTo(x + ray.width / 4, height * 0.8);
      ctx.lineTo(x - ray.width / 4, height * 0.8);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    });
  }

  function drawCaustics(t) {
    caustics.forEach((c) => {
      const pulse = 0.6 + Math.sin(t * c.pulseSpeed + c.phase) * 0.4;
      const dx = Math.cos(c.angle) * Math.sin(t * c.driftSpeed + c.phase) * 40;
      const dy = Math.sin(c.angle) * Math.cos(t * c.driftSpeed + c.phase) * 24;

      ctx.save();
      ctx.translate(c.x + dx, c.y + dy);
      ctx.rotate(c.angle + Math.sin(t * 0.05) * 0.2);
      ctx.beginPath();
      ctx.ellipse(0, 0, c.radiusX, c.radiusY, 0, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(c.radiusX, c.radiusY));
      grad.addColorStop(0, `rgba(150, 210, 255, ${0.05 * pulse})`);
      grad.addColorStop(1, 'rgba(150, 210, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    });
  }

  function drawParticles() {
    particles.forEach((p) => {
      p.y += p.speed;
      p.x += p.drift;

      if (p.y > height + 5) {
        Object.assign(p, spawnParticle(false));
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210, 228, 250, ${p.opacity})`;
      ctx.fill();
    });
  }

  function drawBubbles() {
    bubbles.forEach((b) => {
      b.y -= b.speed * (1 + scrollFactor * 0.3);
      b.wobble += 0.008;
      b.x += Math.sin(b.wobble) * b.drift * 0.5;

      if (b.y < -10) {
        Object.assign(b, spawnBubble(false));
      }

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 210, 255, ${b.opacity})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 1.4})`;
      ctx.fill();
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    time += 0.01;

    drawRays(time);
    drawCaustics(time);
    waveLayers.forEach((layer) => drawWaveLayer(layer, time));
    drawParticles();
    drawBubbles();

    animationId = requestAnimationFrame(draw);
  }

  function setup() {
    resize();
    setupWaves();
    setupRays();
    setupCaustics();
    setupBubbles();
    setupParticles();
  }

  function onScroll() {
    const scrollable = document.body.scrollHeight - window.innerHeight;
    scrollFactor = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
  }

  setup();
  onScroll();

  if (!prefersReducedMotion) {
    draw();
  } else {
    draw();
    cancelAnimationFrame(animationId);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  let resizeTimeout;
  window.addEventListener(
    'resize',
    () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setup, 200);
    },
    { passive: true }
  );
}
