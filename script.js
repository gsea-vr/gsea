document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initScrollReveal();
  initTeam();
  initWaterBackground();
  initDescentStory();
  initDepthFade();
  initHeroScroll();
  initDepthGauge();
});

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
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
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    if (el.classList.contains('team-card')) el.style.transitionDelay = `${(i % 4) * 90}ms`;
  });
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

/* ---------- Scroll-scrubbed hero + descent parallax ---------- */

let scrollState = { y: 0, vy: 0, progress: 0 };

function initHeroScroll() {
  const hero = document.getElementById('top');
  const content = hero && hero.querySelector('.hero-content');
  const cue = hero && hero.querySelector('.scroll-cue');
  const logo = hero && hero.querySelector('.hero-logo');
  const title = hero && hero.querySelector('.hero-title');
  if (!hero || !content) return;

  const steps = [...document.querySelectorAll('.descent-step')];
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    scrollState.vy = y - lastY;
    lastY = y;
    scrollState.y = y;

    const p = Math.min(Math.max(y / (vh * 0.9), 0), 1);
    const ease = 1 - Math.pow(1 - p, 3);
    content.style.transform = `translate3d(0, ${ease * -90}px, 0) scale(${1 - ease * 0.22})`;
    content.style.opacity = String(1 - Math.min(p * 1.35, 1));
    content.style.filter = `blur(${ease * 10}px)`;
    if (logo) logo.style.transform = `translateY(${ease * 30}px) rotate(${ease * -12}deg)`;
    if (title) title.style.letterSpacing = `${-0.015 + ease * 0.12}em`;
    if (cue) cue.style.opacity = String(0.8 * (1 - Math.min(p * 3, 1)));

    steps.forEach((step) => {
      const r = step.getBoundingClientRect();
      const center = r.top + r.height / 2 - vh / 2;
      const t = Math.max(-1, Math.min(1, center / vh));
      const visual = step.querySelector('.descent-visual');
      const copy = step.querySelector('.descent-copy');
      const svg = step.querySelector('svg');
      if (visual) visual.style.setProperty('--py', `${t * -40}px`);
      if (copy) copy.style.setProperty('--py', `${t * 26}px`);
      if (svg) svg.style.transform = `translateY(${t * 22}px) scale(${1.08 - Math.abs(t) * 0.06})`;
      step.style.setProperty('--focus', String(1 - Math.min(Math.abs(t) * 1.1, 1)));
    });
    ticking = false;
  };

  update();
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
}

function initDescentStory() {
  const steps = document.querySelectorAll('.descent-step');
  if (!steps.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      });
    },
    { threshold: 0.3 }
  );
  steps.forEach((step) => observer.observe(step));
}

/* Live depth gauge on the side that counts as you scroll */
function initDepthGauge() {
  const gauge = document.createElement('div');
  gauge.className = 'depth-gauge';
  gauge.setAttribute('aria-hidden', 'true');
  gauge.innerHTML = '<div class="depth-gauge-track"><div class="depth-gauge-fill"></div></div><div class="depth-gauge-num">0m</div>';
  document.body.appendChild(gauge);
  const fill = gauge.querySelector('.depth-gauge-fill');
  const num = gauge.querySelector('.depth-gauge-num');
  const descent = document.getElementById('descent');
  let ticking = false;

  const update = () => {
    const vh = window.innerHeight;
    const start = descent.offsetTop - vh * 0.5;
    const end = descent.offsetTop + descent.offsetHeight - vh * 0.5;
    const p = Math.min(Math.max((window.scrollY - start) / (end - start), 0), 1);
    fill.style.transform = `scaleY(${p})`;
    num.textContent = `${Math.round(p * 160)}m`;
    gauge.classList.toggle('visible', window.scrollY > vh * 0.4 && p < 1.0 || (p > 0 && p < 1));
    ticking = false;
  };
  update();
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
}

function initDepthFade() {
  const root = document.documentElement;
  let ticking = false;
  const update = () => {
    const scrollable = document.body.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    root.style.setProperty('--depth', Math.min(progress * 1.4, 1).toFixed(3));
    root.style.setProperty('--progress', progress.toFixed(3));
    ticking = false;
  };
  update();
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
}

const TEAM = [
  { name: 'Brian', role: 'Founder', avatar: 'https://cdn.discordapp.com/avatars/1152888630533173278/47e9635c912b60bf2a31f4b01ac31815.webp?size=1024' },
  { name: 'Cruey', role: 'Game Contributor', avatar: 'https://cdn.discordapp.com/avatars/203379230036328449/4a7b8c3efe7e225f0c2d27bb6161f065.webp?size=1024' },
  { name: 'Cyclone', role: 'Developer', avatar: 'https://cdn.discordapp.com/avatars/1063662980077719573/a_8348fd7f6ebe895dbb590d8d6beea3e2.webp?size=1024&animated=true' },
  { name: 'Kaalan', role: 'Developer', avatar: 'https://cdn.discordapp.com/avatars/143842384399171587/30d7c3f176c81c3975b882048d3ea1c6.webp?size=1024' },
  { name: 'Justin', role: 'Developer', avatar: 'https://cdn.discordapp.com/avatars/1143296941757829191/0c87f7088c29873f49a4a25fce8b46c4.webp?size=1024' },
  { name: 'Cl1cks', role: 'Developer', avatar: 'https://cdn.discordapp.com/avatars/666101752545935366/a291184987c910481dd9ae320cf5195e.webp?size=1024' },
  { name: 'Izzy', role: 'Community Lead', avatar: 'https://cdn.discordapp.com/avatars/1313630076809510975/f20e82dd57d845756fcb2af9b0f4a76f.webp?size=1024', lanyardId: '1313630076809510975' },
  { name: 'Neboskript', role: 'Game Contributor', avatar: 'https://cdn.discordapp.com/avatars/954757805531889715/c145587f7192449a028ec56318b4ab09.webp?size=1024' },
];

function initTeam() {
  const grid = document.getElementById('teamGrid');
  if (!grid) return;
  const initials = (name) => name.trim().charAt(0).toUpperCase();

  TEAM.forEach((member) => {
    const card = document.createElement('div');
    card.className = 'team-card';
    const hasLanyard = Boolean(member.lanyardId);

    card.innerHTML = `
      <div class="team-avatar-wrap">
        <img class="team-avatar" src="${member.avatar}" alt="${member.name}" loading="lazy"
          onerror="this.onerror=null; this.src='${fallbackAvatarDataUri(initials(member.name))}';" />
        ${hasLanyard ? '<span class="status-dot offline" data-role="status-dot"></span>' : ''}
      </div>
      <div class="team-name">${member.name}</div>
      <div class="team-role">${member.role}</div>
      ${hasLanyard ? '<div class="team-presence" data-role="presence"></div>' : ''}
    `;
    grid.appendChild(card);
    if (hasLanyard) startLanyard(member.lanyardId, card);
  });
}

function fallbackAvatarDataUri(letter) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="32" fill="#141c27"/><text x="50%" y="54%" font-family="sans-serif" font-size="24" font-weight="600" fill="#576270" text-anchor="middle" dominant-baseline="middle">${letter}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/* Lanyard: WebSocket for live presence (with heartbeat + reconnect), REST as fallback.
   The user MUST be in the Lanyard Discord server (discord.gg/lanyard) or data never returns. */
function startLanyard(userId, cardEl) {
  const dot = cardEl.querySelector('[data-role="status-dot"]');
  const presenceEl = cardEl.querySelector('[data-role="presence"]');
  let ws, hb, retry = 0, gotData = false, restTimer;

  const apply = (data) => { gotData = true; applyLanyardData(data, dot, presenceEl, cardEl); };

  const rest = () => {
    fetch(`https://api.lanyard.rest/v1/users/${userId}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => {
        if (j && j.success && j.data) apply(j.data);
        else if (dot && !gotData) setDot(dot, 'offline');
      })
      .catch(() => { if (dot && !gotData) setDot(dot, 'offline'); });
  };

  const connect = () => {
    try { ws = new WebSocket('wss://api.lanyard.rest/socket'); } catch (e) { rest(); return; }
    ws.onmessage = (ev) => {
      let msg; try { msg = JSON.parse(ev.data); } catch (e) { return; }
      if (msg.op === 1) {
        clearInterval(hb);
        hb = setInterval(() => ws.readyState === 1 && ws.send(JSON.stringify({ op: 3 })), msg.d.heartbeat_interval);
        ws.send(JSON.stringify({ op: 2, d: { subscribe_to_ids: [userId] } }));
      } else if (msg.op === 0) {
        const d = msg.t === 'INIT_STATE' ? (msg.d[userId] || msg.d) : msg.d;
        if (d && (d.discord_status || d.discord_user)) apply(d);
        retry = 0;
      }
    };
    ws.onclose = () => {
      clearInterval(hb);
      setTimeout(connect, Math.min(30000, 1000 * Math.pow(2, retry++)));
    };
    ws.onerror = () => ws.close();
  };

  rest();
  connect();
  restTimer = setInterval(rest, 60000);
}

function setDot(dot, status) {
  dot.classList.remove('online', 'idle', 'dnd', 'offline');
  dot.classList.add(['online', 'idle', 'dnd', 'offline'].includes(status) ? status : 'offline');
}

function applyLanyardData(data, dot, presenceEl, cardEl) {
  if (dot) setDot(dot, data.discord_status || 'offline');

  const user = data.discord_user;
  const wrap = cardEl.querySelector('.team-avatar-wrap');
  const img = cardEl.querySelector('.team-avatar');

  if (user && user.avatar && img) {
    const ext = user.avatar.startsWith('a_') ? 'gif' : 'webp';
    const url = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=256`;
    if (img.dataset.live !== url) { img.dataset.live = url; img.src = url; }
  }

  if (wrap && user && user.avatar_decoration_data && user.avatar_decoration_data.asset) {
    let deco = wrap.querySelector('.avatar-decoration');
    if (!deco) {
      deco = document.createElement('img');
      deco.className = 'avatar-decoration';
      deco.alt = '';
      wrap.appendChild(deco);
    }
    deco.src = `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png?size=96&passthrough=true`;
    deco.onerror = () => deco.remove();
  }

  if (!presenceEl) return;
  const acts = data.activities || [];
  const custom = acts.find((a) => a.type === 4);
  const other = acts.find((a) => a.type !== 4);
  presenceEl.textContent = '';

  if (other && other.name) {
    const verbs = { 0: 'Playing', 1: 'Streaming', 2: 'Listening to', 3: 'Watching', 5: 'Competing in' };
    const span = document.createElement('span');
    span.className = 'activity';
    span.textContent = `${verbs[other.type] || ''} ${other.name}`.trim();
    presenceEl.appendChild(span);
  } else if (custom && (custom.state || custom.emoji)) {
    presenceEl.textContent = `${custom.emoji && custom.emoji.name ? custom.emoji.name + ' ' : ''}${custom.state || ''}`.trim();
  }
}

/* ---------- Realistic water background ---------- */
function initWaterBackground() {
  const canvas = document.getElementById('waterCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let bubbles = [], waveLayers = [], rays = [], caustics = [], particles = [], fish = [];
  let time = 0, animationId, scrollFactor = 0, smoothScroll = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // offscreen caustic tile (voronoi-ish web pattern) for realistic light networks
  const tile = document.createElement('canvas');
  const TILE = 256;
  tile.width = tile.height = TILE;
  (function buildTile() {
    const c = tile.getContext('2d');
    const pts = Array.from({ length: 22 }, () => [Math.random() * TILE, Math.random() * TILE]);
    const img = c.createImageData(TILE, TILE);
    for (let y = 0; y < TILE; y++) for (let x = 0; x < TILE; x++) {
      let d1 = 1e9, d2 = 1e9;
      for (const p of pts) for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) {
        const dx = x - (p[0] + ox * TILE), dy = y - (p[1] + oy * TILE);
        const d = dx * dx + dy * dy;
        if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
      }
      const edge = Math.sqrt(d2) - Math.sqrt(d1);
      const v = Math.max(0, 1 - edge / 7);
      const i = (y * TILE + x) * 4;
      img.data[i] = 170; img.data[i + 1] = 215; img.data[i + 2] = 255;
      img.data[i + 3] = Math.pow(v, 2) * 255;
    }
    c.putImageData(img, 0, 0);
  })();

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = width * dpr; canvas.height = height * dpr;
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
    const count = 7;
    rays = Array.from({ length: count }, (_, i) => ({
      x: (width / (count + 1)) * (i + 1) + (Math.random() - 0.5) * 60,
      width: 40 + Math.random() * 70,
      swaySpeed: 0.1 + Math.random() * 0.12,
      swayAmount: 24 + Math.random() * 24,
      phase: Math.random() * Math.PI * 2,
      flickerSpeed: 0.5 + Math.random() * 0.8,
      flickerPhase: Math.random() * Math.PI * 2,
      tilt: 0.15 + Math.random() * 0.15,
    }));
  }

  function setupCaustics() {
    const count = Math.max(5, Math.min(9, Math.floor(width / 220)));
    caustics = Array.from({ length: count }, () => ({
      x: Math.random() * width, y: Math.random() * height * 0.8,
      radiusX: 90 + Math.random() * 140, radiusY: 30 + Math.random() * 50,
      driftSpeed: 0.05 + Math.random() * 0.08, pulseSpeed: 0.3 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2, angle: Math.random() * Math.PI,
    }));
  }

  function spawnBubble(randomY) {
    const radius = 1.2 + Math.random() * 3.6;
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + radius + 10,
      radius, speed: 0.12 + Math.random() * 0.4 + radius * 0.05,
      drift: (Math.random() - 0.5) * 0.28,
      opacity: 0.06 + Math.random() * 0.12, wobble: Math.random() * Math.PI * 2,
      depth: 0.5 + Math.random() * 1.2,
    };
  }
  function setupBubbles() {
    const count = Math.max(16, Math.min(34, Math.floor(width / 60)));
    bubbles = Array.from({ length: count }, () => spawnBubble(true));
  }

  function spawnParticle(randomY) {
    return {
      x: Math.random() * width, y: randomY ? Math.random() * height : -5,
      radius: 0.4 + Math.random() * 1, speed: 0.04 + Math.random() * 0.1,
      drift: (Math.random() - 0.5) * 0.1, opacity: 0.03 + Math.random() * 0.06,
      depth: 0.3 + Math.random() * 1.5,
    };
  }
  function setupParticles() {
    const count = Math.max(30, Math.min(70, Math.floor((width * height) / 20000)));
    particles = Array.from({ length: count }, () => spawnParticle(true));
  }

  function setupFish() {
    fish = Array.from({ length: 3 }, (_, i) => ({
      x: Math.random() * width, y: height * (0.3 + Math.random() * 0.4),
      dir: Math.random() > 0.5 ? 1 : -1, size: 40 + Math.random() * 60,
      speed: 0.15 + Math.random() * 0.2, phase: Math.random() * 10, depthBias: i * 0.3,
    }));
  }

  function drawWaveLayer(layer, t) {
    const { amplitude, wavelength, speed, yOffset, opacity, hueTop, hueBottom } = layer;
    const phase = t * speed;
    const ampBoost = 1 + scrollFactor * 0.35;
    const yShift = -smoothScroll * 0.08 * (yOffset / height);
    const yAt = (x) => yOffset + yShift +
      Math.sin(x / wavelength + phase) * amplitude * ampBoost +
      Math.sin(x / (wavelength * 0.4) + phase * 1.7) * (amplitude * 0.18);
    const step = 10;

    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width; x += step) ctx.lineTo(x, yAt(x));
    ctx.lineTo(width, height);
    ctx.closePath();
    const g = ctx.createLinearGradient(0, yOffset - amplitude, 0, height);
    g.addColorStop(0, `rgba(${hueTop}, ${opacity})`);
    g.addColorStop(1, `rgba(${hueBottom}, ${opacity * 0.4})`);
    ctx.fillStyle = g; ctx.fill();

    ctx.beginPath();
    for (let x = 0; x <= width; x += step) x === 0 ? ctx.moveTo(x, yAt(x)) : ctx.lineTo(x, yAt(x));
    ctx.strokeStyle = `rgba(205, 228, 255, ${opacity * 2})`;
    ctx.lineWidth = 1.2; ctx.stroke();
  }

  function drawRays(t) {
    // rays fade with depth — sunlight can't reach the trench
    const fade = Math.max(0, 1 - scrollFactor * 1.6);
    if (fade <= 0.01) return;
    rays.forEach((ray) => {
      const sway = Math.sin(t * ray.swaySpeed + ray.phase) * ray.swayAmount;
      const flicker = 0.7 + Math.sin(t * ray.flickerSpeed + ray.flickerPhase) * 0.3;
      const x = ray.x + sway;
      const len = height * 0.95;
      const skew = len * ray.tilt;
      const g = ctx.createLinearGradient(x, 0, x + skew, len);
      g.addColorStop(0, `rgba(175, 210, 255, ${0.075 * flicker * fade})`);
      g.addColorStop(0.6, `rgba(150, 195, 255, ${0.02 * flicker * fade})`);
      g.addColorStop(1, 'rgba(150, 195, 255, 0)');
      ctx.beginPath();
      ctx.moveTo(x - ray.width / 2, 0);
      ctx.lineTo(x + ray.width / 2, 0);
      ctx.lineTo(x + skew + ray.width, len);
      ctx.lineTo(x + skew - ray.width, len);
      ctx.closePath();
      ctx.fillStyle = g; ctx.fill();
    });
  }

  function drawCausticTile(t) {
    const fade = Math.max(0, 1 - scrollFactor * 1.8);
    if (fade <= 0.01) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.16 * fade;
    const sizes = [1.6, 2.4];
    sizes.forEach((s, i) => {
      const sz = TILE * s;
      const ox = (t * (12 + i * 9) + smoothScroll * 0.05) % sz;
      const oy = (t * (7 - i * 3) * (i ? -1 : 1) + smoothScroll * 0.03) % sz;
      const grad = ctx.createLinearGradient(0, 0, 0, height * 0.9);
      ctx.globalAlpha = (0.14 - i * 0.04) * fade;
      for (let x = -sz + ox; x < width; x += sz)
        for (let y = -sz + oy; y < height * 0.9; y += sz)
          ctx.drawImage(tile, x, y, sz, sz);
    });
    // fade lower part using destination-out mask
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = 1;
    const mask = ctx.createLinearGradient(0, height * 0.35, 0, height);
    mask.addColorStop(0, 'rgba(0,0,0,0)');
    mask.addColorStop(1, 'rgba(0,0,0,0.0)');
    ctx.restore();
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
      ctx.fillStyle = grad; ctx.fill();
      ctx.restore();
    });
  }

  function drawFish(t) {
    // distant shark silhouettes, more visible mid-depth
    const vis = Math.sin(Math.min(scrollFactor * 1.3, 1) * Math.PI) * 0.9;
    if (vis <= 0.02) return;
    fish.forEach((f) => {
      f.x += f.dir * f.speed;
      if (f.dir > 0 && f.x > width + f.size * 2) f.x = -f.size * 2;
      if (f.dir < 0 && f.x < -f.size * 2) f.x = width + f.size * 2;
      const y = f.y + Math.sin(t * 0.4 + f.phase) * 14 - smoothScroll * 0.03 * (1 + f.depthBias);
      const s = f.size;
      ctx.save();
      ctx.translate(f.x, ((y % (height + 200)) + height + 200) % (height + 200) - 100);
      ctx.scale(f.dir, 1);
      const tail = Math.sin(t * 2 + f.phase) * s * 0.06;
      ctx.beginPath();
      ctx.moveTo(-s, tail);
      ctx.quadraticCurveTo(-s * 0.4, -s * 0.22, s * 0.55, -s * 0.05);
      ctx.quadraticCurveTo(s, 0, s * 1.1, s * 0.05);
      ctx.quadraticCurveTo(s * 0.4, s * 0.2, -s * 0.5, s * 0.06);
      ctx.lineTo(-s * 1.15, s * 0.28 + tail);
      ctx.lineTo(-s * 1.0, tail * 0.5);
      ctx.lineTo(-s * 1.2, -s * 0.24 + tail);
      ctx.closePath();
      ctx.fillStyle = `rgba(8, 16, 28, ${0.2 * vis})`;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(s * 0.05, -s * 0.13);
      ctx.lineTo(-s * 0.12, -s * 0.34);
      ctx.lineTo(-s * 0.25, -s * 0.1);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
  }

  function drawParticles() {
    const boost = 1 + Math.abs(scrollState.vy) * 0.04;
    particles.forEach((p) => {
      p.y += p.speed + (-scrollState.vy * 0.15 * p.depth);
      p.x += p.drift;
      if (p.y > height + 5 || p.y < -30) Object.assign(p, spawnParticle(false), p.y < -30 ? { y: height + 5 } : {});
      if (p.x < -5) p.x = width + 5; if (p.x > width + 5) p.x = -5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * (0.8 + p.depth * 0.3), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210, 228, 250, ${Math.min(p.opacity * boost, 0.2)})`;
      ctx.fill();
    });
  }

  function drawBubbles() {
    bubbles.forEach((b) => {
      b.y -= b.speed * (1 + scrollFactor * 0.3) * b.depth + scrollState.vy * -0.0;
      b.y += -scrollState.vy * 0.25 * b.depth;
      b.wobble += 0.012;
      b.x += Math.sin(b.wobble) * b.drift * 0.6;
      if (b.y < -10) Object.assign(b, spawnBubble(false));
      if (b.y > height + 60) b.y = -10;

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(190, 220, 255, ${b.opacity * 1.6})`;
      ctx.lineWidth = 0.8; ctx.stroke();
      const rg = ctx.createRadialGradient(b.x - b.radius * 0.3, b.y - b.radius * 0.3, 0, b.x, b.y, b.radius);
      rg.addColorStop(0, `rgba(255,255,255,${b.opacity * 0.9})`);
      rg.addColorStop(1, `rgba(180,210,255,${b.opacity * 0.15})`);
      ctx.fillStyle = rg; ctx.fill();
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    time += 0.01;
    smoothScroll += (window.scrollY - smoothScroll) * 0.08;
    scrollState.vy *= 0.9;

    drawRays(time);
    drawCausticTile(time);
    drawCaustics(time);
    waveLayers.forEach((l) => drawWaveLayer(l, time));
    drawFish(time);
    drawParticles();
    drawBubbles();

    animationId = requestAnimationFrame(draw);
  }

  function setup() {
    resize(); setupWaves(); setupRays(); setupCaustics(); setupBubbles(); setupParticles(); setupFish();
  }

  function onScroll() {
    const scrollable = document.body.scrollHeight - window.innerHeight;
    scrollFactor = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
  }

  setup();
  onScroll();
  draw();
  if (reduced) cancelAnimationFrame(animationId);

  window.addEventListener('scroll', onScroll, { passive: true });
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(setup, 200); }, { passive: true });
}
