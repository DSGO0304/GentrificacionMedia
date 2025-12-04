document.addEventListener("DOMContentLoaded", () => {
  /* ========================
     1. TABS — GLOBAL MEDIA
  ======================== */
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });

      tabPanels.forEach((panel) => (panel.hidden = true));

      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const panelId = btn.getAttribute("aria-controls");
      const panel = document.getElementById(panelId);
      if (panel) panel.hidden = false;
    });
  });

  /* ========================
     2. REVEAL ON SCROLL
  ======================== */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }
});
