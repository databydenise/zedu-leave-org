(() => {
  const bell = document.querySelector("#channelBellmoji");
  const hint = document.querySelector("#pointingHint");
  const emptyState = document.querySelector("#channelEmptyState");
  const preview = document.querySelector("#channelPreview");
  const previewTitle = document.querySelector("#previewTitle");
  const backToEmpty = document.querySelector("#backToEmpty");
  const channelButtons = document.querySelectorAll(".channel-link");

  if (!bell || !emptyState || !preview) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const poses = {
    walk1: "public/images/bellmoji/bell-walk-1.png",
    walk2: "public/images/bellmoji/bell-walk-2.png",
    sitting: "public/images/bellmoji/bell-sit.png",
    pointing: "public/images/bellmoji/bell-point.png"
  };

  // Preload the PNGs
  Object.values(poses).forEach((src) => {
    const image = new Image();
    image.src = src;
  });

  let timers = [];
  let walkingInterval = null;

  function later(callback, delay) {
    const timer = window.setTimeout(callback, delay);
    timers.push(timer);
    return timer;
  }

  function clearAnimationTimers() {
    timers.forEach((timer) => window.clearTimeout(timer));
    timers = [];

    if (walkingInterval !== null) {
      window.clearInterval(walkingInterval);
      walkingInterval = null;
    }
  }

  function showPose(pose, animationClass = "") {
    bell.src = poses[pose];
    bell.dataset.pose = pose;
    bell.className = "channel-bellmoji";

    if (animationClass) {
      bell.classList.add(animationClass);
    }
  }

  function startEntrance() {
    clearAnimationTimers();

    if (reducedMotion.matches) {
      showPose("sitting");
      return;
    }

    showPose("walk1", "is-walking");

    let frame = 0;

    // Swap legs every 250ms
    walkingInterval = window.setInterval(() => {
      frame += 1;
      bell.src = frame % 2 === 0 ? poses.walk1 : poses.walk2;
    }, 250); 

    // Stop walking at exactly 3 seconds
    later(() => {
      if (walkingInterval !== null) {
        window.clearInterval(walkingInterval);
        walkingInterval = null;
      }
      showPose("sitting", "is-sitting");
    }, 3000);

    // Start pointing/idle after she finishes sitting
    later(startIdle, 3320); 
  }

    function startIdle() {
    showPose("pointing", "is-pointing");

    const plane = document.getElementById("paperPlane");
    const channelsHeading = document.querySelector(".section-heading");

    if (hint && plane && channelsHeading) {
      hint.classList.remove("visible");
      void hint.offsetWidth;
      hint.classList.add("visible");

      const bellRect = bell.getBoundingClientRect();
      const headingRect = channelsHeading.getBoundingClientRect();

      // Calculate exact pixel distance to the Channels heading
      const deltaX = (headingRect.left + 30) - (bellRect.left + 60); 
      const deltaY = (headingRect.top + 10) - (bellRect.top + 30);

      plane.style.setProperty('--fly-x', `${deltaX}px`);
      plane.style.setProperty('--fly-y', `${deltaY}px`);

      // Launch plane
      plane.classList.remove("is-flying");
      void plane.offsetWidth;
      plane.classList.add("is-flying");

      // Trigger the heart thump when the plane hits (1.8 seconds later)
      later(() => {
        channelsHeading.classList.add("is-hit");
        // Clean up the class after the 800ms animation finishes
        setTimeout(() => channelsHeading.classList.remove("is-hit"), 800);
      }, 1800);
    }

    later(() => {
      bell.classList.remove("is-pointing");
      bell.classList.add("is-idle");
    }, 450);
  }

  function showChannel(button) {
    const label = button.textContent.trim().replace(/^[#♙]\s*/, "");

    emptyState.hidden = true;
    preview.hidden = false;
    previewTitle.textContent = label;
    clearAnimationTimers();

    channelButtons.forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
  }

  function showEmptyState() {
    preview.hidden = true;
    emptyState.hidden = false;

    channelButtons.forEach((item) => {
      item.removeAttribute("aria-pressed");
    });

    startEntrance();
  }

  channelButtons.forEach((button) => {
    button.addEventListener("click", () => showChannel(button));
  });

  if (backToEmpty) {
    backToEmpty.addEventListener("click", showEmptyState);
  }

  // Run on page load
  startEntrance();
})();