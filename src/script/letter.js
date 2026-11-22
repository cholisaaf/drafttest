document.addEventListener("DOMContentLoaded", () => {
  // Elemen DOM Utama
  const body = document.body;
  const particlesLayer = document.getElementById("romantic-particles-layer");
  const letterOverlay = document.getElementById("letter-overlay");
  const envelopeStage = document.getElementById("envelope-stage");
  const envelopeWrapper = document.getElementById("envelope-wrapper");
  const envelopeFlap = document.getElementById("envelope-flap");
  const waxSeal = document.getElementById("wax-seal");
  const peekLetter = document.getElementById("peek-letter");
  const bgMusic = document.getElementById("bg-music");
  const heroStarsSection = document.getElementById("hero-stars-section");

  // Elemen Pemutar Lagu Favorit
  const nowPlayingText = document.getElementById("now-playing-text");
  const nowPlayingTextClone = document.getElementById("now-playing-text-clone");
  const nowPlayingTrack = document.querySelector(
    "#now-playing-marquee .marquee-track",
  );
  const nowPlayingBadge = document.getElementById("now-playing-badge");
  const stopFavoriteTrackBtn = document.getElementById(
    "stop-favorite-track-btn",
  );
  const trackCards = Array.from(document.querySelectorAll("[data-track-card]"));

  // Elemen Halaman Pertama & Halaman Lanjutan
  const exploreMemoriesBtn = document.getElementById("explore-memories-btn");
  const unlockedChapters = document.getElementById("unlocked-chapters");
  const mainNavLinks = document.getElementById("main-nav-links");

  // Elemen Modal Surat di Tengah Viewport
  const letterModalContainer = document.getElementById(
    "letter-modal-container",
  );
  const letterCard = document.getElementById("letter-card");
  const letterScrollContainer = document.getElementById(
    "letter-scroll-container",
  );
  const readProgressBar = document.getElementById("read-progress-bar");
  const scrollIndicatorText = document.getElementById("scroll-indicator-text");
  const enterSiteBtn = document.getElementById("enter-site-btn");

  // Tombol Buka Surat Kembali
  const reopenButtons = [
    document.getElementById("reopen-nav-btn"),
    document.getElementById("reopen-hero-btn"),
    document.getElementById("reopen-footer-btn"),
  ];

  // State Interaksi
  let isFirstRead = true;
  let isOpened = false;
  let isModalActive = false;
  let isReachedBottom = false;
  let isClosing = false;
  let isChaptersUnlocked = false;
  let savedScrollY = 0;
  let hasStartedInitialAudio = false;
  let openStepTimers = [];
  let autoCloseTimer = null;

  /**
   * =================================================================
   * SISTEM PEMUTAR LAGU FAVORIT + JEDA / LANJUT MUSIK UTAMA (MRS. MAGIC)
   * =================================================================
   */
  const favoriteAudio = document.createElement("audio");
  favoriteAudio.preload = "auto";

  let activeTrackCard = null;
  let isLoadingTrack = false;
  let shouldResumeMainMusic = false;

  function formatAudioTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  function syncMarqueeSpeed(message) {
    if (!nowPlayingTrack) return;
    const estimatedSeconds = Math.max(10, Math.min(24, message.length * 0.24));
    nowPlayingTrack.style.setProperty(
      "--marquee-duration",
      `${estimatedSeconds.toFixed(1)}s`,
    );
  }

  function setBannerMessage(message, badge = "♪", showStopBtn = false) {
    if (nowPlayingText) {
      nowPlayingText.textContent = message;
    }
    if (nowPlayingTextClone) {
      nowPlayingTextClone.textContent = message;
    }
    syncMarqueeSpeed(message);

    if (nowPlayingBadge) {
      nowPlayingBadge.textContent = badge;
    }
    if (stopFavoriteTrackBtn) {
      stopFavoriteTrackBtn.classList.toggle("hidden", !showStopBtn);
    }
  }

  function resetTrackCardUI(card) {
    if (!card) return;
    const btn = card.querySelector("[data-track-btn]");
    const seek = card.querySelector("[data-track-seek]");
    const timeEl = card.querySelector("[data-track-time]");
    const durationEl = card.querySelector("[data-track-duration]");
    const coverWrap = card.querySelector("[data-track-cover-wrap]");

    card.classList.remove("border-amber-400/60", "bg-[#2c201b]");
    card.classList.add("border-amber-300/15", "bg-[#221a17]");

    if (coverWrap) {
      coverWrap.classList.remove(
        "border-amber-400",
        "ring-2",
        "ring-amber-400/35",
        "animate-pulse",
      );
      coverWrap.classList.add("border-amber-300/25");
    }

    if (btn) {
      btn.disabled = false;
      btn.textContent = "▶ Play";
      btn.setAttribute("aria-pressed", "false");
      btn.classList.remove(
        "bg-red-900",
        "hover:bg-red-800",
        "bg-amber-950/80",
        "text-amber-200/80",
        "cursor-wait",
        "text-amber-100",
      );
      btn.classList.add(
        "bg-amber-900/35",
        "hover:bg-amber-800/50",
        "text-amber-100",
        "cursor-pointer",
      );
    }

    if (seek) {
      seek.value = 0;
    }

    if (timeEl) {
      timeEl.textContent = "0:00";
    }

    if (durationEl) {
      durationEl.textContent = "0:00";
    }
  }

  function setTrackCardLoadingUI(card) {
    if (!card) return;
    const btn = card.querySelector("[data-track-btn]");
    const coverWrap = card.querySelector("[data-track-cover-wrap]");

    card.classList.remove("border-amber-300/15", "bg-[#221a17]");
    card.classList.add("border-amber-400/50", "bg-[#281e1a]");

    if (coverWrap) {
      coverWrap.classList.remove("border-amber-300/25");
      coverWrap.classList.add(
        "border-amber-400",
        "ring-2",
        "ring-amber-400/30",
        "animate-pulse",
      );
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = "⏳ Memuat...";
      btn.setAttribute("aria-pressed", "false");
      btn.classList.remove(
        "bg-amber-900/35",
        "hover:bg-amber-800/50",
        "bg-red-900",
        "hover:bg-red-800",
        "cursor-pointer",
      );
      btn.classList.add("bg-amber-950/80", "text-amber-200/80", "cursor-wait");
    }
  }

  function setTrackCardPlayingUI(card) {
    if (!card) return;
    const btn = card.querySelector("[data-track-btn]");
    const coverWrap = card.querySelector("[data-track-cover-wrap]");

    card.classList.remove("border-amber-300/15", "bg-[#221a17]");
    card.classList.add("border-amber-400/60", "bg-[#2c201b]");

    if (coverWrap) {
      coverWrap.classList.remove("border-amber-300/25", "animate-pulse");
      coverWrap.classList.add(
        "border-amber-400",
        "ring-2",
        "ring-amber-400/35",
      );
    }

    if (btn) {
      btn.disabled = false;
      btn.textContent = "■ Stop";
      btn.setAttribute("aria-pressed", "true");
      btn.classList.remove(
        "bg-amber-900/35",
        "hover:bg-amber-800/50",
        "bg-amber-950/80",
        "text-amber-200/80",
        "cursor-wait",
        "text-amber-100",
      );
      btn.classList.add(
        "bg-red-900",
        "hover:bg-red-800",
        "text-amber-100",
        "cursor-pointer",
      );
    }
  }

  function updateBannerUI(state, trackTitle = "") {
    if (state === "loading") {
      setBannerMessage(`Mengunduh & memuat: ${trackTitle}...`, "⏳", true);
    } else if (state === "playing") {
      setBannerMessage(
        `Sedang diputar: ${trackTitle} — Mrs. Magic dijeda sementara`,
        "▶",
        true,
      );
    } else {
      setBannerMessage("Musik Utama: Mrs. Magic (Strings Version)", "♪", false);
    }
  }

  function resumeMainBgMusicIfNeeded() {
    if (!bgMusic || !shouldResumeMainMusic) return;
    shouldResumeMainMusic = false;
    bgMusic.volume = 0.6;
    const playPromise = bgMusic.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }

  function stopFavoriteTrack(resumeMain = true) {
    isLoadingTrack = false;
    favoriteAudio.pause();
    favoriteAudio.currentTime = 0;
    favoriteAudio.removeAttribute("src");
    favoriteAudio.load();

    if (activeTrackCard) {
      resetTrackCardUI(activeTrackCard);
      activeTrackCard = null;
    }

    updateBannerUI("idle");

    if (resumeMain) {
      resumeMainBgMusicIfNeeded();
    }
  }

  async function toggleFavoriteTrack(card, btn) {
    if (!card || !btn) return;
    const src = btn.getAttribute("data-audio-src");
    const title =
      btn.getAttribute("data-track-title") ||
      card.querySelector("h3")?.textContent?.trim() ||
      "Lagu Favorit";

    if (activeTrackCard === card && (!favoriteAudio.paused || isLoadingTrack)) {
      stopFavoriteTrack(true);
      return;
    }

    if (!src) return;

    if (!activeTrackCard && bgMusic) {
      shouldResumeMainMusic = !bgMusic.paused || hasStartedInitialAudio;
    }

    if (bgMusic && !bgMusic.paused) {
      bgMusic.pause();
    }

    if (activeTrackCard && activeTrackCard !== card) {
      favoriteAudio.pause();
      resetTrackCardUI(activeTrackCard);
    }

    activeTrackCard = card;
    isLoadingTrack = true;
    setTrackCardLoadingUI(card);
    updateBannerUI("loading", title);

    favoriteAudio.pause();
    favoriteAudio.currentTime = 0;
    favoriteAudio.src = encodeURI(src);
    favoriteAudio.volume = 0.85;
    favoriteAudio.load();

    try {
      await favoriteAudio.play();
      if (activeTrackCard !== card) return;
      isLoadingTrack = false;
      setTrackCardPlayingUI(card);
      updateBannerUI("playing", title);
    } catch {
      if (activeTrackCard === card) {
        isLoadingTrack = false;
        resetTrackCardUI(activeTrackCard);
        activeTrackCard = null;
        setBannerMessage(
          `Gagal memutar "${title}" — pastikan file audio ada di path: ${src}`,
          "!",
          false,
        );
        resumeMainBgMusicIfNeeded();
      }
    }
  }

  let isSeekingTrack = false;

  trackCards.forEach((card) => {
    const btn = card.querySelector("[data-track-btn]");
    const seek = card.querySelector("[data-track-seek]");
    const timeEl = card.querySelector("[data-track-time]");

    if (btn) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavoriteTrack(card, btn);
      });
    }

    if (seek) {
      const startSeek = () => {
        if (activeTrackCard === card) {
          isSeekingTrack = true;
        }
      };

      const previewSeek = () => {
        if (
          activeTrackCard !== card ||
          !Number.isFinite(favoriteAudio.duration) ||
          favoriteAudio.duration <= 0
        ) {
          return;
        }
        const previewTime = (Number(seek.value) / 100) * favoriteAudio.duration;
        if (timeEl) {
          timeEl.textContent = formatAudioTime(previewTime);
        }
      };

      const commitSeek = () => {
        if (
          activeTrackCard === card &&
          Number.isFinite(favoriteAudio.duration) &&
          favoriteAudio.duration > 0
        ) {
          favoriteAudio.currentTime =
            (Number(seek.value) / 100) * favoriteAudio.duration;
        }
        isSeekingTrack = false;
      };

      seek.addEventListener("pointerdown", startSeek);
      seek.addEventListener("input", () => {
        startSeek();
        previewSeek();
      });
      seek.addEventListener("change", commitSeek);
      seek.addEventListener("pointerup", commitSeek);
      seek.addEventListener("pointercancel", () => {
        isSeekingTrack = false;
      });
    }
  });

  if (stopFavoriteTrackBtn) {
    stopFavoriteTrackBtn.addEventListener("click", () => {
      stopFavoriteTrack(true);
    });
  }

  favoriteAudio.addEventListener("waiting", () => {
    if (!activeTrackCard || favoriteAudio.paused) return;
    const title =
      activeTrackCard
        .querySelector("[data-track-btn]")
        ?.getAttribute("data-track-title") || "Lagu Favorit";
    isLoadingTrack = true;
    setTrackCardLoadingUI(activeTrackCard);
    updateBannerUI("loading", title);
  });

  favoriteAudio.addEventListener("playing", () => {
    if (!activeTrackCard) return;
    const title =
      activeTrackCard
        .querySelector("[data-track-btn]")
        ?.getAttribute("data-track-title") || "Lagu Favorit";
    isLoadingTrack = false;
    setTrackCardPlayingUI(activeTrackCard);
    updateBannerUI("playing", title);
  });

  favoriteAudio.addEventListener("loadedmetadata", () => {
    if (!activeTrackCard) return;
    const durationEl = activeTrackCard.querySelector("[data-track-duration]");
    if (
      durationEl &&
      Number.isFinite(favoriteAudio.duration) &&
      favoriteAudio.duration > 0
    ) {
      durationEl.textContent = formatAudioTime(favoriteAudio.duration);
    }
  });

  favoriteAudio.addEventListener("timeupdate", () => {
    if (
      !activeTrackCard ||
      isSeekingTrack ||
      !Number.isFinite(favoriteAudio.duration) ||
      favoriteAudio.duration <= 0
    ) {
      return;
    }
    const seek = activeTrackCard.querySelector("[data-track-seek]");
    const timeEl = activeTrackCard.querySelector("[data-track-time]");
    const pct = Math.min(
      100,
      Math.max(0, (favoriteAudio.currentTime / favoriteAudio.duration) * 100),
    );

    if (seek) seek.value = pct.toFixed(1);
    if (timeEl) timeEl.textContent = formatAudioTime(favoriteAudio.currentTime);
  });

  favoriteAudio.addEventListener("ended", () => {
    stopFavoriteTrack(true);
  });

  favoriteAudio.addEventListener("error", () => {
    if (!activeTrackCard) return;
    const btn = activeTrackCard.querySelector("[data-track-btn]");
    const src = btn?.getAttribute("data-audio-src") || "";
    const title =
      btn?.getAttribute("data-track-title") ||
      activeTrackCard.querySelector("h3")?.textContent?.trim() ||
      "Lagu Favorit";

    isLoadingTrack = false;
    resetTrackCardUI(activeTrackCard);
    activeTrackCard = null;
    setBannerMessage(`Gagal memuat file audio "${title}" (${src})`, "!", false);
    resumeMainBgMusicIfNeeded();
  });

  /**
   * =================================================================
   * KARTU BABAK KENANGAN: MEMBESAR DI TEMPAT, SCROLL, & MINIMIZE
   * =================================================================
   */
  const storyCards = Array.from(document.querySelectorAll("[data-story-card]"));

  function collapseStoryCard(card) {
    if (!card) return;
    const preview = card.querySelector("[data-story-preview]");
    const bodyEl = card.querySelector("[data-story-body]");
    const footer = card.querySelector("[data-story-footer]");
    const minimizeBtn = card.querySelector("[data-story-minimize]");

    card.classList.remove("is-expanded");
    card.setAttribute("aria-expanded", "false");

    if (minimizeBtn) minimizeBtn.classList.add("hidden");
    if (bodyEl) {
      bodyEl.classList.add("hidden");
      bodyEl.scrollTop = 0;
    }
    if (preview) preview.classList.remove("hidden");
    if (footer) footer.classList.remove("hidden");
  }

  function expandStoryCard(targetCard) {
    if (!targetCard) return;

    storyCards.forEach((other) => {
      if (other !== targetCard) {
        collapseStoryCard(other);
        other.classList.add("hidden");
      }
    });

    const preview = targetCard.querySelector("[data-story-preview]");
    const bodyEl = targetCard.querySelector("[data-story-body]");
    const footer = targetCard.querySelector("[data-story-footer]");
    const minimizeBtn = targetCard.querySelector("[data-story-minimize]");

    targetCard.classList.remove("hidden", "is-expanded");
    void targetCard.offsetWidth;
    targetCard.classList.add("is-expanded");
    targetCard.setAttribute("aria-expanded", "true");

    if (preview) preview.classList.add("hidden");
    if (footer) footer.classList.add("hidden");

    if (bodyEl) {
      bodyEl.classList.remove("hidden");
      bodyEl.scrollTop = 0;
    }

    if (minimizeBtn) {
      minimizeBtn.classList.remove("hidden");
    }

    requestAnimationFrame(() => {
      targetCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function restoreAllStoryCards() {
    storyCards.forEach((card) => {
      collapseStoryCard(card);
      card.classList.remove("hidden");
      card.style.opacity = "0";
      card.style.transform = "translateY(8px)";
      void card.offsetWidth;
      requestAnimationFrame(() => {
        card.style.opacity = "";
        card.style.transform = "";
      });
    });
  }

  storyCards.forEach((card) => {
    const minimizeBtn = card.querySelector("[data-story-minimize]");

    if (minimizeBtn) {
      minimizeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        restoreAllStoryCards();
      });
    }

    card.addEventListener("click", (e) => {
      if (e.target.closest("[data-story-body]")) return;
      if (card.classList.contains("is-expanded")) return;
      expandStoryCard(card);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (card.classList.contains("is-expanded")) return;
        e.preventDefault();
        expandStoryCard(card);
      } else if (e.key === "Escape" && card.classList.contains("is-expanded")) {
        restoreAllStoryCards();
      }
    });
  });

  /**
   * =================================================================
   * SISTEM PARTIKEL ROMANTIS INTERAKTIF SAAT ACTION CLICK / TAP
   * =================================================================
   */
  const romanticShapes = [
    {
      html: `<svg viewBox="0 0 24 24" class="w-full h-full drop-shadow-[0_2px_4px_rgba(127,29,29,0.5)]"><path fill="#be123c" d="M12 2C7.5 6 5 10.5 7 15.5C8.5 19.2 12 21 12 21C12 21 15.5 19.2 17 15.5C19 10.5 16.5 6 12 2Z"/></svg>`,
      sizeRange: [12, 18],
    },
    {
      html: `<svg viewBox="0 0 24 24" class="w-full h-full drop-shadow-[0_2px_4px_rgba(244,63,94,0.4)]"><path fill="#fb7185" d="M12 3C8 7 6 11 8 16C9.5 19 12 20.5 12 20.5C12 20.5 14.5 19 16 16C18 11 16 7 12 3Z"/></svg>`,
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
    if (!particlesLayer) return;

    while (particlesLayer.childElementCount > 110) {
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

  function spawnExploreTransitionEffect(btnEl, event) {
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;

    if (event && typeof event.clientX === "number" && event.clientX > 0) {
      cx = event.clientX;
      cy = event.clientY;
    } else if (btnEl) {
      const rect = btnEl.getBoundingClientRect();
      cx = rect.left + rect.width / 2;
      cy = rect.top + rect.height / 2;
    }

    const ring = document.createElement("div");
    ring.className = "explore-ripple-ring";
    ring.style.left = `${cx}px`;
    ring.style.top = `${cy}px`;
    document.body.appendChild(ring);
    ring.addEventListener("animationend", () => ring.remove(), { once: true });

    spawnRomanticParticles(cx, cy, 26, 145);

    if (btnEl) {
      btnEl.style.transition =
        "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s ease";
      btnEl.style.transform = "scale(0.95)";
      btnEl.style.boxShadow = "0 0 32px rgba(251, 191, 36, 0.45)";
      setTimeout(() => {
        btnEl.style.transform = "";
        btnEl.style.boxShadow = "";
      }, 280);
    }
  }

  document.addEventListener(
    "pointerdown",
    (e) => {
      if (e.button !== undefined && e.button !== 0) return;

      const isInteractiveTarget = e.target.closest(
        "button, a, #envelope-wrapper, .memory-card, .story-expand-card",
      );
      const count = isInteractiveTarget ? 16 : 9;
      const spread = isInteractiveTarget ? 105 : 70;

      spawnRomanticParticles(e.clientX, e.clientY, count, spread);
    },
    { passive: true },
  );

  function clearAllTimers() {
    openStepTimers.forEach((id) => clearTimeout(id));
    openStepTimers = [];
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }

  function lockToFirstPageOnly() {
    isChaptersUnlocked = false;
    savedScrollY = 0;

    if (unlockedChapters) {
      unlockedChapters.classList.remove(
        "opacity-100",
        "translate-y-0",
        "is-chapters-revealed",
      );
      unlockedChapters.classList.add("hidden", "opacity-0", "translate-y-6");
    }

    if (mainNavLinks) {
      mainNavLinks.classList.add("opacity-0", "pointer-events-none");
    }

    document.documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.classList.add("overflow-hidden");
    body.style.position = "fixed";
    body.style.top = "0px";
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
  }

  function unlockSubsequentChaptersAndScroll(e) {
    if (e) e.preventDefault();

    spawnExploreTransitionEffect(exploreMemoriesBtn, e);

    if (!isChaptersUnlocked) {
      isChaptersUnlocked = true;

      document.documentElement.style.overflow = "";
      body.style.overflow = "";
      body.classList.remove("overflow-hidden");
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";

      if (mainNavLinks) {
        mainNavLinks.classList.remove("opacity-0", "pointer-events-none");
      }

      if (unlockedChapters) {
        unlockedChapters.classList.remove("hidden");
        void unlockedChapters.offsetWidth;
        requestAnimationFrame(() => {
          unlockedChapters.classList.remove("opacity-0", "translate-y-6");
          unlockedChapters.classList.add("opacity-100", "translate-y-0");
          unlockedChapters.classList.add("is-chapters-revealed");
          if (window.AOS) {
            setTimeout(() => {
              window.AOS.refreshHard();
            }, 180);
            setTimeout(() => {
              window.AOS.refreshHard();
            }, 960);
          }
        });
      }

      triggerPhoto3DEntrance();
    }

    const targetSection = document.getElementById("galeri-3d");
    if (targetSection) {
      setTimeout(() => {
        const headerEl = document.querySelector("header");
        const navHeight = headerEl
          ? headerEl.getBoundingClientRect().height
          : 72;
        const targetTop =
          targetSection.getBoundingClientRect().top +
          (window.scrollY || window.pageYOffset || 0) -
          navHeight +
          8;

        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: "smooth",
        });
      }, 140);
    }
  }

  function playInitialLetterMusic() {
    if (!bgMusic || !isFirstRead || hasStartedInitialAudio) return;

    hasStartedInitialAudio = true;
    bgMusic.volume = 0.6;
    const playPromise = bgMusic.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        hasStartedInitialAudio = false;
      });
    }
  }

  function triggerHeroLoadAnimation() {
    if (!heroStarsSection) return;
    heroStarsSection.classList.remove("is-hero-loaded");
    void heroStarsSection.offsetWidth;
    requestAnimationFrame(() => {
      heroStarsSection.classList.add("is-hero-loaded");
    });
  }

  lockToFirstPageOnly();

  /**
   * =================================================================
   * ANIMASI 3D, MENGAMBANG, & PERSPEKTIF 3 FOTO
   * =================================================================
   */
  const photo3DGrid = document.getElementById("photo-3d-grid");
  const photo3DSection = document.getElementById("galeri-3d");
  const photo3DCards = Array.from(document.querySelectorAll(".photo-3d-card"));
  let hasPlayed3DEntrance = false;
  let floatRafId = null;

  function clearMobileFocus() {
    photo3DCards.forEach((c) => c.classList.remove("is-mobile-focused"));
    if (photo3DGrid) {
      photo3DGrid.classList.remove("has-mobile-focus");
    }
  }

  const baseTilts = [
    { x: 4, y: 10, z: -2, phase: 0 },
    { x: 3, y: 0, z: 0, phase: 1.8 },
    { x: 4, y: -10, z: 2, phase: 3.6 },
  ];

  function applyDefaultTilt(card, idx) {
    const cfg = baseTilts[idx] || baseTilts[1];
    card.style.setProperty("--tilt-x", `${cfg.x}deg`);
    card.style.setProperty("--tilt-y", `${cfg.y}deg`);
    card.style.setProperty("--tilt-z", `${cfg.z}deg`);
  }

  photo3DCards.forEach((card, idx) => {
    applyDefaultTilt(card, idx);
  });

  function startFloating3DLoop() {
    if (floatRafId !== null || photo3DCards.length === 0) return;

    const tick = (now) => {
      const t = now * 0.0015;
      photo3DCards.forEach((card, idx) => {
        if (!card.classList.contains("is-settled")) return;
        const cfg = baseTilts[idx] || baseTilts[1];
        const floatY = Math.sin(t + cfg.phase) * 7;
        const floatRx = Math.cos(t * 0.8 + cfg.phase) * 1.3;
        const floatRy = Math.sin(t * 0.7 + cfg.phase) * 2.0;
        const floatRz = Math.cos(t * 0.6 + cfg.phase) * 0.7;

        card.style.setProperty("--float-y", `${floatY.toFixed(2)}px`);
        card.style.setProperty("--float-rx", `${floatRx.toFixed(2)}deg`);
        card.style.setProperty("--float-ry", `${floatRy.toFixed(2)}deg`);
        card.style.setProperty("--float-rz", `${floatRz.toFixed(2)}deg`);
      });
      floatRafId = requestAnimationFrame(tick);
    };

    floatRafId = requestAnimationFrame(tick);
  }

  function triggerPhoto3DEntrance() {
    if (photo3DCards.length === 0 || hasPlayed3DEntrance) return;
    hasPlayed3DEntrance = true;

    photo3DCards.forEach((card, idx) => {
      applyDefaultTilt(card, idx);
      const timerId = setTimeout(
        () => {
          card.classList.add("is-settled");
        },
        220 + idx * 180,
      );
      openStepTimers.push(timerId);
    });

    startFloating3DLoop();
  }

  photo3DCards.forEach((card, idx) => {
    const updateTiltFromPoint = (clientX, clientY) => {
      if (!card.classList.contains("is-settled")) return;
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = Math.max(
        -0.5,
        Math.min(0.5, (clientX - rect.left) / rect.width - 0.5),
      );
      const ny = Math.max(
        -0.5,
        Math.min(0.5, (clientY - rect.top) / rect.height - 0.5),
      );

      card.classList.add("is-interacting");
      card.style.setProperty("--tilt-x", `${(-ny * 16).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(nx * 20).toFixed(2)}deg`);
      card.style.setProperty("--tilt-z", `${(-nx * 4).toFixed(2)}deg`);
    };

    card.addEventListener("pointermove", (e) => {
      updateTiltFromPoint(e.clientX, e.clientY);
    });

    card.addEventListener("pointerdown", (e) => {
      updateTiltFromPoint(e.clientX, e.clientY);
      if (window.innerWidth < 768) {
        photo3DCards.forEach((otherCard) => {
          otherCard.classList.remove("is-mobile-focused");
        });
        card.classList.add("is-mobile-focused");
        if (photo3DGrid) {
          photo3DGrid.classList.add("has-mobile-focus");
        }
      }
    });

    const resetTilt = () => {
      card.classList.remove("is-interacting");
      applyDefaultTilt(card, idx);
    };

    card.addEventListener("pointerleave", resetTilt);
    card.addEventListener("pointercancel", resetTilt);
  });

  [photo3DGrid, photo3DSection].forEach((container) => {
    if (!container) return;
    container.addEventListener("pointerdown", (e) => {
      if (window.innerWidth >= 768) return;
      if (!e.target.closest(".photo-3d-card")) {
        clearMobileFocus();
      }
    });
  });

  /**
   * Tahap 1: Klik Amplop -> Ledakan Partikel -> Pecahkan Segel -> Buka Flap -> Surat Keluar
   */
  function handleOpenEnvelope() {
    if (isOpened) return;
    isOpened = true;
    clearAllTimers();

    if (isFirstRead) {
      playInitialLetterMusic();
    }

    const sealRect = waxSeal.getBoundingClientRect();
    const centerX = sealRect.left + sealRect.width / 2;
    const centerY = sealRect.top + sealRect.height / 2;
    spawnRomanticParticles(centerX, centerY, 28, 150);

    envelopeWrapper.classList.remove("animate-levitate", "cursor-pointer");

    if (isFirstRead) {
      enterSiteBtn.classList.add("hidden");
      scrollIndicatorText.textContent =
        "Gulir hingga akhir surat menuju halaman utama...";
    } else {
      enterSiteBtn.classList.remove("hidden");
      scrollIndicatorText.textContent =
        "Gulir hingga akhir atau klik tombol di samping...";
    }

    waxSeal.style.opacity = "0";
    waxSeal.style.transform = "translate(-50%, -50%) scale(1.25)";
    envelopeFlap.classList.add("open");

    const pullTimer = setTimeout(() => {
      peekLetter.style.opacity = "1";
      peekLetter.style.zIndex = "45";
      peekLetter.style.transform = "translate(-50%, -68%)";
    }, 420);
    openStepTimers.push(pullTimer);

    const modalTimer = setTimeout(() => {
      envelopeStage.style.opacity = "0";
      envelopeStage.style.transform = "translateY(40px) scale(0.92)";
      envelopeStage.style.pointerEvents = "none";

      letterModalContainer.classList.remove("hidden");
      letterModalContainer.classList.add("flex");

      requestAnimationFrame(() => {
        letterCard.style.opacity = "1";
        letterCard.style.transform = "translateY(0) scale(1)";
      });

      isModalActive = true;
      letterScrollContainer.scrollTop = 0;
      updateScrollProgress();
    }, 980);
    openStepTimers.push(modalTimer);
  }

  /**
   * Tahap 2: Pantau Progres Scroll di Dalam Kertas Surat
   */
  function updateScrollProgress() {
    if (!isModalActive || isClosing) return;

    const { scrollTop, scrollHeight, clientHeight } = letterScrollContainer;
    const maxScroll = scrollHeight - clientHeight;
    const percent =
      maxScroll > 0
        ? Math.min(100, Math.round((scrollTop / maxScroll) * 100))
        : 100;

    readProgressBar.style.width = `${percent}%`;

    if (maxScroll <= 0 || scrollTop + clientHeight >= scrollHeight - 10) {
      if (!isReachedBottom) {
        isReachedBottom = true;
        scrollIndicatorText.textContent =
          "Pesan selesai dibaca — Membuka halaman pertama...";
        scrollIndicatorText.classList.remove("text-stone-700");
        scrollIndicatorText.classList.add("text-red-900", "font-semibold");

        autoCloseTimer = setTimeout(() => {
          finishReadingAndEnterSite();
        }, 1200);
      }
    } else if (isReachedBottom) {
      isReachedBottom = false;
      clearTimeout(autoCloseTimer);
      scrollIndicatorText.textContent = isFirstRead
        ? "Gulir hingga akhir surat untuk membuka halaman pertama..."
        : "Gulir hingga akhir atau klik tombol di samping...";
      scrollIndicatorText.classList.remove("text-red-900", "font-semibold");
      scrollIndicatorText.classList.add("text-stone-700");
    }
  }

  /**
   * Tahap 3: Tutup Overlay Surat & Tampilkan Halaman Pertama Saja
   */
  function finishReadingAndEnterSite() {
    if (isClosing) return;
    isClosing = true;
    clearAllTimers();

    isFirstRead = false;
    isModalActive = false;

    letterCard.style.opacity = "0";
    letterCard.style.transform = "translateY(-16px) scale(0.96)";
    letterOverlay.style.opacity = "0";
    letterOverlay.style.pointerEvents = "none";

    lockToFirstPageOnly();
    triggerHeroLoadAnimation();

    const hideTimer = setTimeout(() => {
      letterOverlay.classList.add("hidden");
      letterModalContainer.classList.add("hidden");
      letterModalContainer.classList.remove("flex");
    }, 900);
    openStepTimers.push(hideTimer);
  }

  /**
   * Reset & Buka Ulang Amplop
   */
  function resetEnvelopeExperience() {
    clearAllTimers();
    stopFavoriteTrack(false);
    restoreAllStoryCards();
    lockToFirstPageOnly();

    if (heroStarsSection) {
      heroStarsSection.classList.remove("is-hero-loaded");
    }

    isFirstRead = false;
    isOpened = false;
    isModalActive = false;
    isReachedBottom = false;
    isClosing = false;

    letterModalContainer.classList.add("hidden");
    letterModalContainer.classList.remove("flex");
    letterCard.style.transition = "none";
    letterCard.style.opacity = "0";
    letterCard.style.transform = "translateY(24px) scale(0.9)";
    letterScrollContainer.scrollTop = 0;
    void letterCard.offsetWidth;
    letterCard.style.transition = "";

    peekLetter.style.transition = "none";
    peekLetter.style.opacity = "0";
    peekLetter.style.zIndex = "10";
    peekLetter.style.transform = "translate(-50%, 0)";
    void peekLetter.offsetWidth;
    peekLetter.style.transition = "";

    envelopeFlap.classList.remove("open");
    waxSeal.style.transition = "none";
    waxSeal.style.opacity = "1";
    waxSeal.style.transform = "translate(-50%, -50%) scale(1)";
    void waxSeal.offsetWidth;
    waxSeal.style.transition = "";

    envelopeStage.style.transition = "none";
    envelopeStage.style.opacity = "1";
    envelopeStage.style.transform = "translateY(0) scale(1)";
    envelopeStage.style.pointerEvents = "auto";
    void envelopeStage.offsetWidth;
    envelopeStage.style.transition = "";
    envelopeWrapper.classList.add("animate-levitate", "cursor-pointer");

    readProgressBar.style.width = "0%";
    enterSiteBtn.classList.remove("hidden");
    scrollIndicatorText.textContent =
      "Gulir hingga akhir atau klik tombol di samping...";
    scrollIndicatorText.classList.remove("text-red-900", "font-semibold");
    scrollIndicatorText.classList.add("text-stone-700");

    letterOverlay.classList.remove("hidden");
    void letterOverlay.offsetWidth;
    letterOverlay.style.opacity = "1";
    letterOverlay.style.pointerEvents = "auto";
  }

  envelopeWrapper.addEventListener("click", handleOpenEnvelope);
  letterScrollContainer.addEventListener("scroll", updateScrollProgress, {
    passive: true,
  });
  enterSiteBtn.addEventListener("click", finishReadingAndEnterSite);

  if (exploreMemoriesBtn) {
    exploreMemoriesBtn.addEventListener(
      "click",
      unlockSubsequentChaptersAndScroll,
    );
  }

  reopenButtons.forEach((btn) => {
    if (btn) btn.addEventListener("click", resetEnvelopeExperience);
  });

  letterOverlay.addEventListener(
    "wheel",
    (e) => {
      if (!isModalActive || isClosing) return;

      if (!letterScrollContainer.contains(e.target)) {
        letterScrollContainer.scrollTop += e.deltaY;
      }

      if (isReachedBottom && e.deltaY > 15) {
        finishReadingAndEnterSite();
      }
    },
    { passive: true },
  );

  let touchStartY = 0;
  letterOverlay.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true },
  );
  /**
   * =================================================================
   * TRANSISI TOMBOL "MASUK" (5 DETIK): SFX MEWAH + FADE OUT MUSIK + TIRAI BUNGA
   * =================================================================
   */
  const flowerCurtainOverlay = document.getElementById(
    "flower-curtain-overlay",
  );
  const flowerCurtainField = document.getElementById("flower-curtain-field");
  const flowerTransitionTriggers = Array.from(
    document.querySelectorAll("[data-flower-transition], #enter-page-btn"),
  );

  let isNavigatingWithFlowers = false;
  let audioFadeInterval = null;

  function playLuxuriousEnterSoundEffect() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    try {
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;

      // Filter hangat & delay lembut agar terasa luas dan mewah
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.85, now);
      masterGain.connect(ctx.destination);

      const delayNode = ctx.createDelay(1.0);
      delayNode.delayTime.setValueAtTime(0.28, now);
      const delayFeedback = ctx.createGain();
      delayFeedback.gain.setValueAtTime(0.32, now);
      const delayFilter = ctx.createBiquadFilter();
      delayFilter.type = "lowpass";
      delayFilter.frequency.setValueAtTime(2400, now);

      delayNode.connect(delayFilter);
      delayFilter.connect(delayFeedback);
      delayFeedback.connect(delayNode);
      delayFilter.connect(masterGain);

      // 1. Pad akor hangat (Cmaj9: C4 - G4 - B4 - D5 - E5)
      const padFreqs = [261.63, 392.0, 493.88, 587.33, 659.25];
      padFreqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = i % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime((i - 2) * 4, now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1100, now);
        filter.frequency.exponentialRampToValueAtTime(420, now + 4.1);

        oscGain.gain.setValueAtTime(0.0001, now);
        oscGain.gain.linearRampToValueAtTime(0.045, now + 0.45 + i * 0.08);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(masterGain);
        oscGain.connect(delayNode);

        osc.start(now);
        osc.stop(now + 4.3);
      });

      // 2. Arpeggio harpa / celesta berkilau
      const chimeNotes = [
        523.25, 659.25, 783.99, 987.77, 1174.66, 1318.51, 1567.98, 1975.53,
      ];
      chimeNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + 0.05 + idx * 0.14;
        const dur = 1.65;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(
          0.075 / (idx * 0.14 + 1),
          start + 0.02,
        );
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        osc.connect(gain);
        gain.connect(masterGain);
        gain.connect(delayNode);

        osc.start(start);
        osc.stop(start + dur + 0.05);
      });

      // 3. Sub-swell lembut di awal seperti gerbang terbuka
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(130.81, now);
      subOsc.frequency.exponentialRampToValueAtTime(65.41, now + 2.4);

      subGain.gain.setValueAtTime(0.0001, now);
      subGain.gain.linearRampToValueAtTime(0.11, now + 0.35);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);

      subOsc.connect(subGain);
      subGain.connect(masterGain);
      subOsc.start(now);
      subOsc.stop(now + 2.7);

      setTimeout(() => {
        ctx.close().catch(() => {});
      }, 4600);
    } catch {
      // Abaikan jika browser memblokir Web Audio
    }
  }

  function fadeOutAllMusicSmoothly(durationMs = 4300) {
    clearInterval(audioFadeInterval);

    const targets = [bgMusic, favoriteAudio].filter(
      (el) => el && !el.paused && el.volume > 0,
    );
    if (targets.length === 0) return;

    const startVolumes = targets.map((el) => el.volume);
    const startTime = performance.now();

    audioFadeInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(progress, 1.8);

      targets.forEach((el, i) => {
        el.volume = Math.max(0, startVolumes[i] * eased);
        if (progress >= 1) {
          el.pause();
          el.currentTime = 0;
        }
      });

      if (progress >= 1) {
        clearInterval(audioFadeInterval);
        audioFadeInterval = null;
      }
    }, 30);
  }

  const flowerArtworks = [
    // Bunga mawar merah marun lembut
    `<svg viewBox="0 0 64 64" class="w-full h-full drop-shadow-[0_10px_22px_rgba(0,0,0,0.5)]">
      <path fill="#9f1239" d="M32 10c6.5 0 11 5 11 11 0 3.5-1.6 6.4-4 8.3 3.8 1.2 6.5 4.7 6.5 8.9 0 5.3-4.3 9.6-9.6 9.6-1.4 0-2.7-.3-3.9-.8-1.2.5-2.5.8-3.9.8-5.3 0-9.6-4.3-9.6-9.6 0-4.2 2.7-7.7 6.5-8.9-2.4-1.9-4-4.8-4-8.3 0-6 4.5-11 11-11z"/>
      <circle cx="32" cy="30" r="8" fill="#e11d48"/>
      <path fill="#fda4af" opacity="0.65" d="M28 27c2-2 5-2 7 0-1.5 2-4.5 2.5-7 0z"/>
    </svg>`,
    // Bunga sakura / mawar merah muda hangat
    `<svg viewBox="0 0 64 64" class="w-full h-full drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)]">
      <path fill="#fb7185" d="M32 8c5 0 8.5 5.2 8.5 11.5 0 2.5-.6 4.7-1.6 6.4 2.1-1.3 4.8-2 7.6-2 6.2 0 10.6 3.8 10.6 8.5 0 4.6-4.2 8.2-10 8.5 3.4 2.2 5.5 5.8 5.5 9.8 0 5.2-4.4 9.4-9.8 9.4-4.4 0-8.1-2.8-9.2-6.7-1.1 3.9-4.8 6.7-9.2 6.7-5.4 0-9.8-4.2-9.8-9.4 0-4 2.1-7.6 5.5-9.8-5.8-.3-10-3.9-10-8.5 0-4.7 4.4-8.5 10.6-8.5 2.8 0 5.5.7 7.6 2-1-1.7-1.6-3.9-1.6-6.4C23.5 13.2 27 8 32 8z"/>
      <circle cx="32" cy="34" r="5.5" fill="#fde68a"/>
    </svg>`,
    // Bunga emas lembut
    `<svg viewBox="0 0 64 64" class="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)]">
      <ellipse cx="32" cy="15" rx="8" ry="11" fill="#f59e0b" opacity="0.92"/>
      <ellipse cx="32" cy="49" rx="8" ry="11" fill="#f59e0b" opacity="0.92"/>
      <ellipse cx="15" cy="32" rx="11" ry="8" fill="#fbbf24" opacity="0.92"/>
      <ellipse cx="49" cy="32" rx="11" ry="8" fill="#fbbf24" opacity="0.92"/>
      <ellipse cx="20" cy="20" rx="8" ry="10" transform="rotate(-45 20 20)" fill="#fcd34d" opacity="0.9"/>
      <ellipse cx="44" cy="44" rx="8" ry="10" transform="rotate(-45 44 44)" fill="#fcd34d" opacity="0.9"/>
      <ellipse cx="44" cy="20" rx="8" ry="10" transform="rotate(45 44 20)" fill="#fcd34d" opacity="0.9"/>
      <ellipse cx="20" cy="44" rx="8" ry="10" transform="rotate(45 20 44)" fill="#fcd34d" opacity="0.9"/>
      <circle cx="32" cy="32" r="7" fill="#fef3c7"/>
    </svg>`,
    // Kelopak mawar jatuh
    `<svg viewBox="0 0 36 36" class="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
      <path fill="#be123c" d="M18 3C10 9 7 16 10 24c2 5 8 9 8 9s6-4 8-9c3-8 0-15-8-21z"/>
    </svg>`,
  ];

  function buildFlowerCurtain(originX, originY) {
    if (!flowerCurtainField) return;
    flowerCurtainField.innerHTML = "";

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cols = vw < 640 ? 6 : 9;
    const rows = vh < 700 ? 6 : 7;
    const cellW = vw / cols;
    const cellH = vh / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const el = document.createElement("div");
        el.className = "flower-cover-item";

        const art =
          flowerArtworks[
            Math.floor(Math.random() * (flowerArtworks.length - 1))
          ];
        el.innerHTML = art;

        const jitterX = (Math.random() - 0.5) * cellW * 0.55;
        const jitterY = (Math.random() - 0.5) * cellH * 0.55;
        const leftPx = c * cellW + cellW * 0.5 + jitterX;
        const topPx = r * cellH + cellH * 0.5 + jitterY;

        const baseSize = Math.max(cellW, cellH) * (vw < 640 ? 1.45 : 1.35);
        const size = Math.round(baseSize * (0.95 + Math.random() * 0.35));

        const distFromClick = Math.hypot(leftPx - originX, topPx - originY);
        const maxDist = Math.hypot(vw, vh) * 0.65;
        const delaySec = Math.min(
          1.8,
          (distFromClick / Math.max(1, maxDist)) * 1.35 + Math.random() * 0.45,
        );
        const durSec = (2.2 + Math.random() * 0.85).toFixed(2);
        const rotStart = Math.floor((Math.random() - 0.5) * 90);
        const rotSpin = Math.floor((Math.random() - 0.5) * 90);

        el.style.left = `${leftPx.toFixed(1)}px`;
        el.style.top = `${topPx.toFixed(1)}px`;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.setProperty(
          "--drift-x",
          `${((Math.random() - 0.5) * 32).toFixed(1)}px`,
        );
        el.style.setProperty(
          "--drift-y",
          `${((Math.random() - 0.5) * 32).toFixed(1)}px`,
        );
        el.style.setProperty("--scale-peak", "1.1");
        el.style.setProperty("--scale-end", "1.34");
        el.style.setProperty("--rot-start", `${rotStart}deg`);
        el.style.setProperty("--rot-spin", `${rotSpin}deg`);
        el.style.setProperty("--bloom-delay", `${delaySec.toFixed(2)}s`);
        el.style.setProperty("--bloom-dur", `${durSec}s`);

        flowerCurtainField.appendChild(el);
      }
    }

    const petalCount = vw < 640 ? 34 : 56;
    const petalSvg = flowerArtworks[flowerArtworks.length - 1];
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement("div");
      petal.className = "flower-cover-item";
      petal.innerHTML = petalSvg;

      const leftPx = Math.random() * vw;
      const topPx = Math.random() * vh;
      const size = Math.floor(Math.random() * 26) + 22;
      const delaySec = (Math.random() * 1.9).toFixed(2);
      const durSec = (2.3 + Math.random() * 0.9).toFixed(2);

      petal.style.left = `${leftPx.toFixed(1)}px`;
      petal.style.top = `${topPx.toFixed(1)}px`;
      petal.style.width = `${size}px`;
      petal.style.height = `${size}px`;
      petal.style.setProperty(
        "--drift-x",
        `${((Math.random() - 0.5) * 95).toFixed(1)}px`,
      );
      petal.style.setProperty(
        "--drift-y",
        `${(40 + Math.random() * 80).toFixed(1)}px`,
      );
      petal.style.setProperty("--scale-peak", "1.18");
      petal.style.setProperty("--scale-end", "0.95");
      petal.style.setProperty(
        "--rot-start",
        `${Math.floor(Math.random() * 360)}deg`,
      );
      petal.style.setProperty(
        "--rot-spin",
        `${Math.floor((Math.random() - 0.5) * 280)}deg`,
      );
      petal.style.setProperty("--bloom-delay", `${delaySec}s`);
      petal.style.setProperty("--bloom-dur", `${durSec}s`);

      flowerCurtainField.appendChild(petal);
    }
  }

  function navigateWithFlowerCurtain(targetHref, triggerEl, event) {
    if (!targetHref || isNavigatingWithFlowers) return;
    isNavigatingWithFlowers = true;

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    if (event && typeof event.clientX === "number" && event.clientX > 0) {
      cx = event.clientX;
      cy = event.clientY;
    } else if (triggerEl) {
      const rect = triggerEl.getBoundingClientRect();
      cx = rect.left + rect.width / 2;
      cy = rect.top + rect.height / 2;
    }

    playLuxuriousEnterSoundEffect();
    fadeOutAllMusicSmoothly(4300);

    if (typeof spawnExploreTransitionEffect === "function") {
      spawnExploreTransitionEffect(triggerEl, event);
    }

    if (!flowerCurtainOverlay) {
      setTimeout(() => {
        window.location.href = targetHref;
      }, 5000);
      return;
    }

    buildFlowerCurtain(cx, cy);
    flowerCurtainOverlay.classList.remove("hidden");
    void flowerCurtainOverlay.offsetWidth;
    requestAnimationFrame(() => {
      flowerCurtainOverlay.classList.add("is-covering");
    });

    // Animasi tirai & bunga penuh 5 detik sebelum berpindah halaman
    setTimeout(() => {
      window.location.href = targetHref;
    }, 5000);
  }

  flowerTransitionTriggers.forEach((el) => {
    el.addEventListener("click", (e) => {
      const href =
        el.getAttribute("data-target-href") || el.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      e.preventDefault();
      navigateWithFlowerCurtain(href, el, e);
    });
  });

  letterOverlay.addEventListener(
    "touchmove",
    (e) => {
      if (!isModalActive || isClosing) return;
      const touchCurrentY = e.touches[0].clientY;
      const deltaY = touchStartY - touchCurrentY;

      if (!letterScrollContainer.contains(e.target)) {
        letterScrollContainer.scrollTop += deltaY;
        touchStartY = touchCurrentY;
      }

      if (isReachedBottom && deltaY > 25) {
        finishReadingAndEnterSite();
      }
    },
    { passive: true },
  );
});
