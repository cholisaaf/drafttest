/* =========================================================================
   CUSTOM FAVORITE CSS — KHUSUS HALAMAN favorite.html
   ========================================================================= */

html,
body {
  overflow-x: clip;
  max-width: 100%;
}

/* Scroll Progress Thread di bawah Navbar */
.scroll-progress-track {
  width: 100%;
  height: 2px;
  background: rgba(253, 230, 138, 0.08);
  overflow: hidden;
}

.scroll-progress-thread {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #a855f7 0%, #e879f9 55%, #fde047 100%);
  box-shadow: 0 0 10px rgba(232, 121, 249, 0.65);
  transition: width 0.08s linear;
}

.fav-canvas {
  background-color: #181210;
  background-image:
    radial-gradient(
      ellipse 80% 42% at 55% 14%,
      rgba(168, 85, 247, 0.16) 0%,
      transparent 72%
    ),
    radial-gradient(
      ellipse 85% 45% at 50% 48%,
      rgba(120, 72, 32, 0.15) 0%,
      transparent 75%
    ),
    radial-gradient(
      ellipse 85% 48% at 55% 84%,
      rgba(88, 28, 135, 0.14) 0%,
      transparent 78%
    ),
    linear-gradient(180deg, #181210 0%, #161112 35%, #15100e 65%, #181210 100%);
  overflow-x: clip;
}

/* Layer Kunang-Kunang / Constellation */
.fav-firefly-layer {
  position: fixed;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  overflow: hidden;
  contain: strict;
}

@keyframes fireflyFloat {
  0%,
  100% {
    opacity: 0.18;
    transform: translate3d(0px, 0px, 0) scale(0.85);
  }
  50% {
    opacity: 0.78;
    transform: translate3d(var(--ff-dx, 14px), var(--ff-dy, -18px), 0)
      scale(1.18);
  }
}

.fav-firefly-dot {
  position: absolute;
  border-radius: 9999px;
  background: radial-gradient(
    circle,
    #fef08a 0%,
    #c084fc 65%,
    transparent 100%
  );
  box-shadow: 0 0 12px rgba(216, 180, 254, 0.65);
  animation: fireflyFloat var(--ff-dur, 5s) ease-in-out infinite;
  animation-delay: var(--ff-delay, 0s);
}

/* Tirai pembuka halaman */
.entry-curtain-left {
  transform: translate3d(0%, 0, 0);
  transition: transform 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.25s;
}

.entry-curtain-right {
  transform: translate3d(0%, 0, 0);
  transition: transform 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.25s;
}

#entry-curtain-overlay.is-open .entry-curtain-left {
  transform: translate3d(-100%, 0, 0);
}

#entry-curtain-overlay.is-open .entry-curtain-right {
  transform: translate3d(100%, 0, 0);
}

/* Partikel percikan saat sentuh / klik */
@keyframes favParticleFly {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.35) rotate(0deg);
  }
  22% {
    opacity: 1;
    transform: translate(
        calc(-50% + var(--tx) * 0.35),
        calc(-50% + var(--ty) * 0.35 - 12px)
      )
      scale(1.12) rotate(calc(var(--rot) * 0.3));
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty) - 65px))
      scale(0.55) rotate(var(--rot));
  }
}

.click-particle {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  animation: favParticleFly var(--duration, 1.1s) cubic-bezier(0.16, 1, 0.3, 1)
    forwards;
}

/* =========================================================================
   KUPU-KUPU UNGU 3D INTERAKTIF (ROTASI 360 DERAJAT + MOOD + RIPPLE)
   ========================================================================= */
.butterfly-3d-stage {
  perspective: 1200px;
  perspective-origin: 50% 45%;
  touch-action: none;
  user-select: none;
}

.butterfly-ripple-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

@keyframes butterflyRippleExpand {
  0% {
    opacity: 0.78;
    transform: scale(0.35);
  }
  100% {
    opacity: 0;
    transform: scale(1.65);
  }
}

.butterfly-ripple-ring {
  position: absolute;
  width: 170px;
  height: 170px;
  border-radius: 9999px;
  border: 1.5px solid rgba(232, 121, 249, 0.75);
  box-shadow:
    0 0 24px rgba(192, 132, 252, 0.45),
    inset 0 0 18px rgba(253, 224, 71, 0.25);
  animation: butterflyRippleExpand 0.95s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.butterfly-3d-pivot {
  position: relative;
  width: clamp(220px, 64vw, 340px);
  height: clamp(190px, 54vw, 280px);
  transform-style: preserve-3d;
}

@keyframes leftWingFlap3D {
  0%,
  100% {
    transform: rotateY(32deg) rotateZ(4deg);
  }
  50% {
    transform: rotateY(-18deg) rotateZ(-3deg);
  }
}

@keyframes rightWingFlap3D {
  0%,
  100% {
    transform: rotateY(-32deg) rotateZ(-4deg);
  }
  50% {
    transform: rotateY(18deg) rotateZ(3deg);
  }
}

@keyframes violetHaloPulse {
  0%,
  100% {
    opacity: 0.58;
    transform: translate(-50%, -50%) scale(0.95);
  }
  50% {
    opacity: 0.92;
    transform: translate(-50%, -50%) scale(1.04);
  }
}

.butterfly-wing-left {
  position: absolute;
  top: 12%;
  right: 50%;
  width: 47%;
  height: 74%;
  transform-origin: 100% 46%;
  transform-style: preserve-3d;
  animation: leftWingFlap3D 2.6s ease-in-out infinite;
}

.butterfly-wing-right {
  position: absolute;
  top: 12%;
  left: 50%;
  width: 47%;
  height: 74%;
  transform-origin: 0% 46%;
  transform-style: preserve-3d;
  animation: rightWingFlap3D 2.6s ease-in-out infinite;
}

.butterfly-3d-stage.is-dragging .butterfly-wing-left,
.butterfly-3d-stage.is-dragging .butterfly-wing-right {
  animation-duration: 4.4s;
}

.butterfly-3d-stage.is-flutter-boost .butterfly-wing-left,
.butterfly-3d-stage.is-flutter-boost .butterfly-wing-right {
  animation-duration: 0.55s;
}

.butterfly-body-3d {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -46%) translateZ(10px);
  transform-style: preserve-3d;
  pointer-events: none;
}

.butterfly-violet-aura {
  transform: translate(-50%, -50%);
  animation: violetHaloPulse 4.2s ease-in-out infinite;
  transition: background 0.5s ease;
}

.butterfly-mood-btn {
  color: rgba(243, 232, 255, 0.75);
  background: rgba(34, 26, 23, 0.78);
  border-color: rgba(216, 180, 254, 0.22);
}

.butterfly-mood-btn:hover {
  color: #fef9c3;
  border-color: rgba(253, 230, 138, 0.45);
}

.butterfly-mood-btn.is-active {
  color: #fef08a;
  background: rgba(88, 28, 135, 0.65);
  border-color: rgba(253, 224, 71, 0.55);
  box-shadow: 0 0 18px rgba(168, 85, 247, 0.35);
}

#kupu-kupu-ungu-3d[data-mood="amber"] .butterfly-violet-aura {
  background: radial-gradient(
    circle at center,
    rgba(251, 191, 36, 0.24) 0%,
    rgba(217, 119, 6, 0.14) 38%,
    rgba(168, 85, 247, 0.06) 56%,
    rgba(24, 18, 16, 0) 70%
  );
}

#kupu-kupu-ungu-3d[data-mood="nocturne"] .butterfly-violet-aura {
  background: radial-gradient(
    circle at center,
    rgba(139, 92, 246, 0.26) 0%,
    rgba(59, 7, 100, 0.18) 42%,
    rgba(244, 114, 182, 0.06) 58%,
    rgba(24, 18, 16, 0) 70%
  );
}

/* Logo scroll down simple & klasik bouncing */
@keyframes classicScrollBounce {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.72;
  }
  50% {
    transform: translateY(6px);
    opacity: 1;
  }
}

.classic-scroll-arrow {
  animation: classicScrollBounce 2s ease-in-out infinite;
}

/* =========================================================================
   LINTASAN DIAGONAL KIRI-ATAS -> TENGAH -> KANAN-BAWAH (TERMASUK FOOTER)
   ========================================================================= */
.diagonal-track-viewport {
  perspective: 1600px;
  perspective-origin: 50% 45%;
  overflow-x: clip;
}

.diagonal-track-node {
  transform-style: preserve-3d;
  transform: translate3d(
      var(--node-x, 0px),
      var(--node-y, 0px),
      var(--node-z, 0px)
    )
    rotateX(var(--node-rx, 0deg)) rotateY(var(--node-ry, 0deg))
    rotateZ(var(--node-rz, 0deg));
}

.portrait-card-3d {
  transform-style: preserve-3d;
  transform: translate3d(
      var(--card-x, 0px),
      var(--card-y, 0px),
      var(--card-z, 0px)
    )
    rotateX(var(--card-rx, 0deg)) rotateY(var(--card-ry, 0deg))
    rotateZ(var(--card-rz, 0deg));
  transition:
    border-color 0.35s ease,
    box-shadow 0.35s ease;
}

.portrait-card-3d:hover {
  border-color: rgba(216, 180, 254, 0.5);
  box-shadow: 0 28px 65px rgba(0, 0, 0, 0.8);
}

.portrait-photo-3d {
  transform-style: preserve-3d;
  transform: translate3d(
      var(--photo-x, 0px),
      var(--photo-y, 0px),
      var(--photo-z, 16px)
    )
    scale(var(--photo-scale, 1.03));
}

.portrait-caption-3d {
  transform-style: preserve-3d;
  transform: translate3d(
    var(--cap-x, 0px),
    var(--cap-y, 0px),
    var(--cap-z, 24px)
  );
}

/* Lightbox Potret Dia */
.portrait-lightbox-modal {
  position: fixed;
  inset: 0;
  z-index: 10030;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(12, 9, 16, 0.88);
  backdrop-filter: blur(12px);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
}

.portrait-lightbox-modal.is-open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.portrait-lightbox-card {
  max-width: min(520px, 92vw);
  width: 100%;
  border-radius: 1.5rem;
  padding: 1rem;
  background: linear-gradient(
    165deg,
    rgba(39, 24, 52, 0.96),
    rgba(22, 16, 20, 0.98)
  );
  border: 1px solid rgba(253, 230, 138, 0.38);
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.portrait-lightbox-close {
  align-self: flex-end;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 0.95rem;
  color: #fde68a;
  background: rgba(24, 18, 28, 0.85);
  border: 1px solid rgba(251, 191, 36, 0.35);
  border-radius: 9999px;
  padding: 0.3rem 0.9rem;
  cursor: pointer;
}

.portrait-lightbox-img {
  max-height: 68dvh;
  width: auto;
  max-width: 100%;
  border-radius: 1rem;
  object-fit: contain;
}

.portrait-lightbox-caption {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-style: italic;
  font-size: 1.15rem;
  color: #fef3c7;
  text-align: center;
}

/* =========================================================================
   ANIMASI MUNCUL SAAT DI-SCROLL + SECTION BUTTON 3D "BUKA PESAN"
   ========================================================================= */
.scroll-entrance-section {
  opacity: 0;
  filter: blur(6px);
  transition:
    opacity 0.95s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.95s cubic-bezier(0.16, 1, 0.3, 1);
}

.scroll-entrance-section.is-entered {
  opacity: 1;
  filter: blur(0px);
}

.exclusive-curtain-shell {
  position: relative;
  overflow: hidden;
  perspective: 1400px;
  transform-style: preserve-3d;
}

.portal-halo-ring {
  position: absolute;
  left: var(--portal-x, 50%);
  top: var(--portal-y, 64%);
  width: clamp(220px, 46vw, 340px);
  height: clamp(110px, 22vw, 150px);
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  background: radial-gradient(
    circle at center,
    rgba(216, 180, 254, 0.22) 0%,
    rgba(251, 191, 36, 0.12) 48%,
    transparent 74%
  );
  border: 1px solid rgba(253, 230, 138, 0.16);
  filter: blur(6px);
  pointer-events: none;
  z-index: 4;
  transition:
    left 0.22s ease-out,
    top 0.22s ease-out,
    opacity 0.3s ease;
}

.exclusive-curtain-left,
.exclusive-curtain-right {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  z-index: 20;
  pointer-events: none;
  transition: transform 1.25s cubic-bezier(0.22, 1, 0.36, 1) 0.15s;
}

.exclusive-curtain-left {
  left: 0;
  transform: translate3d(0%, 0, 0);
  background: linear-gradient(90deg, #190a0b 0%, #2c1012 65%, #3e1619 100%);
  border-right: 1px solid rgba(252, 211, 77, 0.25);
}

.exclusive-curtain-right {
  right: 0;
  transform: translate3d(0%, 0, 0);
  background: linear-gradient(270deg, #190a0b 0%, #2c1012 65%, #3e1619 100%);
  border-left: 1px solid rgba(252, 211, 77, 0.25);
}

.scroll-entrance-section.is-entered .exclusive-curtain-left {
  transform: translate3d(-100%, 0, 0);
}

.scroll-entrance-section.is-entered .exclusive-curtain-right {
  transform: translate3d(100%, 0, 0);
}

@keyframes buttonAuraBreath {
  0%,
  100% {
    opacity: 0.55;
    transform: translate(-50%, -50%) scale(0.95);
  }
  50% {
    opacity: 0.95;
    transform: translate(-50%, -50%) scale(1.08);
  }
}

@keyframes buttonShimmerSweep {
  0% {
    transform: translate3d(-140%, 0, 0) skewX(-22deg);
  }
  55%,
  100% {
    transform: translate3d(240%, 0, 0) skewX(-22deg);
  }
}

.btn-3d-stage {
  perspective: 1100px;
  transform-style: preserve-3d;
  transform: translate3d(
      calc(var(--cta-x, 0px) + var(--mag-x, 0px)),
      calc(var(--cta-y, 0px) + var(--mag-y, 0px)),
      var(--cta-z, 24px)
    )
    rotateX(var(--cta-rx, 0deg)) rotateY(var(--cta-ry, 0deg))
    rotateZ(var(--cta-rz, 0deg)) scale(var(--cta-scale, 1));
}

.btn-3d-aura {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(340px, 82vw);
  height: 110px;
  border-radius: 9999px;
  background: radial-gradient(
    circle at center,
    rgba(192, 132, 252, 0.34) 0%,
    rgba(251, 191, 36, 0.18) 45%,
    transparent 72%
  );
  filter: blur(14px);
  pointer-events: none;
  animation: buttonAuraBreath 3.6s ease-in-out infinite;
}

.btn-3d-bevel {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  padding: 1rem 2.2rem;
  border-radius: 9999px;
  background: linear-gradient(
    135deg,
    #4c1d95 0%,
    #7e22ce 38%,
    #581c87 72%,
    #451a03 100%
  );
  border: 1.5px solid rgba(253, 230, 138, 0.55);
  box-shadow:
    0 10px 0 #2e1065,
    0 22px 45px rgba(0, 0, 0, 0.82),
    0 0 32px rgba(168, 85, 247, 0.38),
    inset 0 2px 2px rgba(255, 255, 255, 0.32),
    inset 0 -3px 8px rgba(24, 18, 16, 0.65);
  transform-style: preserve-3d;
  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.28s ease;
  overflow: hidden;
}

.btn-3d-bevel::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 48%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.26),
    transparent
  );
  animation: buttonShimmerSweep 4.2s ease-in-out infinite;
  pointer-events: none;
}

.btn-3d-stage:hover .btn-3d-bevel {
  transform: translateY(-4px) translateZ(14px);
  border-color: rgba(254, 240, 138, 0.9);
}

.btn-3d-stage:active .btn-3d-bevel {
  transform: translateY(6px) translateZ(-4px);
}

/* =========================================================================
   POPUP FULL SCREEN ANIME (YOUR NAME / TWILIGHT ATMOSPHERE)
   ========================================================================= */
@keyframes popupCardReveal {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
    filter: blur(6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0px);
  }
}

@keyframes cometPreludeSweep {
  0% {
    opacity: 0;
    transform: translate3d(-45%, -35%, 0) rotate(-24deg) scaleX(0.4);
  }
  35% {
    opacity: 0.95;
  }
  100% {
    opacity: 0;
    transform: translate3d(55%, 45%, 0) rotate(-24deg) scaleX(1.35);
  }
}

.anime-comet-prelude {
  position: fixed;
  inset: 0;
  z-index: 10018;
  pointer-events: none;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.anime-comet-prelude.is-active {
  opacity: 1;
}

.anime-comet-streak {
  position: absolute;
  top: 26%;
  left: 10%;
  width: min(560px, 85vw);
  height: 5px;
  border-radius: 9999px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(232, 121, 249, 0.45) 35%,
    rgba(254, 240, 138, 0.95) 85%,
    #ffffff 100%
  );
  box-shadow:
    0 0 28px rgba(253, 224, 71, 0.85),
    0 0 54px rgba(192, 132, 252, 0.65);
}

.anime-comet-prelude.is-active .anime-comet-streak {
  animation: cometPreludeSweep 1.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes counterStepPop {
  0% {
    transform: scale(0.82);
    opacity: 0.6;
  }
  65% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes seventeenMegaPop {
  0% {
    transform: scale(0.55) rotate(-4deg);
    opacity: 0.3;
    filter: drop-shadow(0 0 0 rgba(253, 224, 71, 0));
  }
  58% {
    transform: scale(1.24) rotate(2deg);
    opacity: 1;
    filter: drop-shadow(0 0 28px rgba(253, 224, 71, 0.75));
  }
  80% {
    transform: scale(0.97) rotate(-0.8deg);
  }
  100% {
    transform: scale(1.04) rotate(0deg);
    opacity: 1;
    filter: drop-shadow(0 0 22px rgba(216, 180, 254, 0.56));
  }
}

@keyframes flowerScatterFall {
  0% {
    opacity: 0;
    transform: translate3d(var(--fx-start, 0px), -12vh, 0) scale(0.5)
      rotate(0deg);
  }
  12% {
    opacity: 0.92;
  }
  85% {
    opacity: 0.85;
  }
  100% {
    opacity: 0;
    transform: translate3d(var(--fx-end, 40px), 112vh, 24px) scale(1.06)
      rotate(var(--fx-rot, 420deg));
  }
}

/* Daun jatuh -> nyangkut di atas kartu -> lalu jatuh lagi */
@keyframes animeLeafLandAndDrop {
  0% {
    opacity: 0;
    transform: translate3d(var(--sx), var(--sy), 0) scale(0.75) rotate(-25deg);
  }
  14% {
    opacity: 0.96;
  }
  34% {
    opacity: 1;
    transform: translate3d(var(--lx), var(--ly), 0) scale(1)
      rotate(var(--land-rot));
  }
  62% {
    opacity: 1;
    transform: translate3d(calc(var(--lx) + 3px), calc(var(--ly) + 1px), 0)
      scale(1) rotate(calc(var(--land-rot) + 4deg));
  }
  100% {
    opacity: 0;
    transform: translate3d(var(--dx), var(--dy), 0) scale(0.95)
      rotate(var(--drop-rot));
  }
}

/* Daun dekat kamera dengan blur kedalaman */
@keyframes animeCameraBlurFall {
  0% {
    opacity: 0;
    transform: translate3d(0px, -18vh, 60px) scale(0.85) rotate(0deg);
    filter: blur(var(--blur-px, 5px));
  }
  15% {
    opacity: var(--blur-op, 0.65);
  }
  85% {
    opacity: var(--blur-op, 0.65);
  }
  100% {
    opacity: 0;
    transform: translate3d(var(--bx-end, 60px), 118vh, 80px) scale(1.22)
      rotate(var(--b-rot, 280deg));
    filter: blur(var(--blur-px, 6px));
  }
}

@keyframes animeTwilightDrift {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(0.96) rotate(0deg);
    opacity: 0.75;
  }
  50% {
    transform: translate(-48%, -52%) scale(1.08) rotate(3deg);
    opacity: 1;
  }
}

@keyframes animeGodRaysPulse {
  0%,
  100% {
    opacity: 0.35;
    transform: translateX(-50%) rotate(-8deg) scale(1);
  }
  50% {
    opacity: 0.62;
    transform: translateX(-50%) rotate(-5deg) scale(1.06);
  }
}

@keyframes animeStarTwinkle {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(0.75);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.25);
  }
}

.birthday-grand-modal.anime-twilight-popup {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh;
  max-height: 100dvh;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(0.65rem, 2vw, 1.25rem);
  background:
    radial-gradient(
      ellipse 110% 75% at 50% 18%,
      rgba(168, 85, 247, 0.28) 0%,
      rgba(88, 28, 135, 0.16) 42%,
      rgba(14, 11, 20, 0.95) 85%
    ),
    linear-gradient(180deg, #140f24 0%, #1d132b 42%, #181116 100%);
  backdrop-filter: blur(14px);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  overflow: hidden;
  box-sizing: border-box;
  transition:
    opacity 0.45s ease,
    visibility 0.45s ease;
}

.birthday-grand-modal.anime-twilight-popup.is-open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.anime-sky-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10001;
  pointer-events: none;
  overflow: hidden;
}

.anime-twilight-orb {
  position: absolute;
  top: 28%;
  left: 50%;
  width: min(680px, 95vw);
  height: min(440px, 60vh);
  border-radius: 9999px;
  background: radial-gradient(
    circle at center,
    rgba(253, 224, 71, 0.22) 0%,
    rgba(232, 121, 249, 0.2) 36%,
    rgba(109, 40, 217, 0.12) 64%,
    transparent 78%
  );
  filter: blur(28px);
  animation: animeTwilightDrift 7s ease-in-out infinite;
}

.anime-god-rays {
  position: absolute;
  top: -15%;
  left: 50%;
  width: min(1100px, 140vw);
  height: 120vh;
  background: repeating-linear-gradient(
    112deg,
    rgba(254, 240, 138, 0.045) 0px,
    rgba(254, 240, 138, 0.045) 28px,
    transparent 28px,
    transparent 84px
  );
  filter: blur(10px);
  animation: animeGodRaysPulse 6.5s ease-in-out infinite;
}

.anime-starlight-layer {
  position: absolute;
  inset: 0;
}

.anime-twinkle-dot {
  position: absolute;
  border-radius: 9999px;
  background: #fef9c3;
  box-shadow: 0 0 8px rgba(254, 240, 138, 0.85);
  animation: animeStarTwinkle var(--twinkle-dur, 3s) ease-in-out infinite;
  animation-delay: var(--twinkle-delay, 0s);
}

.birthday-flowers-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 10004;
  pointer-events: none;
  overflow: hidden;
}

.anime-perched-leaves-layer {
  position: fixed;
  inset: 0;
  z-index: 10012;
  pointer-events: none;
  overflow: hidden;
}

.anime-foreground-blur-layer {
  position: fixed;
  inset: 0;
  z-index: 10020;
  pointer-events: none;
  overflow: hidden;
}

.scattered-flower-item {
  position: absolute;
  top: -40px;
  animation: flowerScatterFall var(--fx-dur, 4.8s)
    cubic-bezier(0.22, 0.85, 0.36, 1) forwards;
  animation-delay: var(--fx-delay, 0s);
}

.anime-perched-leaf {
  position: fixed;
  top: 0;
  left: 0;
  animation: animeLeafLandAndDrop 4.4s cubic-bezier(0.22, 0.85, 0.36, 1)
    forwards;
}

.anime-camera-blur-leaf {
  position: fixed;
  top: -60px;
  animation: animeCameraBlurFall var(--b-dur, 3.2s)
    cubic-bezier(0.2, 0.78, 0.35, 1) forwards;
  animation-delay: var(--b-delay, 0s);
}

.anime-popup-stage-wrap {
  position: relative;
  z-index: 10010;
  width: 100%;
  max-width: 920px;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  overflow: hidden;
}

.birthday-minimal-premium-card.anime-your-name-card {
  position: relative;
  width: 100%;
  max-width: 880px;
  max-height: calc(100dvh - 4.4rem);
  overflow: hidden;
  border-radius: 1.65rem;
  padding: clamp(0.9rem, 2.2vw, 1.75rem) clamp(1rem, 2.8vw, 2.1rem);
  background: linear-gradient(
    155deg,
    rgba(35, 22, 54, 0.9) 0%,
    rgba(24, 17, 34, 0.94) 55%,
    rgba(20, 15, 22, 0.96) 100%
  );
  border: 1px solid rgba(253, 230, 138, 0.38);
  box-shadow:
    0 32px 90px rgba(0, 0, 0, 0.88),
    0 0 50px rgba(168, 85, 247, 0.2),
    inset 0 1px 0 rgba(254, 243, 199, 0.22);
  backdrop-filter: blur(18px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
}

.birthday-grand-modal.anime-twilight-popup.is-open
  .birthday-minimal-premium-card.anime-your-name-card {
  animation: popupCardReveal 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.anime-card-topline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  color: #fde68a;
  margin-bottom: 0.6rem;
}

.anime-card-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;
  align-items: center;
}

@media (min-width: 768px) {
  .anime-card-grid {
    grid-template-columns: minmax(250px, 0.96fr) minmax(0, 1.04fr);
    gap: clamp(1.25rem, 2.6vw, 2.25rem);
    text-align: left;
  }

  .anime-card-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

/* =========================================================================
   ANIMASI MASUK FOTO POPUP (~5 DETIK): BUNGA MENYUSUN & MENYINGKAP GAMBAR
   ========================================================================= */
@keyframes diaPhotoFiveSecReveal {
  0% {
    opacity: 0;
    transform: scale(1.08);
    filter: blur(14px) saturate(0.75) brightness(1.25);
    clip-path: circle(6% at 50% 42%);
  }
  28% {
    opacity: 0.42;
    transform: scale(1.05);
    filter: blur(8px) saturate(0.95) brightness(1.12);
    clip-path: circle(34% at 50% 46%);
  }
  62% {
    opacity: 0.82;
    transform: scale(1.02);
    filter: blur(3px) saturate(1.06) brightness(1.04);
    clip-path: circle(68% at 50% 50%);
  }
  88% {
    opacity: 0.97;
    transform: scale(1.005);
    filter: blur(0.8px) saturate(1.04) brightness(1.01);
    clip-path: circle(96% at 50% 50%);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0px) saturate(1.02) brightness(1);
    clip-path: circle(140% at 50% 50%);
  }
}

@keyframes diaPetalAssemble {
  0% {
    opacity: 0;
    transform: translate3d(var(--psx, 0px), var(--psy, -60px), 0) scale(0.55)
      rotate(var(--pr0, -45deg));
  }
  22% {
    opacity: 0.95;
  }
  58% {
    opacity: 1;
    transform: translate3d(var(--pmx, 0px), var(--pmy, 0px), 0) scale(1.06)
      rotate(var(--prm, 15deg));
  }
  82% {
    opacity: 0.75;
    transform: translate3d(var(--pex, 0px), var(--pey, 35px), 0) scale(0.9)
      rotate(var(--pre, 65deg));
  }
  100% {
    opacity: 0;
    transform: translate3d(var(--pex, 0px), var(--pey, 75px), 0) scale(0.5)
      rotate(calc(var(--pre, 65deg) + 45deg));
  }
}

@keyframes photoFrameAuraPulse {
  0%,
  100% {
    opacity: 0.55;
    transform: scale(0.98);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.03);
  }
}

@keyframes photoFrameSweep {
  0% {
    transform: translate3d(-150%, -150%, 0) rotate(24deg);
    opacity: 0;
  }
  25% {
    opacity: 0.85;
  }
  65%,
  100% {
    transform: translate3d(160%, 160%, 0) rotate(24deg);
    opacity: 0;
  }
}

.anime-dia-photo-frame {
  position: relative;
  width: min(68vw, 255px);
  max-height: min(34dvh, 300px);
  aspect-ratio: 3 / 4;
  margin-inline: auto;
  border-radius: 1.35rem;
  padding: 5px;
  overflow: visible;
  border: 1.5px solid rgba(253, 230, 138, 0.55);
  background: linear-gradient(
    145deg,
    rgba(253, 224, 71, 0.28),
    rgba(168, 85, 247, 0.24) 48%,
    rgba(251, 191, 36, 0.22)
  );
  box-shadow:
    0 20px 44px rgba(0, 0, 0, 0.72),
    0 0 28px rgba(192, 132, 252, 0.34),
    inset 0 0 0 1px rgba(243, 232, 255, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .anime-dia-photo-frame {
    width: clamp(230px, 28vw, 310px);
    max-height: clamp(270px, 42dvh, 380px);
    border-radius: 1.45rem;
    padding: 6px;
  }
}

.anime-photo-inner-clip {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: calc(1.35rem - 5px);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .anime-photo-inner-clip {
    border-radius: calc(1.45rem - 6px);
  }
}

.anime-photo-inner-clip::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid rgba(254, 240, 138, 0.32);
  pointer-events: none;
  z-index: 6;
}

.anime-photo-frame-glow {
  position: absolute;
  inset: -10px;
  border-radius: 1.85rem;
  background: radial-gradient(
    circle at 50% 45%,
    rgba(216, 180, 254, 0.32) 0%,
    rgba(251, 191, 36, 0.16) 52%,
    transparent 75%
  );
  filter: blur(14px);
  z-index: -1;
  pointer-events: none;
  animation: photoFrameAuraPulse 3.8s ease-in-out infinite;
}

.anime-frame-corner {
  position: absolute;
  z-index: 8;
  font-size: 0.8rem;
  line-height: 1;
  color: #fef08a;
  text-shadow: 0 0 10px rgba(253, 224, 71, 0.85);
  background: rgba(24, 17, 34, 0.92);
  border: 1px solid rgba(253, 230, 138, 0.45);
  border-radius: 9999px;
  width: 1.35rem;
  height: 1.35rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.anime-frame-corner.is-tl {
  top: -0.5rem;
  left: -0.5rem;
}

.anime-frame-corner.is-tr {
  top: -0.5rem;
  right: -0.5rem;
  color: #e9d5ff;
}

.anime-frame-corner.is-bl {
  bottom: -0.5rem;
  left: -0.5rem;
  color: #e9d5ff;
}

.anime-frame-corner.is-br {
  bottom: -0.5rem;
  right: -0.5rem;
}

.anime-dia-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.anime-dia-photo-img.is-five-sec-entering {
  animation: diaPhotoFiveSecReveal 5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.anime-photo-petal-assembly-layer {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  overflow: hidden;
}

.dia-assembling-petal {
  position: absolute;
  top: 50%;
  left: 50%;
  animation: diaPetalAssemble var(--pdur, 4.4s)
    cubic-bezier(0.22, 0.85, 0.36, 1) forwards;
  animation-delay: var(--pdelay, 0s);
}

.anime-dia-photo-placeholder {
  width: 100%;
  height: 100%;
  padding: 0.75rem;
  background: radial-gradient(
    circle at 50% 25%,
    rgba(192, 132, 252, 0.22),
    rgba(18, 13, 26, 0.95)
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  text-align: center;
}

.anime-photo-badge {
  font-family: "Cinzel Decorative", Georgia, serif;
  font-size: 0.65rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #fde68a;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  background: rgba(88, 28, 135, 0.45);
  border: 1px solid rgba(216, 180, 254, 0.35);
}

.anime-photo-shine {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 4;
}

.anime-photo-shine::after {
  content: "";
  position: absolute;
  inset: -40%;
  background: linear-gradient(
    115deg,
    transparent 35%,
    rgba(255, 255, 255, 0.22) 50%,
    rgba(232, 121, 249, 0.14) 56%,
    transparent 70%
  );
  animation: photoFrameSweep 5.5s ease-in-out infinite;
}

.anime-card-content {
  width: 100%;
}

.age-number-giant {
  display: inline-block;
  font-family: "Cinzel Decorative", Georgia, serif;
  font-weight: 700;
  font-size: clamp(3rem, 9.5vw, 5.2rem);
  line-height: 1;
  background: linear-gradient(180deg, #fef9c3 0%, #fde047 45%, #e9d5ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.age-number-giant.is-step-pop {
  animation: counterStepPop 0.14s ease-out;
}

.age-number-giant.is-seventeen-pop {
  animation: seventeenMegaPop 0.7s cubic-bezier(0.18, 1.35, 0.35, 1) forwards;
}

.prayer-block-reveal {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.prayer-block-reveal.is-revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Tombol tutup di bawah dan di luar popup */
.outside-popup-close-btn {
  position: relative;
  z-index: 10015;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  background: rgba(24, 18, 28, 0.92);
  color: #fde68a;
  border: 1px solid rgba(251, 191, 36, 0.42);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.7);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 1rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.outside-popup-close-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(254, 240, 138, 0.8);
  color: #fef9c3;
}

.outside-popup-close-btn:active {
  transform: translateY(0);
}

/* =========================================================================
   KARTU KENANGAN INTERAKTIF + PIN + SPOTLIGHT FOCUS
   ========================================================================= */
.memory-entry-card {
  transition:
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.35s ease,
    background-color 0.35s ease,
    box-shadow 0.35s ease,
    opacity 0.35s ease;
}

.memory-entry-card:hover {
  border-color: rgba(251, 191, 36, 0.35);
}

.memory-entry-card.is-expanded {
  grid-column: 1 / -1;
  background-color: #271b26;
  border-color: rgba(216, 180, 254, 0.48);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.75);
}

.memory-entry-card.is-pinned {
  border-color: rgba(253, 224, 71, 0.52);
  box-shadow:
    0 20px 52px rgba(0, 0, 0, 0.68),
    0 0 24px rgba(168, 85, 247, 0.22);
}

.memory-entry-card.is-dimmed {
  opacity: 0.62;
}

.memory-pin-btn {
  color: rgba(243, 232, 255, 0.75);
  background: rgba(34, 26, 23, 0.75);
  border-color: rgba(216, 180, 254, 0.22);
}

.memory-pin-btn:hover {
  color: #fef08a;
  border-color: rgba(253, 224, 71, 0.45);
}

.memory-entry-card.is-pinned .memory-pin-btn {
  color: #fef08a;
  background: rgba(88, 28, 135, 0.65);
  border-color: rgba(253, 224, 71, 0.65);
}

.memory-scroll-area {
  scrollbar-width: thin;
  scrollbar-color: rgba(216, 180, 254, 0.35) rgba(34, 26, 23, 0.4);
}

.memory-scroll-area::-webkit-scrollbar {
  width: 6px;
}

.memory-scroll-area::-webkit-scrollbar-track {
  background: rgba(34, 26, 23, 0.4);
  border-radius: 9999px;
}

.memory-scroll-area::-webkit-scrollbar-thumb {
  background: rgba(216, 180, 254, 0.35);
  border-radius: 9999px;
}

@media (prefers-reduced-motion: reduce) {
  .butterfly-wing-left,
  .butterfly-wing-right,
  .butterfly-violet-aura,
  .butterfly-ripple-ring,
  .click-particle,
  .classic-scroll-arrow,
  .btn-3d-aura,
  .btn-3d-bevel::before,
  .scattered-flower-item,
  .anime-perched-leaf,
  .anime-camera-blur-leaf,
  .anime-twilight-orb,
  .anime-god-rays,
  .anime-twinkle-dot,
  .anime-comet-prelude.is-active .anime-comet-streak,
  .fav-firefly-dot,
  .age-number-giant.is-step-pop,
  .age-number-giant.is-seventeen-pop,
  .anime-dia-photo-img.is-five-sec-entering,
  .dia-assembling-petal,
  .anime-photo-frame-glow,
  .anime-photo-shine::after {
    animation: none !important;
  }

  .diagonal-track-node,
  .portrait-card-3d,
  .portrait-photo-3d,
  .portrait-caption-3d,
  .scroll-entrance-section,
  .exclusive-curtain-left,
  .exclusive-curtain-right,
  .btn-3d-stage,
  .btn-3d-bevel,
  .birthday-grand-modal,
  .birthday-minimal-premium-card,
  .prayer-block-reveal,
  .memory-entry-card,
  .portrait-lightbox-modal,
  .scroll-progress-thread,
  .portal-halo-ring {
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
    filter: none !important;
  }
}
