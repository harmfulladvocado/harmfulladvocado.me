document.addEventListener('DOMContentLoaded', () => {

  /* Dynamic Calendar Mapping */
  const computeMetrics = () => {
    const epoch = new Date('2010-05-30');
    const now = new Date();

    let age = now.getFullYear() - epoch.getFullYear();
    const balance = now.getMonth() - epoch.getMonth();
    if (balance < 0 || (balance === 0 && now.getDate() < epoch.getDate())) {
      age--;
    }

    const ageNode = document.getElementById('age-span');
    if (ageNode) ageNode.textContent = age;

    const yearNode = document.getElementById('copyright-year');
    if (yearNode) yearNode.textContent = now.getFullYear();
  };

  computeMetrics();

  /* Theme Provider */
  const themeBtn = document.getElementById('themeBtn');
  const frame = document.documentElement;
  const initialTheme = localStorage.getItem('theme') || 'dark';

  frame.setAttribute('data-theme', initialTheme);
  if (themeBtn) themeBtn.textContent = initialTheme.toUpperCase();

  themeBtn?.addEventListener('click', () => {
    const active = frame.getAttribute('data-theme');
    const target = active === 'dark' ? 'light' : 'dark';
    frame.setAttribute('data-theme', target);
    themeBtn.textContent = target.toUpperCase();
    localStorage.setItem('theme', target);
  });

  /* Intersection Observers for Scroll Reveals & Skill Bars */
  const scrollElements = document.querySelectorAll('.fade-up');
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  scrollElements.forEach(el => scrollObserver.observe(el));

  const bars = document.querySelectorAll('.metric-fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const value = entry.target.getAttribute('data-width');
        // Add a slight delay for dramatic effect after the section fades in
        setTimeout(() => {
          entry.target.style.transition = 'width 1.4s cubic-bezier(0.25, 1, 0.5, 1)';
          entry.target.style.width = value;
        }, 200);
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(el => barObserver.observe(el));

  /* Custom Sophisticated Smooth Scroll Engine for Navigation */
  function easeInOutQuint(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
  }

  function smoothScrollTo(targetY, duration) {
    const startY = window.scrollY;
    const difference = targetY - startY;
    let startTime = null;

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = currentTime - startTime;
      const percentage = Math.min(progress / duration, 1);

      window.scrollTo(0, startY + difference * easeInOutQuint(percentage));

      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    }
    window.requestAnimationFrame(step);
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');

      if (targetId === '#') {
        smoothScrollTo(0, 1000); // 1 second top scroll
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Offset for the fixed header
        const headerOffset = 100;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        smoothScrollTo(offsetPosition, 1200); // 1.2 seconds custom cinematic deceleration
      }
    });
  });

});