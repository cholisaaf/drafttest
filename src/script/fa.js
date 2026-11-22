document.addEventListener("DOMContentLoaded", () => {
  const stage = document.getElementById("butterfly-3d-stage");
  const pivot = document.getElementById("butterfly-3d-pivot");
  const angleReadout = document.getElementById("butterfly-angle-readout");
  const resetBtn = document.getElementById("butterfly-reset-btn");

  if (!stage || !pivot) return;

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

    if (!isDragging) {
      autoSpinY = normalize360(autoSpinY + dt * 16);
    }

    currentRotX += (targetRotX - currentRotX) * 0.12;
    currentRotY += (targetRotY - currentRotY) * 0.12;

    const totalY = currentRotY + autoSpinY;
    const hoverLift = Math.sin(now * 0.0022) * 8;

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
});
