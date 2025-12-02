const pastelPalette = ["#ffb6c1", "#ffd1dc", "#e6c8ff", "#c0f5ff", "#f8e1ff"];

document.addEventListener("DOMContentLoaded", () => {
  initHeartCursor();
  document.querySelectorAll("[data-floating-hearts]").forEach(initFloatingHearts);
  initTypewriter();
  initZoomIn();
  initSparkles();
  initBalloons();
  initConfetti();
  initCandle();
  initGlitterLayer();
  initBalloonBurst();
  initPhotoFlips();
  initPage3Effects();
  initHeroVideoSound();
});

function initHeartCursor() {
  const prefersCoarse = window.matchMedia("(pointer: coarse)").matches;
  if (prefersCoarse) {
    document.body.style.cursor = "auto";
    return;
  }

  const cursor = document.createElement("div");
  cursor.className = "heart-cursor";
  cursor.style.left = "50%";
  cursor.style.top = "50%";
  document.body.appendChild(cursor);

  const moveX = window.gsap ? gsap.quickTo(cursor, "left", { duration: 0.2, ease: "power3.out" }) : null;
  const moveY = window.gsap ? gsap.quickTo(cursor, "top", { duration: 0.2, ease: "power3.out" }) : null;

  document.addEventListener("pointermove", (e) => {
    if (moveX && moveY) {
      moveX(e.clientX);
      moveY(e.clientY);
    } else {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    }
  });

  document.addEventListener("pointerdown", () => cursor.classList.add("active"));
  document.addEventListener("pointerup", () => cursor.classList.remove("active"));
}

function initFloatingHearts(container) {
  const total = container.dataset.count ? Number(container.dataset.count) : 18;
  for (let i = 0; i < total; i += 1) {
    const span = document.createElement("span");
    span.style.left = `${Math.random() * 100}%`;
    span.style.bottom = "-20px";
    span.style.animationDuration = `${6 + Math.random() * 6}s`;
    span.style.animationDelay = `${Math.random() * 4}s`;
    span.style.background = `radial-gradient(circle at 30% 30%, #fff, ${pastelPalette[i % pastelPalette.length]})`;
    container.appendChild(span);
  }
}

function initTypewriter() {
  const target = document.querySelector("[data-typewriter]");
  if (!target) return;

  const text = target.dataset.text?.trim() || target.textContent.trim();
  target.textContent = "";
  let index = 0;
  const speed = 65;

  const interval = setInterval(() => {
    target.textContent += text.charAt(index);
    index += 1;
    if (index >= text.length) {
      clearInterval(interval);
      target.style.borderRightColor = "transparent";
    }
  }, speed);
}

function initZoomIn() {
  if (!window.gsap) return;
  document.querySelectorAll("[data-zoom-in]").forEach((el, idx) => {
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.92, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 1, delay: idx * 0.15, ease: "power3.out" }
    );
  });
}

function initSparkles() {
  document.querySelectorAll("[data-sparkles]").forEach((wrapper) => {
    const count = 20;
    for (let i = 0; i < count; i += 1) {
      const sparkle = document.createElement("span");
      sparkle.className = "sparkle";
      sparkle.style.position = "absolute";
      sparkle.style.width = "6px";
      sparkle.style.height = "6px";
      sparkle.style.borderRadius = "50%";
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.background = "radial-gradient(circle, #fff, rgba(255, 255, 255, 0))";
      sparkle.style.opacity = `${Math.random() * 0.9}`;
      sparkle.style.animation = `twinkle ${3 + Math.random() * 4}s linear infinite`;
      wrapper.appendChild(sparkle);
    }
  });
}

function initBalloons() {
  const container = document.querySelector("[data-balloons]");
  if (!container) return;
  const count = Number(container.dataset.balloons) || 6;
  for (let i = 0; i < count; i += 1) {
    const balloon = document.createElement("div");
    balloon.className = "balloon";
    balloon.style.setProperty("--balloon-color", pastelPalette[i % pastelPalette.length]);
    balloon.style.left = `${Math.random() * 90}%`;
    balloon.style.animationDuration = `${9 + Math.random() * 4}s`;
    balloon.style.animationDelay = `${Math.random() * 3}s`;
    container.appendChild(balloon);
  }
}

function initConfetti() {
  const container = document.querySelector("[data-confetti]");
  if (!container) return;
  const amount = 40;
  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement("span");
    piece.style.left = `${Math.random("S") * 100}%`;
    piece.style.animationDuration = `${4 + Math.random() * 3}s`;
    piece.style.animationDelay = `${Math.random() * 2}s`;
    piece.style.background = pastelPalette[i % pastelPalette.length];
    container.appendChild(piece);
  }
}

function initCandle() {
  const stage = document.querySelector("[data-candle-stage]");
  const button = document.querySelector("[data-blow]");
  const photoGrid = document.querySelector(".photo-grid");
  const fireworkLayer = document.querySelector("[data-firework-layer]");
  const burstLayer = document.querySelector("[data-balloon-burst]");
  const sprayLayer = document.querySelector("[data-spray-layer]");
  if (!stage || !button) return;

  let blown = false;
  const extinguish = () => {
    if (blown) return;
    blown = true;
    button.disabled = true;
    // play blow sound (user click is a user gesture so audio will play)
    playBlowSound();

    // compute origin near the candle to emit fireworks/spray/balloons
    const rect = stage.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 3;

    // Animate using GSAP when available for a polished sequence
    if (window.gsap) {
      const mainEl = document.querySelector('main');
      const flameEl = stage.querySelector('.flame');
      const smokeEl = stage.querySelector('.smoke');
      const tl = gsap.timeline();

      // small camera/head-nod + button pulse
      tl.to(mainEl, { scale: 1.02, duration: 0.12, ease: 'power2.out' });
      tl.to(mainEl, { scale: 1, duration: 0.18, ease: 'power2.out' });

      // extinguish flame and show smoke
      tl.to(flameEl, { opacity: 0, duration: 0.18, ease: 'power1.out' }, '-=0.18');
      tl.to(smokeEl, { opacity: 1, duration: 0.28, ease: 'power1.out' }, '-=0.12');

      // visual button pulse
      tl.to(button, { scale: 1.06, duration: 0.12, ease: 'power1.out', yoyo: true, repeat: 1 }, '<');

      // fireworks, spray, balloons slightly delayed to sync with sound
      tl.call(() => {
        stage.classList.add('is-out');
      }, null, '+=0.02');

      tl.call(() => {
        if (fireworkLayer) launchFireworks(fireworkLayer, 'red', originX, originY);
        if (sprayLayer) launchRedSpray(sprayLayer, originX, originY);
        if (burstLayer) launchBurstBalloons(burstLayer, originX, originY);
      }, null, '+=0.06');

      // reveal photos after animations
      tl.call(() => photoGrid?.classList.add('revealed'), null, '+=0.5');
    } else {
      // fallback without GSAP
      stage.classList.add('is-out');
      if (fireworkLayer) launchFireworks(fireworkLayer, 'red', originX, originY);
      if (sprayLayer) launchRedSpray(sprayLayer, originX, originY);
      if (burstLayer) launchBurstBalloons(burstLayer, originX, originY);
      setTimeout(() => photoGrid?.classList.add('revealed'), 800);
    }

    // temporary CSS pulse class (kept as extra polish)
    button.classList.add('pulse');
    setTimeout(() => button.classList.remove('pulse'), 900);
    button.textContent = 'Make a wish ✨';
  };

  button.addEventListener("click", extinguish);

  if ("ondevicemotion" in window) {
    window.addEventListener(
      "devicemotion",
      (event) => {
        if (!event.accelerationIncludingGravity) return;
        const { x, y, z } = event.accelerationIncludingGravity;
        const shake = Math.abs(x) + Math.abs(y) + Math.abs(z);
        if (shake > 35) {
          extinguish();
        }
      },
      { passive: true }
    );
  }
}

function initGlitterLayer() {
  document.querySelectorAll(".glitter-layer").forEach((layer) => {
    const flakes = 30;
    for (let i = 0; i < flakes; i += 1) {
      const dot = document.createElement("span");
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.bottom = `${Math.random() * 100}%`;
      dot.style.animationDelay = `${Math.random() * 6}s`;
      dot.style.animationDuration = `${4 + Math.random() * 4}s`;
      layer.appendChild(dot);
    }
  });
}

function initBalloonBurst() {
  const trigger = document.querySelector("[data-balloon-trigger]");
  const burstLayer = document.querySelector("[data-balloon-burst]");
  if (!trigger || !burstLayer) return;

  const launchBalloons = (originX, originY) => {
    const total = 10;
    for (let i = 0; i < total; i += 1) {
      const balloon = document.createElement("span");
      balloon.className = "burst-balloon";
      balloon.style.left = `${originX + (Math.random() * 120 - 60)}px`;
      balloon.style.top = `${originY + Math.random() * 40}px`;
      balloon.style.setProperty("--burst-color", pastelPalette[i % pastelPalette.length]);
      balloon.style.setProperty("--drift-x", `${Math.random() * 80 - 40}px`);
      burstLayer.appendChild(balloon);
      setTimeout(() => balloon.remove(), 1600);
    }
  };

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    const rect = trigger.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const topY = rect.top;
    launchBalloons(centerX, topY);
    setTimeout(() => {
      window.location.href = trigger.href;
    }, 1200);
  });
}

function initHeroVideoSound() {
  const video = document.querySelector("[data-auto-sound]");
  if (!video) return;

  video.muted = false;
  const tryPlay = () =>
    video
      .play()
      .then(() => document.removeEventListener("pointerdown", onInteract))
      .catch(() => {
        /* ignore until user interaction */
      });

  const onInteract = () => {
    video.muted = false;
    tryPlay();
  };

  tryPlay();
  document.addEventListener("pointerdown", onInteract, { once: true });
}

// Lightweight WebAudio blow/pop sound. Uses a single shared AudioContext.
function _getBirthdayAudioCtx() {
  if (!window._birthdayAudioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    try {
      window._birthdayAudioCtx = new Ctx();
    } catch (e) {
      window._birthdayAudioCtx = null;
    }
  }
  return window._birthdayAudioCtx;
}

function playBlowSound() {
  const ctx = _getBirthdayAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  // short tonal 'pop' sweep
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(260, now + 0.12);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.001, now);
  g.gain.exponentialRampToValueAtTime(0.6, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.45);

  // noise burst for 'whoosh' / puff
  const length = Math.floor(ctx.sampleRate * 0.28);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    // tapered white noise
    data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 1200;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.6, now);
  ng.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
  noise.connect(bp);
  bp.connect(ng);
  ng.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.45);
}

function launchFireworks(layer, theme = "mix", originX, originY) {
  const bursts = 6;
  for (let i = 0; i < bursts; i += 1) {
    setTimeout(() => createFirework(layer, theme, originX, originY), i * 200);
  }
}

function createFirework(layer, theme = "mix", originX, originY) {
  const centerX = originX ?? Math.random() * window.innerWidth;
  const centerY = originY ?? Math.random() * (window.innerHeight * 0.6);
  const sparkCount = 14;

  const redPalette = ["#ff3b3b", "#ff6b6b", "#ff2d2d", "#ff8a8a", "#ff0000"];

  for (let i = 0; i < sparkCount; i += 1) {
    const angle = (Math.PI * 2 * i) / sparkCount;
    const distance = 120 + Math.random() * 80;
    const firework = document.createElement("span");
    firework.className = "firework";
    firework.style.left = `${centerX}px`;
    firework.style.top = `${centerY}px`;
    firework.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
    firework.style.setProperty("--ty", `${Math.sin(angle) * distance}px`);
    if (theme === "red") {
      const c = redPalette[i % redPalette.length];
      firework.style.background = `radial-gradient(circle, #fff, ${c})`;
    } else {
      firework.style.background = `radial-gradient(circle, #fff, ${pastelPalette[i % pastelPalette.length]})`;
    }
    layer.appendChild(firework);
    setTimeout(() => firework.remove(), 1400);
  }

  for (let j = 0; j < 10; j += 1) {
    const star = document.createElement("span");
    star.className = "firework-star";
    star.style.left = `${centerX}px`;
    star.style.top = `${centerY}px`;
    star.style.setProperty("--tx", `${Math.random() * 180 - 90}px`);
    star.style.setProperty("--ty", `${-80 - Math.random() * 120}px`);
    if (theme === "red") star.style.background = "radial-gradient(circle, #fff, #ff4b4b)";
    layer.appendChild(star);
    setTimeout(() => star.remove(), 1400);
  }
}

function launchBurstBalloons(layer, originX, originY) {
  const total = 12;
  for (let i = 0; i < total; i += 1) {
    const balloon = document.createElement("span");
    balloon.className = "burst-balloon";
    balloon.style.left = `${originX + (Math.random() * 160 - 80)}px`;
    balloon.style.top = `${originY + Math.random() * 40}px`;
    // make burst balloons mostly red/pink shades for this blast
    const redShades = ["#ff7b7b", "#ff4b6b", "#ff9ab0", "#ff3b3b"];
    balloon.style.setProperty("--burst-color", redShades[i % redShades.length]);
    balloon.style.setProperty("--drift-x", `${Math.random() * 120 - 60}px`);
    layer.appendChild(balloon);
    setTimeout(() => balloon.remove(), 2000);
  }
}

function launchRedSpray(layer, originX, originY) {
  if (!layer) return;
  const particles = 28;
  for (let i = 0; i < particles; i += 1) {
    const p = document.createElement("span");
    p.className = "spray-particle";
    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 160;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist - Math.random() * 60;
    p.style.left = `${originX}px`;
    p.style.top = `${originY}px`;
    p.style.setProperty("--tx", `${tx}px`);
    p.style.setProperty("--ty", `${ty}px`);
    const reds = ["#ff3b3b", "#ff6b6b", "#ff2d2d", "#ff8a8a"];
    p.style.background = reds[i % reds.length];
    layer.appendChild(p);
    setTimeout(() => p.remove(), 900 + Math.random() * 700);
  }
}

// Initialize photo flip handlers for .photo-grid flip cards
function initPhotoFlips() {
  const grid = document.querySelector('.photo-grid');
  if (!grid) return;

  // Auto-flip cards with staggered timing when grid becomes visible
  const autoFlipOnReveal = () => {
    const cards = grid.querySelectorAll('.flip-card');
    cards.forEach((card, idx) => {
      setTimeout(() => {
        card.classList.add('is-flipped');
      }, idx * 180);
    });
  };

  // Trigger auto-flip when the grid becomes visible (revealed class added)
  if (grid.classList.contains('revealed')) {
    autoFlipOnReveal();
  } else {
    // Watch for the revealed class using MutationObserver
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (grid.classList.contains('revealed')) {
            autoFlipOnReveal();
            observer.disconnect();
          }
        }
      });
    });
    observer.observe(grid, { attributes: true });
  }

  // Manual flip/unflip via buttons
  grid.addEventListener('click', (e) => {
    const flipBtn = e.target.closest('[data-flip]');
    if (flipBtn) {
      const card = flipBtn.closest('.flip-card');
      if (card) card.classList.add('is-flipped');
      return;
    }

    const unflip = e.target.closest('[data-unflip]');
    if (unflip) {
      const card = unflip.closest('.flip-card');
      if (card) card.classList.remove('is-flipped');
      return;
    }

    // clicking the back image should also close
    const backImg = e.target.closest('.flip-back img');
    if (backImg) {
      const card = backImg.closest('.flip-card');
      if (card) card.classList.remove('is-flipped');
    }
  });

  // allow ESC to close all
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      document.querySelectorAll('.flip-card.is-flipped').forEach((c) => c.classList.remove('is-flipped'));
    }
  });
}

// Page 3 specific effects: confetti burst, floating hearts, glitter layer
function initPage3Effects() {
  const page = document.body.getAttribute('data-page');
  if (page !== 'page3') return;

  // Trigger confetti burst after short delay
  setTimeout(() => {
    const confettiContainer = document.querySelector('[data-confetti]');
    if (confettiContainer && confettiContainer.children.length > 0) {
      // trigger confetti fall animation by setting visibility
      Array.from(confettiContainer.children).forEach((piece) => {
        piece.style.animation = `confettiFall linear infinite`;
      });
    }
  }, 300);

  // Initialize glitter layer with random sparkles
  const glitterLayer = document.querySelector('[data-page3-glitter]');
  if (glitterLayer) {
    const sparkles = 24;
    for (let i = 0; i < sparkles; i++) {
      const sparkle = document.createElement('span');
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.animationDelay = `${Math.random() * 3}s`;
      sparkle.style.animationDuration = `${3 + Math.random() * 2}s`;
      glitterLayer.appendChild(sparkle);
    }
  }

  // Initialize floating hearts on page3
  const heartsContainer = document.querySelector('[data-floating-hearts]');
  if (heartsContainer && heartsContainer.children.length === 0) {
    initFloatingHearts(heartsContainer);
  }
}
