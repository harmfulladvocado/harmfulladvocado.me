document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const darkToggle = document.getElementById("darkToggle");
  const darkIcon = document.getElementById("darkIcon");
  const darkText = document.getElementById("darkText");

  function applyTheme(theme) {
    if (theme === "light") {
      body.classList.add("light");
      darkIcon.textContent = "🌞";
      darkText.textContent = "i told you💔";
    } else {
      body.classList.remove("light");
      darkIcon.textContent = "🌙";
      darkText.textContent = "don't";
    }
  }

  const saved = localStorage.getItem("theme");
  applyTheme(saved || "dark");

  darkToggle.addEventListener("click", () => {
    const newTheme = body.classList.contains("light") ? "dark" : "light";
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  });

  const bars = document.querySelectorAll(".skill-bar");
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        const percent = parseFloat(bar.dataset.percent);
        const fill = bar.querySelector(".fill");
        fill.style.width = percent + "%";
        obs.unobserve(bar);
      });
    },
    { threshold: 0.4 }
  );
  bars.forEach((b) => observer.observe(b));

  const headerHeight = document.querySelector(".site-header").offsetHeight;
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function smoothScrollTo(targetY, duration = 800) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let startTime = null;

    function animateScroll(currentTime) {
      if (!startTime) startTime = currentTime;
      const time = Math.min((currentTime - startTime) / duration, 1);
      const eased = easeInOutCubic(time);
      window.scrollTo(0, startY + diff * eased);
      if (time < 1) requestAnimationFrame(animateScroll);
    }

    requestAnimationFrame(animateScroll);
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const id = anchor.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;
      const targetY = target.offsetTop - headerHeight + 1;
      smoothScrollTo(targetY, 900); // 900ms duration
    });
  });
});
