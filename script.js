document.addEventListener("DOMContentLoaded", () => {
  // ========== 1. TABS EN GLOBAL MEDIA ==========

  const tabButtons = document.querySelectorAll(".tab-button");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });

      tabPanels.forEach((panel) => {
        panel.hidden = true;
      });

      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const panelId = btn.getAttribute("aria-controls");
      const panel = document.getElementById(panelId);
      if (panel) panel.hidden = false;
    });
  });

  // ========== 2. REVEAL ON SCROLL ==========
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  // ========== 3. GRAFICAS: CREAR BARRAS Y ANIMARLAS ==========

  const charts = document.querySelectorAll(".bar-chart");

  charts.forEach((chart) => {
    const bars = chart.querySelectorAll(".bar");
    const values = [];

    bars.forEach((bar) => {
      const raw = bar.getAttribute("data-value");
      const value = raw ? parseFloat(raw) : 0;
      values.push(value);
    });

    const maxValue = Math.max(...values, 1);

    bars.forEach((bar, index) => {
      const value = values[index];

      // Crear el relleno visual
      let fill = bar.querySelector(".bar-fill");
      if (!fill) {
        fill = document.createElement("div");
        fill.className = "bar-fill";
        bar.appendChild(fill);
      }

      // Etiqueta de abajo
      let labelEl = bar.querySelector(".bar-label");
      if (!labelEl) {
        labelEl = document.createElement("div");
        labelEl.className = "bar-label";
        labelEl.textContent = bar.getAttribute("data-label") || "";
        bar.appendChild(labelEl);
      }

      // Asegurar que existe span.bar-value
      let valueSpan = bar.querySelector(".bar-value");
      if (!valueSpan) {
        valueSpan = document.createElement("span");
        valueSpan.className = "bar-value";
        valueSpan.textContent = value.toString();
        bar.appendChild(valueSpan);
      } else {
        valueSpan.textContent = value.toString();
      }

      // Calcular altura relativa (máx 70% del alto)
      const percent = (value / maxValue) * 70;
      bar.style.setProperty("--bar-height", `${percent}%`);
    });
  });

  // Observer para animar cuando entran al viewport
  if ("IntersectionObserver" in window) {
    const chartObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-bars");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    charts.forEach((chart) => chartObserver.observe(chart));
  } else {
    charts.forEach((chart) => chart.classList.add("animate-bars"));
  }

  // (Opcional) Click en barra = log en consola
  charts.forEach((chart) => {
    chart.querySelectorAll(".bar").forEach((bar) => {
      bar.addEventListener("click", () => {
        const label = bar.getAttribute("data-label");
        const valueText = bar.querySelector(".bar-value")?.innerText || "";
        console.log(`Bar clicked: ${label} → ${valueText}`);
      });
    });
  });
});
