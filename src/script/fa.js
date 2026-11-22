document.addEventListener("DOMContentLoaded", () => {
  const stage = document.getElementById("butterfly-3d-stage");
  const pivot = document.getElementById("butterfly-3d-pivot");
  const angleReadout = document.getElementById("butterfly-angle-readout");
  const resetBtn = document.getElementById("butterfly-reset-btn");
  const particlesLayer = document.getElementById("romantic-particles-layer");
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /**
   * =================================================================
   * 1. KUPU-KUPU UNGU 3D INTERAKTIF (ROTASI 360 DERAJAT)
   * =================================================================
   */
  if (stage && pivot) {
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    let targetRotX = -10;
    let targetRotY = 22;
    let currentRotX = -10;
    let currentRotY = 22;

    let autoSpinY = 0;
    let lastFrameTime = performance.now();

    function normalize360(deg) {
      return ((deg % 360) + 360) % 360;
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

      pivot.style.transform = `translateY(${hoverLift.toFixed(2)}px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${totalY.toFixed(2)}deg)`;

      if (angleReadout) {
        const displayDeg = Math.round(normalize360(totalY));
        angleReadout.textContent = isDragging
          ? `Memutar 360° • ${displayDeg}°`
          : `Sentuh & Putar 360° • ${displayDeg}°`;
      }

      requestAnimationFrame(updateButterflyTransform);
    }

    stage.addEventListener("pointerdown", (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      isDragging = true;
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
      lastX = e.clientX;
      lastY = e.clientY;

      targetRotY += dx * 0.85;
      targetRotX = Math.max(-55, Math.min(55, targetRotX - dy * 0.55));
    });

    const stopDragging = () => {
      if (!isDragging) return;
      isDragging = false;
      stage.classList.remove("is-dragging");
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
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        targetRotX = -10;
        targetRotY = 22;
        autoSpinY = 0;
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

      particlesLayer.appendChild(particle);

      particle.addEventListener(
        "animationend",
        () => {
          particle.remove();
        },
        { once: true },
      );
    }
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
   * 3. LINTASAN DIAGONAL KIRI-ATAS -> TENGAH -> KANAN-BAWAH + PARALAKS BUTTON
   * =================================================================
   */
  const trackNodes = Array.from(document.querySelectorAll("[data-track-node]"));
  const portraitCards = Array.from(
    document.querySelectorAll("[data-portrait-card]"),
  );
  const parallaxButtons = Array.from(
    document.querySelectorAll("[data-button-parallax]"),
  );

  if (
    !prefersReducedMotion &&
    (trackNodes.length > 0 ||
      portraitCards.length > 0 ||
      parallaxButtons.length > 0)
  ) {
    function updateDiagonalTrack() {
      const vw = Math.max(window.innerWidth || 360, 320);
      const vh = Math.max(window.innerHeight || 1, 1);
      const isMobile = vw < 640;

      const maxDiagX = isMobile
        ? Math.min(24, vw * 0.06)
        : Math.min(125, vw * 0.11);

      trackNodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const centerY = rect.top + rect.height * 0.5;
        const offset = Math.max(
          -1.35,
          Math.min(1.35, (centerY - vh * 0.5) / vh),
        );

        const nodeX = offset * maxDiagX;
        const nodeY = offset * (isMobile ? 12 : 28);
        const nodeZ = (1 - Math.min(1, Math.abs(offset))) * 28;

        const rotY = Math.max(
          -5.5,
          Math.min(5.5, offset * (isMobile ? 2 : 4.5)),
        );
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
      });

      portraitCards.forEach((card, idx) => {
        const depth = parseFloat(card.getAttribute("data-card-depth")) || 1;
        const cRect = card.getBoundingClientRect();
        const cCenterY = cRect.top + cRect.height * 0.5;
        const cOffset = Math.max(
          -1.2,
          Math.min(1.2, (cCenterY - vh * 0.5) / vh),
        );

        const cx = cOffset * (isMobile ? 8 : 24) * depth;
        const cy = cOffset * (isMobile ? 6 : 16) * depth;
        const cz = (1 - Math.min(1, Math.abs(cOffset))) * 24 * depth;

        const cardRotY = Math.max(-5, Math.min(5, cOffset * 3.8 * depth));
        const cardRotX = Math.max(-3, Math.min(3, -cOffset * 2.4 * depth));
        const cardRotZ = Math.max(
          -1.5,
          Math.min(1.5, cOffset * (idx === 0 ? 1.1 : -1.1)),
        );

        card.style.setProperty("--card-x", `${cx.toFixed(2)}px`);
        card.style.setProperty("--card-y", `${cy.toFixed(2)}px`);
        card.style.setProperty("--card-z", `${cz.toFixed(2)}px`);
        card.style.setProperty("--card-rx", `${cardRotX.toFixed(2)}deg`);
        card.style.setProperty("--card-ry", `${cardRotY.toFixed(2)}deg`);
        card.style.setProperty("--card-rz", `${cardRotZ.toFixed(2)}deg`);

        const photoLayer = card.querySelector(".portrait-photo-3d");
        if (photoLayer) {
          photoLayer.style.setProperty(
            "--photo-x",
            `${(-cOffset * (isMobile ? 3 : 9)).toFixed(2)}px`,
          );
          photoLayer.style.setProperty(
            "--photo-y",
            `${(-cOffset * (isMobile ? 4 : 11)).toFixed(2)}px`,
          );
          photoLayer.style.setProperty("--photo-z", "16px");
          photoLayer.style.setProperty("--photo-scale", "1.03");
        }

        const captionLayer = card.querySelector(".portrait-caption-3d");
        if (captionLayer) {
          captionLayer.style.setProperty(
            "--cap-x",
            `${(cOffset * (isMobile ? 3 : 8)).toFixed(2)}px`,
          );
          captionLayer.style.setProperty(
            "--cap-y",
            `${(cOffset * (isMobile ? 3 : 6)).toFixed(2)}px`,
          );
          captionLayer.style.setProperty("--cap-z", "24px");
        }
      });

      parallaxButtons.forEach((btn) => {
        const bRect = btn.getBoundingClientRect();
        const bCenterY = bRect.top + bRect.height * 0.5;
        const bOffset = Math.max(
          -1.2,
          Math.min(1.2, (bCenterY - vh * 0.5) / vh),
        );
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
      });

      requestAnimationFrame(updateDiagonalTrack);
    }

    requestAnimationFrame(updateDiagonalTrack);
  }

  /**
   * =================================================================
   * 4. ANIMASI MUNCUL SAAT DI-SCROLL, POPUP MINIMALIS PREMIUM 0..17 + LAGU + BUNGA
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
  const ageCounterEl = document.getElementById("birthday-age-counter");
  const prayerBlockEl = document.getElementById("birthday-prayer-block");
  const flowersLayerEl = document.getElementById("birthday-flowers-layer");
  const songAudioEl = document.getElementById("birthday-song-audio");

  let counterTimerId = null;
  let prayerRevealTimerId = null;
  let flowerLoopTimerId = null;

  const flowerSvgs = [
    `<svg viewBox="0 0 36 36" class="w-full h-full drop-shadow-[0_3px_8px_rgba(168,85,247,0.38)]"><circle cx="18" cy="9" r="5.5" fill="#d8b4fe"/><circle cx="27" cy="16" r="5.5" fill="#c084fc"/><circle cx="23" cy="27" r="5.5" fill="#a855f7"/><circle cx="13" cy="27" r="5.5" fill="#c084fc"/><circle cx="9" cy="16" r="5.5" fill="#e9d5ff"/><circle cx="18" cy="18" r="4.5" fill="#fde047"/></svg>`,
    `<svg viewBox="0 0 36 36" class="w-full h-full drop-shadow-[0_3px_8px_rgba(251,191,36,0.32)]"><circle cx="18" cy="9" r="5" fill="#fef08a"/><circle cx="27" cy="16" r="5" fill="#fde047"/><circle cx="23" cy="27" r="5" fill="#f59e0b"/><circle cx="13" cy="27" r="5" fill="#fde047"/><circle cx="9" cy="16" r="5" fill="#fef9c3"/><circle cx="18" cy="18" r="4.2" fill="#c084fc"/></svg>`,
    `<svg viewBox="0 0 32 32" class="w-full h-full drop-shadow-[0_2px_6px_rgba(253,224,71,0.28)]"><path fill="#f3e8ff" d="M16 3C11 9 9 14 12 20C14 24 16 28 16 28C16 28 18 24 20 20C23 14 21 9 16 3Z"/></svg>`,
  ];

  function spawnScatteredFlowersBatch(total = 32) {
    if (!flowersLayerEl || prefersReducedMotion) return;

    const vw = window.innerWidth || 800;

    for (let i = 0; i < total; i++) {
      const flower = document.createElement("div");
      flower.className = "scattered-flower-item";
      flower.innerHTML =
        flowerSvgs[Math.floor(Math.random() * flowerSvgs.length)];

      const size = Math.floor(Math.random() * 16) + 18;
      const startLeftPercent = Math.random() * 96;
      const startDriftX = (Math.random() - 0.5) * 65;
      const endDriftX = startDriftX + (Math.random() - 0.5) * (vw * 0.2);
      const spinDeg =
        (Math.random() > 0.5 ? 1 : -1) *
        (Math.floor(Math.random() * 340) + 200);
      const duration = (Math.random() * 2.2 + 3.8).toFixed(2);
      const delay = (Math.random() * 1.1).toFixed(2);

      flower.style.left = `${startLeftPercent.toFixed(2)}%`;
      flower.style.width = `${size}px`;
      flower.style.height = `${size}px`;
      flower.style.setProperty("--fx-start", `${startDriftX.toFixed(1)}px`);
      flower.style.setProperty("--fx-end", `${endDriftX.toFixed(1)}px`);
      flower.style.setProperty("--fx-rot", `${spinDeg}deg`);
      flower.style.setProperty("--fx-dur", `${duration}s`);
      flower.style.setProperty("--fx-delay", `${delay}s`);

      flowersLayerEl.appendChild(flower);

      flower.addEventListener(
        "animationend",
        () => {
          flower.remove();
        },
        { once: true },
      );
    }
  }

  function startFlowersShower() {
    stopFlowersShower();
    spawnScatteredFlowersBatch(34);
    flowerLoopTimerId = setInterval(() => {
      if (birthdayPopup && birthdayPopup.classList.contains("is-open")) {
        spawnScatteredFlowersBatch(20);
      }
    }, 2500);
  }

  function stopFlowersShower() {
    if (flowerLoopTimerId) {
      clearInterval(flowerLoopTimerId);
      flowerLoopTimerId = null;
    }
    if (flowersLayerEl) {
      flowersLayerEl.innerHTML = "";
    }
  }

  function autoPlayLoopBirthdayMusic() {
    if (!songAudioEl) return;
    songAudioEl.loop = true;
    songAudioEl.currentTime = 0;
    const playPromise = songAudioEl.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }

  function stopBirthdayMusic() {
    if (!songAudioEl) return;
    songAudioEl.pause();
    songAudioEl.currentTime = 0;
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

  function openBirthdayPopup() {
    if (!birthdayPopup) return;
    birthdayPopup.classList.add("is-open");
    birthdayPopup.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    autoPlayLoopBirthdayMusic();
    startFlowersShower();
    runAgeZeroToSeventeenSequence();
  }

  function closeBirthdayPopup() {
    if (!birthdayPopup) return;
    birthdayPopup.classList.remove("is-open");
    birthdayPopup.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (counterTimerId) {
      clearInterval(counterTimerId);
      counterTimerId = null;
    }
    if (prayerRevealTimerId) {
      clearTimeout(prayerRevealTimerId);
      prayerRevealTimerId = null;
    }
    stopFlowersShower();
    stopBirthdayMusic();
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
    if (
      e.key === "Escape" &&
      birthdayPopup &&
      birthdayPopup.classList.contains("is-open")
    ) {
      closeBirthdayPopup();
    }
  });

  const memoryCards = Array.from(
    document.querySelectorAll(".memory-entry-card"),
  );
  memoryCards.forEach((card) => {
    const toggleExpand = () => {
      const expanded = card.classList.toggle("is-expanded");
      card.setAttribute("aria-expanded", String(expanded));

      const detail = card.querySelector("[data-memory-detail]");
      const label = card.querySelector("[data-expand-label]");

      if (detail) {
        detail.classList.toggle("max-h-36", !expanded);
        detail.classList.toggle("max-h-[420px]", expanded);
      }
      if (label) {
        label.textContent = expanded
          ? "Klik untuk menutup"
          : "Klik untuk membuka";
      }
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
