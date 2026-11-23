document.addEventListener("DOMContentLoaded", () => {
  const stage = document.getElementById("butterfly-3d-stage");
  const pivot = document.getElementById("butterfly-3d-pivot");
  const rippleLayer = document.getElementById("butterfly-ripple-layer");
  const angleReadout = document.getElementById("butterfly-angle-readout");
  const resetBtn = document.getElementById("butterfly-reset-btn");
  const particlesLayer = document.getElementById("romantic-particles-layer");
  const fireflyLayer = document.getElementById("fav-firefly-layer");
  const butterflySection = document.getElementById("kupu-kupu-ungu-3d");
  const moodCaptionEl = document.getElementById("butterfly-mood-caption");
  const moodButtons = Array.from(
    document.querySelectorAll("[data-butterfly-mood]"),
  );
  const progressThreadEl = document.getElementById("scroll-progress-thread");
  const portalShellEl = document.getElementById("portal-magnetic-shell");
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let scrollDirty = true;
  let pointerDirty = false;
  let pointerOffsetX = 0;
  let pointerOffsetY = 0;

  /**
   * =================================================================
   * -1. SCROLL PROGRESS THREAD DI BAWAH NAVBAR
   * =================================================================
   */
  function updateScrollThread() {
    if (!progressThreadEl) return;
    const docEl = document.documentElement;
    const scrollable = Math.max(
      1,
      (docEl.scrollHeight || document.body.scrollHeight || 1) -
        window.innerHeight,
    );
    const pct = Math.max(
      0,
      Math.min(100, ((window.scrollY || 0) / scrollable) * 100),
    );
    progressThreadEl.style.width = `${pct.toFixed(2)}%`;
  }

  /**
   * =================================================================
   * 0. KUNANG-KUNANG / CONSTELLATION INTERAKTIF DI LATAR BELAKANG
   * =================================================================
   */
  const fireflyDots = [];
  if (fireflyLayer && !prefersReducedMotion) {
    const totalFireflies = 18;
    for (let i = 0; i < totalFireflies; i++) {
      const dot = document.createElement("span");
      dot.className = "fav-firefly-dot";
      const size = (Math.random() * 5 + 3).toFixed(1);
      const baseLeft = Math.random() * 100;
      const baseTop = Math.random() * 100;
      const dx = ((Math.random() - 0.5) * 44).toFixed(1);
      const dy = ((Math.random() - 0.5) * 44).toFixed(1);
      const dur = (Math.random() * 4 + 4.2).toFixed(2);
      const delay = (Math.random() * 3.5).toFixed(2);
      const depth = (Math.random() * 0.6 + 0.35).toFixed(2);

      dot.style.left = `${baseLeft.toFixed(2)}%`;
      dot.style.top = `${baseTop.toFixed(2)}%`;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.setProperty("--ff-dx", `${dx}px`);
      dot.style.setProperty("--ff-dy", `${dy}px`);
      dot.style.setProperty("--ff-dur", `${dur}s`);
      dot.style.setProperty("--ff-delay", `${delay}s`);

      fireflyLayer.appendChild(dot);
      fireflyDots.push({
        el: dot,
        depth: parseFloat(depth),
      });
    }

    document.addEventListener(
      "pointermove",
      (e) => {
        const vw = Math.max(window.innerWidth || 1, 1);
        const vh = Math.max(window.innerHeight || 1, 1);
        pointerOffsetX = (e.clientX / vw - 0.5) * -28;
        pointerOffsetY = (e.clientY / vh - 0.5) * -22;
        pointerDirty = true;
      },
      { passive: true },
    );
  }

  function applyFireflyParallax() {
    if (fireflyDots.length === 0 || prefersReducedMotion) return;
    const scrollY = window.scrollY || 0;
    for (let i = 0; i < fireflyDots.length; i++) {
      const item = fireflyDots[i];
      const sy = ((scrollY * 0.04 * item.depth) % 28) * -1;
      const px = pointerOffsetX * item.depth;
      const py = pointerOffsetY * item.depth + sy;
      item.el.style.marginLeft = `${px.toFixed(1)}px`;
      item.el.style.marginTop = `${py.toFixed(1)}px`;
    }
  }

  /**
   * =================================================================
   * 1. KUPU-KUPU UNGU 3D INTERAKTIF (ROTASI 360 + MOOD + TRAIL + RIPPLE)
   * =================================================================
   */
  const butterflyMoodCopy = {
    twilight: "Warna dan hewan favorite mu",
    amber: "Cahaya hangat senja yang menemani setiap langkahmu",
    nocturne: "Tenang seperti malam ungu penuh bintang",
  };

  moodButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mood = btn.getAttribute("data-butterfly-mood") || "twilight";
      moodButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
      if (butterflySection) {
        butterflySection.setAttribute("data-mood", mood);
      }
      if (moodCaptionEl && butterflyMoodCopy[mood]) {
        moodCaptionEl.textContent = butterflyMoodCopy[mood];
      }
    });
  });

  function spawnButterflyRipple() {
    if (!rippleLayer || prefersReducedMotion) return;
    const ring = document.createElement("span");
    ring.className = "butterfly-ripple-ring";
    rippleLayer.appendChild(ring);
    ring.addEventListener("animationend", () => ring.remove(), { once: true });
  }

  if (stage && pivot) {
    let isDragging = false;
    let movedDuringDrag = false;
    let lastX = 0;
    let lastY = 0;
    let flutterBoostTimer = null;

    let targetRotX = -10;
    let targetRotY = 22;
    let currentRotX = -10;
    let currentRotY = 22;

    let autoSpinY = 0;
    let lastFrameTime = performance.now();
    let lastTrailTime = 0;
    let lastQuadrant = null;
    let lastReadoutDeg = -1;
    let lastReadoutDragging = false;

    function normalize360(deg) {
      return ((deg % 360) + 360) % 360;
    }

    function triggerFlutterPulse() {
      if (prefersReducedMotion) return;
      spawnButterflyRipple();
      stage.classList.remove("is-flutter-boost");
      void stage.offsetWidth;
      stage.classList.add("is-flutter-boost");
      if (flutterBoostTimer) clearTimeout(flutterBoostTimer);
      flutterBoostTimer = setTimeout(() => {
        stage.classList.remove("is-flutter-boost");
      }, 1100);
    }

    function updateButterflyTransform(now) {
      const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
      lastFrameTime = now;

      if (!isDragging && !prefersReducedMotion) {
        autoSpinY = normalize360(autoSpinY + dt * 16);
      }

      currentRotX += (targetRotX - currentRotX) * 0.12;
      currentRotY += (targetRotY - currentRotY) * 0.12;

      const totalY = currentRotY + autoSpinY;
      const hoverLift = prefersReducedMotion ? 0 : Math.sin(now * 0.0022) * 8;

      pivot.style.transform = `translate3d(0, ${hoverLift.toFixed(2)}px, 0) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${totalY.toFixed(2)}deg)`;

      const normalizedDeg = normalize360(totalY);
      const currentQuadrant = Math.floor(normalizedDeg / 90);
      if (
        lastQuadrant !== null &&
        currentQuadrant !== lastQuadrant &&
        !prefersReducedMotion
      ) {
        const sRect = stage.getBoundingClientRect();
        spawnRomanticParticles(
          sRect.left + sRect.width * 0.5,
          sRect.top + sRect.height * 0.5,
          6,
          65,
        );
      }
      lastQuadrant = currentQuadrant;

      const displayDeg = Math.round(normalizedDeg);
      if (
        angleReadout &&
        (displayDeg !== lastReadoutDeg || isDragging !== lastReadoutDragging)
      ) {
        lastReadoutDeg = displayDeg;
        lastReadoutDragging = isDragging;
        angleReadout.textContent = isDragging
          ? `Memutar 360° • ${displayDeg}°`
          : `Sentuh & Putar 360° • ${displayDeg}°`;
      }

      requestAnimationFrame(updateButterflyTransform);
    }

    stage.addEventListener("pointerdown", (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      isDragging = true;
      movedDuringDrag = false;
      lastX = e.clientX;
      lastY = e.clientY;
      stage.classList.add("is-dragging");
      if (stage.setPointerCapture) {
        try {
          stage.setPointerCapture(e.pointerId);
        } catch {}
      }
    });

    stage.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        movedDuringDrag = true;
      }
      lastX = e.clientX;
      lastY = e.clientY;

      targetRotY += dx * 0.85;
      targetRotX = Math.max(-55, Math.min(55, targetRotX - dy * 0.55));

      const now = performance.now();
      if (now - lastTrailTime > 120 && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
        lastTrailTime = now;
        spawnRomanticParticles(e.clientX, e.clientY, 3, 45);
      }
    });

    const stopDragging = () => {
      if (!isDragging) return;
      const wasQuickTap = !movedDuringDrag;
      isDragging = false;
      movedDuringDrag = false;
      stage.classList.remove("is-dragging");
      if (wasQuickTap) {
        triggerFlutterPulse();
      }
    };

    stage.addEventListener("pointerup", stopDragging);
    stage.addEventListener("pointercancel", stopDragging);

    stage.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        targetRotY -= 24;
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        targetRotY += 24;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        targetRotX = Math.max(-55, targetRotX - 12);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        targetRotX = Math.min(55, targetRotX + 12);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerFlutterPulse();
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        targetRotX = -10;
        targetRotY = 22;
        autoSpinY = 0;
        triggerFlutterPulse();
      });
    }

    requestAnimationFrame(updateButterflyTransform);
  }

  /**
   * =================================================================
   * 2. SISTEM PARTIKEL PERCIKAN SAAT SENTUH / KLIK
   * =================================================================
   */
  const romanticShapes = [
    {
      html: `<svg viewBox="0 0 24 24" class="w-full h-full drop-shadow-[0_2px_4px_rgba(126,34,206,0.5)]"><path fill="#a855f7" d="M12 2C7.5 6 5 10.5 7 15.5C8.5 19.2 12 21 12 21C12 21 15.5 19.2 17 15.5C19 10.5 16.5 6 12 2Z"/></svg>`,
      sizeRange: [12, 18],
    },
    {
      html: `<svg viewBox="0 0 24 24" class="w-full h-full drop-shadow-[0_2px_4px_rgba(216,180,254,0.45)]"><path fill="#d8b4fe" d="M12 3C8 7 6 11 8 16C9.5 19 12 20.5 12 20.5C12 20.5 14.5 19 16 16C18 11 16 7 12 3Z"/></svg>`,
      sizeRange: [11, 16],
    },
    {
      html: `<svg viewBox="0 0 24 24" class="w-full h-full drop-shadow-[0_0_6px_rgba(225,29,72,0.55)]"><path fill="#e11d48" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
      sizeRange: [10, 15],
    },
    {
      html: `<svg viewBox="0 0 24 24" class="w-full h-full drop-shadow-[0_0_8px_rgba(252,211,77,0.9)]"><path fill="#fde68a" d="M12 1L14.8 9.2L23 12L14.8 14.8L12 23L9.2 14.8L1 12L9.2 9.2L12 1Z"/></svg>`,
      sizeRange: [10, 17],
    },
    {
      html: `<span class="block w-full h-full rounded-full bg-amber-300 shadow-[0_0_10px_#fbbf24]"></span>`,
      sizeRange: [4, 8],
    },
  ];

  function spawnRomanticParticles(x, y, count = 12, spread = 85) {
    if (!particlesLayer || prefersReducedMotion) return;

    while (particlesLayer.childElementCount > 120) {
      particlesLayer.removeChild(particlesLayer.firstChild);
    }

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const shape =
        romanticShapes[Math.floor(Math.random() * romanticShapes.length)];
      const particle = document.createElement("div");
      particle.className = "click-particle";
      particle.innerHTML = shape.html;

      const size =
        Math.floor(
          Math.random() * (shape.sizeRange[1] - shape.sizeRange[0] + 1),
        ) + shape.sizeRange[0];
      const angle = Math.random() * Math.PI * 2;
      const distance = (Math.random() * 0.65 + 0.35) * spread;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance * 0.75;
      const rot = (Math.random() - 0.5) * 320;
      const duration = (Math.random() * 0.55 + 0.85).toFixed(2);

      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.setProperty("--tx", `${tx.toFixed(1)}px`);
      particle.style.setProperty("--ty", `${ty.toFixed(1)}px`);
      particle.style.setProperty("--rot", `${rot.toFixed(0)}deg`);
      particle.style.setProperty("--duration", `${duration}s`);

      fragment.appendChild(particle);

      particle.addEventListener(
        "animationend",
        () => {
          particle.remove();
        },
        { once: true },
      );
    }

    particlesLayer.appendChild(fragment);
  }

  document.addEventListener(
    "pointerdown",
    (e) => {
      if (e.button !== undefined && e.button !== 0) return;

      const isInteractiveTarget = e.target.closest(
        "button, a, #butterfly-3d-stage, .memory-entry-card",
      );
      const count = isInteractiveTarget ? 16 : 9;
      const spread = isInteractiveTarget ? 105 : 70;

      spawnRomanticParticles(e.clientX, e.clientY, count, spread);
    },
    { passive: true },
  );

  /**
   * =================================================================
   * 2B. LIGHTBOX POTRET DIA
   * =================================================================
   */
  const lightboxModal = document.getElementById("portrait-lightbox-modal");
  const lightboxImg = document.getElementById("portrait-lightbox-img");
  const lightboxCaption = document.getElementById("portrait-lightbox-caption");
  const lightboxCloseBtn = document.getElementById("portrait-lightbox-close");

  function openPortraitLightbox(imgEl) {
    if (!lightboxModal || !lightboxImg || !imgEl) return;
    const src = (imgEl.getAttribute("src") || "").trim();
    if (!src || imgEl.classList.contains("hidden")) return;

    const figureEl = imgEl.closest("figure");
    const capText = figureEl
      ? (figureEl.querySelector("figcaption p")?.textContent || "").trim()
      : "";

    lightboxImg.src = src;
    lightboxImg.alt = imgEl.alt || "Potret dia";
    if (lightboxCaption) {
      lightboxCaption.textContent = capText || imgEl.alt || "";
    }
    lightboxModal.classList.add("is-open");
    lightboxModal.setAttribute("aria-hidden", "false");
  }

  function closePortraitLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove("is-open");
    lightboxModal.setAttribute("aria-hidden", "true");
  }

  document.querySelectorAll("[data-lightbox-trigger]").forEach((img) => {
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      openPortraitLightbox(img);
    });
  });

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener("click", closePortraitLightbox);
  }
  if (lightboxModal) {
    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) {
        closePortraitLightbox();
      }
    });
  }

  /**
   * =================================================================
   * 3. LINTASAN DIAGONAL KIRI-ATAS -> TENGAH -> KANAN-BAWAH + MAGNETIC CTA
   * =================================================================
   */
  const trackNodes = Array.from(document.querySelectorAll("[data-track-node]"));
  const portraitCards = Array.from(
    document.querySelectorAll("[data-portrait-card]"),
  );
  const portraitMeta = portraitCards.map((card, idx) => ({
    card,
    idx,
    depth: parseFloat(card.getAttribute("data-card-depth")) || 1,
    photoLayer: card.querySelector(".portrait-photo-3d"),
    captionLayer: card.querySelector(".portrait-caption-3d"),
  }));
  const parallaxButtons = Array.from(
    document.querySelectorAll("[data-button-parallax]"),
  );

  if (portalShellEl && !prefersReducedMotion) {
    portalShellEl.addEventListener("pointermove", (e) => {
      const rect = portalShellEl.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const relX = ((e.clientX - rect.left) / rect.width) * 100;
      const relY = ((e.clientY - rect.top) / rect.height) * 100;
      portalShellEl.style.setProperty("--portal-x", `${relX.toFixed(1)}%`);
      portalShellEl.style.setProperty("--portal-y", `${relY.toFixed(1)}%`);

      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      for (let i = 0; i < parallaxButtons.length; i++) {
        const btn = parallaxButtons[i];
        btn.style.setProperty("--mag-x", `${(normX * 16).toFixed(2)}px`);
        btn.style.setProperty("--mag-y", `${(normY * 10).toFixed(2)}px`);
      }
    });

    portalShellEl.addEventListener("pointerleave", () => {
      portalShellEl.style.setProperty("--portal-x", "50%");
      portalShellEl.style.setProperty("--portal-y", "64%");
      for (let i = 0; i < parallaxButtons.length; i++) {
        const btn = parallaxButtons[i];
        btn.style.setProperty("--mag-x", "0px");
        btn.style.setProperty("--mag-y", "0px");
      }
    });
  }

  function applyDiagonalTrack() {
    if (
      prefersReducedMotion ||
      (trackNodes.length === 0 &&
        portraitMeta.length === 0 &&
        parallaxButtons.length === 0)
    ) {
      return;
    }

    const vw = Math.max(window.innerWidth || 360, 320);
    const vh = Math.max(window.innerHeight || 1, 1);
    const isMobile = vw < 640;

    const maxDiagX = isMobile
      ? Math.min(24, vw * 0.06)
      : Math.min(125, vw * 0.11);

    for (let i = 0; i < trackNodes.length; i++) {
      const node = trackNodes[i];
      const rect = node.getBoundingClientRect();
      const centerY = rect.top + rect.height * 0.5;
      const offset = Math.max(-1.35, Math.min(1.35, (centerY - vh * 0.5) / vh));

      const nodeX = offset * maxDiagX;
      const nodeY = offset * (isMobile ? 12 : 28);
      const nodeZ = (1 - Math.min(1, Math.abs(offset))) * 28;

      const rotY = Math.max(-5.5, Math.min(5.5, offset * (isMobile ? 2 : 4.5)));
      const rotX = Math.max(
        -3.5,
        Math.min(3.5, -offset * (isMobile ? 1.4 : 2.8)),
      );
      const rotZ = Math.max(
        -1.8,
        Math.min(1.8, offset * (isMobile ? 0.7 : 1.4)),
      );

      node.style.setProperty("--node-x", `${nodeX.toFixed(2)}px`);
      node.style.setProperty("--node-y", `${nodeY.toFixed(2)}px`);
      node.style.setProperty("--node-z", `${nodeZ.toFixed(2)}px`);
      node.style.setProperty("--node-rx", `${rotX.toFixed(2)}deg`);
      node.style.setProperty("--node-ry", `${rotY.toFixed(2)}deg`);
      node.style.setProperty("--node-rz", `${rotZ.toFixed(2)}deg`);
    }

    for (let i = 0; i < portraitMeta.length; i++) {
      const item = portraitMeta[i];
      const cRect = item.card.getBoundingClientRect();
      const cCenterY = cRect.top + cRect.height * 0.5;
      const cOffset = Math.max(-1.2, Math.min(1.2, (cCenterY - vh * 0.5) / vh));

      const cx = cOffset * (isMobile ? 8 : 24) * item.depth;
      const cy = cOffset * (isMobile ? 6 : 16) * item.depth;
      const cz = (1 - Math.min(1, Math.abs(cOffset))) * 24 * item.depth;

      const cardRotY = Math.max(-5, Math.min(5, cOffset * 3.8 * item.depth));
      const cardRotX = Math.max(-3, Math.min(3, -cOffset * 2.4 * item.depth));
      const cardRotZ = Math.max(
        -1.5,
        Math.min(1.5, cOffset * (item.idx === 0 ? 1.1 : -1.1)),
      );

      item.card.style.setProperty("--card-x", `${cx.toFixed(2)}px`);
      item.card.style.setProperty("--card-y", `${cy.toFixed(2)}px`);
      item.card.style.setProperty("--card-z", `${cz.toFixed(2)}px`);
      item.card.style.setProperty("--card-rx", `${cardRotX.toFixed(2)}deg`);
      item.card.style.setProperty("--card-ry", `${cardRotY.toFixed(2)}deg`);
      item.card.style.setProperty("--card-rz", `${cardRotZ.toFixed(2)}deg`);

      if (item.photoLayer) {
        item.photoLayer.style.setProperty(
          "--photo-x",
          `${(-cOffset * (isMobile ? 3 : 9)).toFixed(2)}px`,
        );
        item.photoLayer.style.setProperty(
          "--photo-y",
          `${(-cOffset * (isMobile ? 4 : 11)).toFixed(2)}px`,
        );
        item.photoLayer.style.setProperty("--photo-z", "16px");
        item.photoLayer.style.setProperty("--photo-scale", "1.03");
      }

      if (item.captionLayer) {
        item.captionLayer.style.setProperty(
          "--cap-x",
          `${(cOffset * (isMobile ? 3 : 8)).toFixed(2)}px`,
        );
        item.captionLayer.style.setProperty(
          "--cap-y",
          `${(cOffset * (isMobile ? 3 : 6)).toFixed(2)}px`,
        );
        item.captionLayer.style.setProperty("--cap-z", "24px");
      }
    }

    for (let i = 0; i < parallaxButtons.length; i++) {
      const btn = parallaxButtons[i];
      const bRect = btn.getBoundingClientRect();
      const bCenterY = bRect.top + bRect.height * 0.5;
      const bOffset = Math.max(-1.2, Math.min(1.2, (bCenterY - vh * 0.5) / vh));
      const focus = 1 - Math.min(1, Math.abs(bOffset));

      const ctaX = bOffset * (isMobile ? 12 : 42);
      const ctaY = bOffset * (isMobile ? 10 : 24);
      const ctaZ = 24 + focus * 32;
      const ctaRotY = Math.max(-7, Math.min(7, bOffset * 5.5));
      const ctaRotX = Math.max(-4.5, Math.min(4.5, -bOffset * 3.8));
      const ctaRotZ = Math.max(-2, Math.min(2, bOffset * 1.6));
      const ctaScale = 0.97 + focus * 0.06;

      btn.style.setProperty("--cta-x", `${ctaX.toFixed(2)}px`);
      btn.style.setProperty("--cta-y", `${ctaY.toFixed(2)}px`);
      btn.style.setProperty("--cta-z", `${ctaZ.toFixed(2)}px`);
      btn.style.setProperty("--cta-rx", `${ctaRotX.toFixed(2)}deg`);
      btn.style.setProperty("--cta-ry", `${ctaRotY.toFixed(2)}deg`);
      btn.style.setProperty("--cta-rz", `${ctaRotZ.toFixed(2)}deg`);
      btn.style.setProperty("--cta-scale", `${ctaScale.toFixed(3)}`);
    }
  }

  function flushScrollAndPointerEffects() {
    if (scrollDirty) {
      scrollDirty = false;
      updateScrollThread();
      applyDiagonalTrack();
      applyFireflyParallax();
    } else if (pointerDirty) {
      pointerDirty = false;
      applyFireflyParallax();
    }
    requestAnimationFrame(flushScrollAndPointerEffects);
  }

  window.addEventListener(
    "scroll",
    () => {
      scrollDirty = true;
    },
    { passive: true },
  );
  window.addEventListener(
    "resize",
    () => {
      scrollDirty = true;
    },
    { passive: true },
  );

  requestAnimationFrame(flushScrollAndPointerEffects);

  /**
   * =================================================================
   * 4. POPUP ANIME (YOUR NAME) + PRELUDE KOMET + FOTO 5 DETIK + DAUN SENJA
   * =================================================================
   */
  const entranceSections = Array.from(
    document.querySelectorAll(".scroll-entrance-section"),
  );

  if ("IntersectionObserver" in window && entranceSections.length > 0) {
    const entranceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-entered");
            entranceObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -30px 0px" },
    );

    entranceSections.forEach((sec) => entranceObserver.observe(sec));
  } else {
    entranceSections.forEach((sec) => sec.classList.add("is-entered"));
  }

  const openPopupBtn = document.getElementById("open-birthday-popup-btn");
  const birthdayPopup = document.getElementById("birthday-grand-popup");
  const closePopupBtn = document.getElementById("close-birthday-popup-btn");
  const cometPreludeEl = document.getElementById("anime-comet-prelude");
  const ageCounterEl = document.getElementById("birthday-age-counter");
  const prayerBlockEl = document.getElementById("birthday-prayer-block");
  const extraWishTextEl = document.getElementById("birthday-extra-wish-text");
  const nextWishBtnEl = document.getElementById("birthday-next-wish-btn");
  const flowersLayerEl = document.getElementById("birthday-flowers-layer");
  const perchedLayerEl = document.getElementById("anime-perched-leaves-layer");
  const blurForeLayerEl = document.getElementById(
    "anime-foreground-blur-layer",
  );
  const starlightLayerEl = document.getElementById("anime-starlight-layer");
  const popupCardEl = birthdayPopup
    ? birthdayPopup.querySelector(".birthday-minimal-premium-card")
    : null;
  const songAudioEl = document.getElementById("birthday-song-audio");
  const diaPhotoEl = document.getElementById("birthday-dia-photo");
  const diaPhotoPlaceholderEl = diaPhotoEl
    ? diaPhotoEl.nextElementSibling
    : null;
  const photoPetalLayerEl = document.getElementById("anime-photo-petal-layer");

  let counterTimerId = null;
  let prayerRevealTimerId = null;
  let preludeDelayTimerId = null;
  let flowerLoopTimerId = null;
  let perchedLoopTimerId = null;
  let blurLeafLoopTimerId = null;
  let photoRevealTimerId = null;
  let hasStartedBirthdayMusic = false;
  let wishIndex = 0;

  const extraWishesList = [
    `"Semoga setiap hal kecil yang kamu sukai—seperti hangatnya senja dan sayap kupu-kupu—selalu mengingatkanmu bahwa kamu berarti."`,
    `"Semoga mimpi-mimpi yang diam-diam kamu simpan pelan-pelan menemukan jalannya di usia ketujuh belas ini."`,
    `"Di mana pun langkahmu pergi, semoga selalu ada ruang pulang yang membuat hatimu merasa utuh dan damai."`,
  ];

  if (nextWishBtnEl && extraWishTextEl) {
    nextWishBtnEl.addEventListener("click", (e) => {
      e.stopPropagation();
      wishIndex = (wishIndex + 1) % extraWishesList.length;
      extraWishTextEl.textContent = extraWishesList[wishIndex];
    });
  }

  const animeLeafSvgs = [
    `<svg viewBox="0 0 36 36" class="w-full h-full drop-shadow-[0_3px_10px_rgba(192,132,252,0.45)]"><path fill="#e9d5ff" d="M18 3C11 9 8 15 11 22C13 26.5 18 33 18 33C18 33 23 26.5 25 22C28 15 25 9 18 3Z"/><path fill="none" stroke="#a855f7" stroke-width="1.2" stroke-opacity="0.55" d="M18 6V29"/></svg>`,
    `<svg viewBox="0 0 36 36" class="w-full h-full drop-shadow-[0_3px_10px_rgba(253,224,71,0.42)]"><path fill="#fef08a" d="M18 4C12 10 9 16 12 22C14 26 18 32 18 32C18 32 22 26 24 22C27 16 24 10 18 4Z"/><path fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-opacity="0.55" d="M18 7V29"/></svg>`,
    `<svg viewBox="0 0 36 36" class="w-full h-full drop-shadow-[0_3px_10px_rgba(244,114,182,0.38)]"><path fill="#fbcfe8" d="M18 4C13 8 8 13 10 20C11.5 25 18 31 18 31C18 31 24.5 25 26 20C28 13 23 8 18 4Z"/><path fill="none" stroke="#e879f9" stroke-width="1.1" stroke-opacity="0.5" d="M18 7V28"/></svg>`,
  ];

  const photoAssemblyFlowers = [
    `<svg viewBox="0 0 40 40" class="w-full h-full drop-shadow-[0_2px_8px_rgba(232,121,249,0.75)]"><path fill="#f5d0fe" d="M20 4C23.5 10 26 14 20 19C14 14 16.5 10 20 4Z"/><path fill="#e9d5ff" d="M35 16C28 17 24 19 21 21C25 24 30 24 35 16Z"/><path fill="#fbcfe8" d="M30 34C25 29 22 26 20 22C18 27 20 32 30 34Z"/><path fill="#e9d5ff" d="M10 34C15 29 18 26 20 22C22 27 20 32 10 34Z"/><path fill="#f5d0fe" d="M5 16C12 17 16 19 19 21C15 24 10 24 5 16Z"/><circle cx="20" cy="20" r="3.4" fill="#fde047"/></svg>`,
    `<svg viewBox="0 0 40 40" class="w-full h-full drop-shadow-[0_2px_8px_rgba(253,224,71,0.75)]"><path fill="#fef08a" d="M20 5C23 11 25 15 20 19C15 15 17 11 20 5Z"/><path fill="#fde68a" d="M34 17C28 18 24 19 21 21C25 24 29 23 34 17Z"/><path fill="#fef9c3" d="M29 33C24 28 22 25 20 22C18 27 20 31 29 33Z"/><path fill="#fde68a" d="M11 33C16 28 18 25 20 22C22 27 20 31 11 33Z"/><path fill="#fef08a" d="M6 17C12 18 16 19 19 21C15 24 11 23 6 17Z"/><circle cx="20" cy="20" r="3.2" fill="#c084fc"/></svg>`,
    `<svg viewBox="0 0 32 32" class="w-full h-full drop-shadow-[0_2px_6px_rgba(216,180,254,0.7)]"><path fill="#e9d5ff" d="M16 3C11 9 8 14 11 20C13 24 16 29 16 29C16 29 19 24 21 20C24 14 21 9 16 3Z"/></svg>`,
  ];

  function populateAnimeStarlight() {
    if (!starlightLayerEl || starlightLayerEl.childElementCount > 0) return;
    const totalStars = 36;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < totalStars; i++) {
      const star = document.createElement("span");
      star.className = "anime-twinkle-dot";
      const size = (Math.random() * 2.4 + 1.2).toFixed(1);
      star.style.left = `${(Math.random() * 100).toFixed(2)}%`;
      star.style.top = `${(Math.random() * 88).toFixed(2)}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.setProperty(
        "--twinkle-dur",
        `${(Math.random() * 2.6 + 2.2).toFixed(2)}s`,
      );
      star.style.setProperty(
        "--twinkle-delay",
        `${(Math.random() * 3).toFixed(2)}s`,
      );
      fragment.appendChild(star);
    }
    starlightLayerEl.appendChild(fragment);
  }

  function spawnScatteredFlowersBatch(total = 28) {
    if (!flowersLayerEl || prefersReducedMotion) return;

    const vw = window.innerWidth || 800;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < total; i++) {
      const leaf = document.createElement("div");
      leaf.className = "scattered-flower-item";
      leaf.innerHTML =
        animeLeafSvgs[Math.floor(Math.random() * animeLeafSvgs.length)];

      const size = Math.floor(Math.random() * 14) + 18;
      const startLeftPercent = Math.random() * 96;
      const startDriftX = (Math.random() - 0.5) * 60;
      const endDriftX = startDriftX + (Math.random() - 0.5) * (vw * 0.22);
      const spinDeg =
        (Math.random() > 0.5 ? 1 : -1) *
        (Math.floor(Math.random() * 340) + 200);
      const duration = (Math.random() * 2.4 + 4.2).toFixed(2);
      const delay = (Math.random() * 1.1).toFixed(2);

      leaf.style.left = `${startLeftPercent.toFixed(2)}%`;
      leaf.style.width = `${size}px`;
      leaf.style.height = `${size}px`;
      leaf.style.setProperty("--fx-start", `${startDriftX.toFixed(1)}px`);
      leaf.style.setProperty("--fx-end", `${endDriftX.toFixed(1)}px`);
      leaf.style.setProperty("--fx-rot", `${spinDeg}deg`);
      leaf.style.setProperty("--fx-dur", `${duration}s`);
      leaf.style.setProperty("--fx-delay", `${delay}s`);

      fragment.appendChild(leaf);

      leaf.addEventListener(
        "animationend",
        () => {
          leaf.remove();
        },
        { once: true },
      );
    }

    flowersLayerEl.appendChild(fragment);
  }

  function spawnPerchedLeafOnCard(count = 2) {
    if (!perchedLayerEl || !popupCardEl || prefersReducedMotion) return;

    const cardRect = popupCardEl.getBoundingClientRect();
    if (!cardRect.width || !cardRect.height) return;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const leaf = document.createElement("div");
      leaf.className = "anime-perched-leaf";
      leaf.innerHTML =
        animeLeafSvgs[Math.floor(Math.random() * animeLeafSvgs.length)];

      const marginX = Math.min(36, cardRect.width * 0.1);
      const landX =
        cardRect.left +
        marginX +
        Math.random() * Math.max(20, cardRect.width - marginX * 2);
      const landY = cardRect.top - 4 + (Math.random() - 0.5) * 6;
      const startX = landX + (Math.random() - 0.5) * 130;
      const startY = Math.max(-45, landY - 190 - Math.random() * 90);
      const dropX =
        landX + (Math.random() > 0.5 ? 1 : -1) * (35 + Math.random() * 55);
      const dropY = window.innerHeight + 60;
      const size = Math.floor(Math.random() * 10) + 22;

      leaf.style.width = `${size}px`;
      leaf.style.height = `${size}px`;
      leaf.style.setProperty("--sx", `${startX.toFixed(1)}px`);
      leaf.style.setProperty("--sy", `${startY.toFixed(1)}px`);
      leaf.style.setProperty("--lx", `${landX.toFixed(1)}px`);
      leaf.style.setProperty("--ly", `${landY.toFixed(1)}px`);
      leaf.style.setProperty("--dx", `${dropX.toFixed(1)}px`);
      leaf.style.setProperty("--dy", `${dropY.toFixed(1)}px`);
      leaf.style.setProperty(
        "--land-rot",
        `${((Math.random() - 0.5) * 48).toFixed(1)}deg`,
      );
      leaf.style.setProperty(
        "--drop-rot",
        `${((Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 160)).toFixed(0)}deg`,
      );

      fragment.appendChild(leaf);

      leaf.addEventListener(
        "animationend",
        () => {
          leaf.remove();
        },
        { once: true },
      );
    }

    perchedLayerEl.appendChild(fragment);
  }

  function spawnForegroundBlurLeaves(count = 5) {
    if (!blurForeLayerEl || prefersReducedMotion) return;

    const vw = window.innerWidth || 800;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const leaf = document.createElement("div");
      leaf.className = "anime-camera-blur-leaf";
      leaf.innerHTML =
        animeLeafSvgs[Math.floor(Math.random() * animeLeafSvgs.length)];

      const isVeryClose = Math.random() > 0.4;
      const size = isVeryClose
        ? Math.floor(Math.random() * 24) + 46
        : Math.floor(Math.random() * 18) + 32;
      const blurPx = isVeryClose
        ? (Math.random() * 3.5 + 5.5).toFixed(1)
        : (Math.random() * 2.5 + 3).toFixed(1);
      const opacityVal = isVeryClose
        ? (Math.random() * 0.2 + 0.52).toFixed(2)
        : (Math.random() * 0.2 + 0.65).toFixed(2);

      const startX = Math.random() * vw;
      const endX = startX + (Math.random() - 0.5) * 190;
      const duration = (Math.random() * 1.6 + 2.6).toFixed(2);
      const delay = (Math.random() * 0.8).toFixed(2);
      const rotEnd =
        (Math.random() > 0.5 ? 1 : -1) *
        (240 + Math.floor(Math.random() * 220));

      leaf.style.left = `${startX.toFixed(1)}px`;
      leaf.style.width = `${size}px`;
      leaf.style.height = `${size}px`;
      leaf.style.setProperty("--blur-px", `${blurPx}px`);
      leaf.style.setProperty("--blur-op", opacityVal);
      leaf.style.setProperty("--bx-end", `${endX.toFixed(1)}px`);
      leaf.style.setProperty("--b-rot", `${rotEnd}deg`);
      leaf.style.setProperty("--b-dur", `${duration}s`);
      leaf.style.setProperty("--b-delay", `${delay}s`);

      fragment.appendChild(leaf);

      leaf.addEventListener(
        "animationend",
        () => {
          leaf.remove();
        },
        { once: true },
      );
    }

    blurForeLayerEl.appendChild(fragment);
  }

  function startFlowersShower() {
    stopFlowersShower();
    populateAnimeStarlight();
    spawnScatteredFlowersBatch(28);
    spawnPerchedLeafOnCard(2);
    spawnForegroundBlurLeaves(5);

    flowerLoopTimerId = setInterval(() => {
      if (birthdayPopup && birthdayPopup.classList.contains("is-open")) {
        spawnScatteredFlowersBatch(18);
      }
    }, 2500);

    perchedLoopTimerId = setInterval(() => {
      if (birthdayPopup && birthdayPopup.classList.contains("is-open")) {
        spawnPerchedLeafOnCard(2);
      }
    }, 3200);

    blurLeafLoopTimerId = setInterval(() => {
      if (birthdayPopup && birthdayPopup.classList.contains("is-open")) {
        spawnForegroundBlurLeaves(4);
      }
    }, 2200);
  }

  function stopFlowersShower() {
    if (flowerLoopTimerId) {
      clearInterval(flowerLoopTimerId);
      flowerLoopTimerId = null;
    }
    if (perchedLoopTimerId) {
      clearInterval(perchedLoopTimerId);
      perchedLoopTimerId = null;
    }
    if (blurLeafLoopTimerId) {
      clearInterval(blurLeafLoopTimerId);
      blurLeafLoopTimerId = null;
    }
    if (flowersLayerEl) {
      flowersLayerEl.innerHTML = "";
    }
    if (perchedLayerEl) {
      perchedLayerEl.innerHTML = "";
    }
    if (blurForeLayerEl) {
      blurForeLayerEl.innerHTML = "";
    }
  }

  function stopFiveSecPhotoAssembly() {
    if (photoRevealTimerId) {
      clearTimeout(photoRevealTimerId);
      photoRevealTimerId = null;
    }
    if (photoPetalLayerEl) {
      photoPetalLayerEl.innerHTML = "";
    }
    if (diaPhotoEl) {
      diaPhotoEl.classList.remove("is-five-sec-entering");
    }
  }

  function playFiveSecPhotoAssembly() {
    stopFiveSecPhotoAssembly();

    const hasPhotoSrc =
      diaPhotoEl && Boolean((diaPhotoEl.getAttribute("src") || "").trim());

    if (diaPhotoEl && hasPhotoSrc) {
      diaPhotoEl.classList.remove("hidden");
      if (diaPhotoPlaceholderEl) {
        diaPhotoPlaceholderEl.classList.add("hidden");
      }
      if (!prefersReducedMotion) {
        void diaPhotoEl.offsetWidth;
        diaPhotoEl.classList.add("is-five-sec-entering");
      }
    }

    if (!photoPetalLayerEl || prefersReducedMotion) return;

    const petalCount = 34;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement("div");
      petal.className = "dia-assembling-petal";
      petal.innerHTML =
        photoAssemblyFlowers[
          Math.floor(Math.random() * photoAssemblyFlowers.length)
        ];

      const size = Math.floor(Math.random() * 14) + 18;
      const angle =
        (i / petalCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
      const startDist = 115 + Math.random() * 65;
      const targetX = (Math.random() - 0.5) * 145;
      const targetY = (Math.random() - 0.5) * 185;

      const psx = Math.cos(angle) * startDist;
      const psy = Math.sin(angle) * startDist;
      const pmx = targetX * 0.72;
      const pmy = targetY * 0.72;
      const pex = targetX + (Math.random() - 0.5) * 32;
      const pey = targetY + 45 + Math.random() * 40;

      const delay = (Math.random() * 1.15).toFixed(2);
      const dur = (3.5 + Math.random() * 1.2).toFixed(2);

      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;
      petal.style.setProperty("--psx", `${psx.toFixed(1)}px`);
      petal.style.setProperty("--psy", `${psy.toFixed(1)}px`);
      petal.style.setProperty("--pmx", `${pmx.toFixed(1)}px`);
      petal.style.setProperty("--pmy", `${pmy.toFixed(1)}px`);
      petal.style.setProperty("--pex", `${pex.toFixed(1)}px`);
      petal.style.setProperty("--pey", `${pey.toFixed(1)}px`);
      petal.style.setProperty(
        "--pr0",
        `${((Math.random() - 0.5) * 140).toFixed(0)}deg`,
      );
      petal.style.setProperty(
        "--prm",
        `${((Math.random() - 0.5) * 90).toFixed(0)}deg`,
      );
      petal.style.setProperty(
        "--pre",
        `${((Math.random() - 0.5) * 240).toFixed(0)}deg`,
      );
      petal.style.setProperty("--pdelay", `${delay}s`);
      petal.style.setProperty("--pdur", `${dur}s`);

      fragment.appendChild(petal);
      petal.addEventListener("animationend", () => petal.remove(), {
        once: true,
      });
    }

    photoPetalLayerEl.appendChild(fragment);

    photoRevealTimerId = setTimeout(() => {
      if (diaPhotoEl) {
        diaPhotoEl.classList.remove("is-five-sec-entering");
      }
    }, 5100);
  }

  function startBirthdayMusicOnceAndLoop() {
    if (!songAudioEl) return;
    songAudioEl.loop = true;

    if (!hasStartedBirthdayMusic) {
      hasStartedBirthdayMusic = true;
      songAudioEl.currentTime = 0;
      const playPromise = songAudioEl.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          hasStartedBirthdayMusic = false;
        });
      }
    } else if (songAudioEl.paused) {
      const resumePromise = songAudioEl.play();
      if (resumePromise && typeof resumePromise.catch === "function") {
        resumePromise.catch(() => {});
      }
    }
  }

  function runAgeZeroToSeventeenSequence() {
    if (counterTimerId) {
      clearInterval(counterTimerId);
      counterTimerId = null;
    }
    if (prayerRevealTimerId) {
      clearTimeout(prayerRevealTimerId);
      prayerRevealTimerId = null;
    }

    if (prayerBlockEl) {
      prayerBlockEl.classList.remove("is-revealed");
    }

    if (!ageCounterEl) return;

    let currentNum = 0;
    ageCounterEl.textContent = "0";
    ageCounterEl.classList.remove("is-seventeen-pop", "is-step-pop");
    void ageCounterEl.offsetWidth;
    ageCounterEl.classList.add("is-step-pop");

    counterTimerId = setInterval(() => {
      currentNum += 1;
      ageCounterEl.textContent = String(currentNum);
      ageCounterEl.classList.remove("is-step-pop", "is-seventeen-pop");
      void ageCounterEl.offsetWidth;

      if (currentNum < 17) {
        ageCounterEl.classList.add("is-step-pop");
      } else {
        clearInterval(counterTimerId);
        counterTimerId = null;
        ageCounterEl.classList.add("is-seventeen-pop");

        const rect = ageCounterEl.getBoundingClientRect();
        spawnRomanticParticles(
          rect.left + rect.width * 0.5,
          rect.top + rect.height * 0.5,
          24,
          135,
        );

        prayerRevealTimerId = setTimeout(() => {
          if (prayerBlockEl) {
            prayerBlockEl.classList.add("is-revealed");
          }
        }, 420);
      }
    }, 95);
  }

  function triggerCometPrelude() {
    if (!cometPreludeEl || prefersReducedMotion) return;
    cometPreludeEl.classList.remove("is-active");
    void cometPreludeEl.offsetWidth;
    cometPreludeEl.classList.add("is-active");
  }

  function openBirthdayPopup() {
    if (!birthdayPopup) return;
    if (preludeDelayTimerId) {
      clearTimeout(preludeDelayTimerId);
      preludeDelayTimerId = null;
    }

    birthdayPopup.classList.add("is-open");
    birthdayPopup.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    startBirthdayMusicOnceAndLoop();
    triggerCometPrelude();

    const counterDelay = prefersReducedMotion ? 0 : 750;
    preludeDelayTimerId = setTimeout(() => {
      runAgeZeroToSeventeenSequence();
    }, counterDelay);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        startFlowersShower();
        playFiveSecPhotoAssembly();
      });
    });
  }

  function closeBirthdayPopup() {
    if (!birthdayPopup) return;
    birthdayPopup.classList.remove("is-open");
    birthdayPopup.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (preludeDelayTimerId) {
      clearTimeout(preludeDelayTimerId);
      preludeDelayTimerId = null;
    }
    if (cometPreludeEl) {
      cometPreludeEl.classList.remove("is-active");
    }
    if (counterTimerId) {
      clearInterval(counterTimerId);
      counterTimerId = null;
    }
    if (prayerRevealTimerId) {
      clearTimeout(prayerRevealTimerId);
      prayerRevealTimerId = null;
    }
    stopFlowersShower();
    stopFiveSecPhotoAssembly();
  }

  if (openPopupBtn) {
    openPopupBtn.addEventListener("click", openBirthdayPopup);
  }
  if (closePopupBtn) {
    closePopupBtn.addEventListener("click", closeBirthdayPopup);
  }
  if (birthdayPopup) {
    birthdayPopup.addEventListener("click", (e) => {
      if (e.target === birthdayPopup) {
        closeBirthdayPopup();
      }
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightboxModal && lightboxModal.classList.contains("is-open")) {
        closePortraitLightbox();
        return;
      }
      if (birthdayPopup && birthdayPopup.classList.contains("is-open")) {
        closeBirthdayPopup();
      }
    }
  });

  const memoryCards = Array.from(
    document.querySelectorAll(".memory-entry-card"),
  );
  const typewriterTimers = new WeakMap();

  function playTypewriter(el) {
    if (!el) return;
    const fullText =
      el.getAttribute("data-full-text") || (el.textContent || "").trim();
    el.setAttribute("data-full-text", fullText);

    const existingTimer = typewriterTimers.get(el);
    if (existingTimer) {
      clearInterval(existingTimer);
    }

    if (prefersReducedMotion) {
      el.textContent = fullText;
      return;
    }

    el.textContent = "";
    let idx = 0;
    const timer = setInterval(() => {
      idx += 2;
      el.textContent = fullText.slice(0, idx);
      if (idx >= fullText.length) {
        clearInterval(timer);
        typewriterTimers.delete(el);
      }
    }, 18);
    typewriterTimers.set(el, timer);
  }

  memoryCards.forEach((card) => {
    const pinBtn = card.querySelector("[data-pin-memory]");
    if (pinBtn) {
      pinBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isPinned = card.classList.toggle("is-pinned");
        pinBtn.setAttribute("aria-pressed", String(isPinned));
        pinBtn.textContent = isPinned ? "✦ Terpin" : "✧ Pin";
      });
    }

    const toggleExpand = () => {
      const expanded = card.classList.toggle("is-expanded");
      card.setAttribute("aria-expanded", String(expanded));

      const detail = card.querySelector("[data-memory-detail]");
      const label = card.querySelector("[data-expand-label]");
      const twEl = card.querySelector("[data-typewriter-text]");

      if (detail) {
        detail.classList.toggle("max-h-36", !expanded);
        detail.classList.toggle("max-h-[420px]", expanded);
      }
      if (label) {
        label.textContent = expanded
          ? "Klik untuk menutup"
          : "Klik untuk membuka";
      }
      if (expanded && twEl) {
        playTypewriter(twEl);
      }

      const anyExpanded = memoryCards.some((c) =>
        c.classList.contains("is-expanded"),
      );
      memoryCards.forEach((other) => {
        other.classList.toggle(
          "is-dimmed",
          anyExpanded && !other.classList.contains("is-expanded"),
        );
      });
    };

    card.addEventListener("click", toggleExpand);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleExpand();
      }
    });
  });
});
