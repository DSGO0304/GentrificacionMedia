// Reveal sections on scroll
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Inicializar gráficas de barras si la sección las contiene
        const charts = entry.target.querySelectorAll(".bar-chart");
        charts.forEach(initBarChart);
      }
    });
  },
  {
    threshold: 0.12
  }
);

// Observar todas las secciones .reveal
reveals.forEach(el => observer.observe(el));

/**
 * Inicializa una gráfica de barras:
 * - Encuentra el valor máximo
 * - Escala cada barra a un porcentaje de altura
 */
function initBarChart(chart) {
  if (chart.dataset.ready === "true") return;

  const bars = chart.querySelectorAll(".bar");
  let max = 0;

  bars.forEach(bar => {
    const val = Number(bar.dataset.value) || 0;
    if (val > max) max = val;
  });

  bars.forEach(bar => {
    const val = Number(bar.dataset.value) || 0;
    const heightPercent = max > 0 ? (val / max) * 100 : 0;
    bar.style.height = heightPercent + "%";
  });

  chart.dataset.ready = "true";
}

// Smooth scroll for nav links
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const href = link.getAttribute("href");
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// MAP INTERACTIVO SENCILLO
const mapPins = document.querySelectorAll(".map-pin");
const mapTitle = document.getElementById("map-area-title");
const mapList = document.getElementById("map-area-points");

if (mapPins && mapTitle && mapList) {
  mapPins.forEach(pin => {
    pin.addEventListener("click", () => {
      const name = pin.dataset.name || "Neighborhood";
      const pointsRaw = pin.dataset.points || "";
      const pointsArr = pointsRaw.split("|").map(p => p.trim()).filter(p => p.length > 0);

      // Actualizar título
      mapTitle.textContent = name;

      // Actualizar lista
      mapList.innerHTML = "";
      pointsArr.forEach(p => {
        const li = document.createElement("li");
        li.textContent = p;
        mapList.appendChild(li);
      });

      // Pequeño feedback visual
      mapPins.forEach(p => p.classList.remove("active-pin"));
      pin.classList.add("active-pin");
    });
  });
}

// BEFORE / AFTER SLIDERS
const baBlocks = document.querySelectorAll(".before-after");

baBlocks.forEach(block => {
  const slider = block.querySelector(".ba-slider");
  const overlay = block.querySelector(".ba-overlay");
  const divider = block.querySelector(".ba-divider");

  if (!slider || !overlay || !divider) return;

  const updateSlider = () => {
    const value = Number(slider.value);
    overlay.style.width = value + "%";
    divider.style.left = value + "%";
  };

  slider.addEventListener("input", updateSlider);
  // Inicializar posición
  updateSlider();
});

// RENT CALCULATOR
const rentForm = document.getElementById("rent-form");
const incomeInput = document.getElementById("income-input");
const rentResult = document.getElementById("rent-result");

if (rentForm && incomeInput && rentResult) {
  rentForm.addEventListener("submit", e => {
    e.preventDefault();

    const income = Number(incomeInput.value);
    if (!income || income <= 0) {
      rentResult.textContent = "Please enter a valid monthly income.";
      return;
    }

    // Regla 30% ingreso -> renta máxima
    const maxRent = income * 0.3;

    // Renta aproximada por zona (MXN)
    const areas = [
      { name: "Iztapalapa", rent: 11000 },
      { name: "Centro", rent: 18000 },
      { name: "CDMX average", rent: 21000 },
      { name: "Roma Norte", rent: 29100 },
      { name: "Condesa", rent: 30071 },
      { name: "Polanco", rent: 42000 }
    ];

    const affordable = areas.filter(a => maxRent >= a.rent).map(a => a.name);

    if (affordable.length === 0) {
      rentResult.textContent =
        "With this income, even 30% is not enough to comfortably afford rents in the central areas shown in the graphs.";
    } else {
      rentResult.textContent =
        "With this income, spending around 30% on rent, you could potentially afford: " +
        affordable.join(", ") +
        ".";
    }
  });
}
