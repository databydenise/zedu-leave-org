(() => {
  const $ = (selector) => document.querySelector(selector);

  const backdrop = $('#leaveBackdrop');
  const leaveTrigger = $('#leaveTrigger');
  const cancelButton = $('#cancelLeave');
  const closeButton = $('#modalClose');
  const confirmButton = $('#confirmLeave');
  const celebration = $('#celebration');
  const dismissCelebration = $('#dismissCelebration');
  const toast = $('#demoToast');
  const dismissToast = $('#dismissToast');

  let previousFocus = null;
  let celebrationTimer = null;
  let toastTimer = null;

  function openLeaveDialog() {
    previousFocus = document.activeElement;
    hideCelebration();
    backdrop.hidden = false;
    document.body.classList.add('dialog-open');
    closeButton.focus();
  }

  function closeLeaveDialog({ celebrate = false } = {}) {
    backdrop.hidden = true;
    document.body.classList.remove('dialog-open');
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    if (celebrate) showCelebration();
  }

  function showCelebration() {
    clearTimeout(celebrationTimer);
    celebration.hidden = false;
    // Restart the overlay entrance and Bellmoji animation when it appears again.
    celebration.classList.remove('replay');
    void celebration.offsetWidth;
    celebration.classList.add('replay');
    celebrationTimer = setTimeout(hideCelebration, 2600);
  }

  function hideCelebration() {
    clearTimeout(celebrationTimer);
    celebration.hidden = true;
    celebration.classList.remove('replay');
  }

  function showDemoToast() {
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3800);
  }

  leaveTrigger.addEventListener('click', openLeaveDialog);
  cancelButton.addEventListener('click', () => closeLeaveDialog({ celebrate: true }));
  closeButton.addEventListener('click', () => closeLeaveDialog({ celebrate: true }));
  dismissCelebration.addEventListener('click', hideCelebration);
  dismissToast.addEventListener('click', () => { toast.hidden = true; clearTimeout(toastTimer); });

  // Clicking the dimmed backdrop behaves like closing the dialog.
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) closeLeaveDialog({ celebrate: true });
  });

  // Escape closes the modal, but focus stays predictable and accessible.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !backdrop.hidden) {
      closeLeaveDialog({ celebrate: true });
    }
    if (event.key === 'Tab' && !backdrop.hidden) {
      const focusable = [closeButton, cancelButton, confirmButton];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // This is a visual prototype only: never remove the user from an organisation.
  confirmButton.addEventListener('click', () => {
    closeLeaveDialog();
    showDemoToast();
  });

  // Make the non-critical settings controls feel responsive in the prototype.
  document.querySelectorAll('.settings-link').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.settings-link').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // Clicking the workspace switch is intentionally harmless in this mock.
  $('.workspace-switch').addEventListener('click', () => {
    const switcher = $('.workspace-switch');
    switcher.animate(
      [{ transform: 'translateY(0)' }, { transform: 'translateY(-2px)' }, { transform: 'translateY(0)' }],
      { duration: 220, easing: 'ease-out' }
    );
  });
})();