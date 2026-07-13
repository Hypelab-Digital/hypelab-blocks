/* Praxis Redesign — interacciones */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Toggle claro/oscuro ── */
  var LOGOS = {
    light: "/praxis-redesign/assets/logo-praxis-dark.png",
    dark: "/praxis-redesign/assets/logo-praxis.png"
  };
  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    document.querySelectorAll(".js-logo").forEach(function (img) {
      img.src = LOGOS[theme];
    });
    try { localStorage.setItem("praxis-theme", theme); } catch (e) {}
  }
  var toggle = document.getElementById("themeToggle");
  toggle.addEventListener("click", function () {
    var isDark = document.documentElement.getAttribute("data-theme") === "dark";
    applyTheme(isDark ? "light" : "dark");
  });
  if (document.documentElement.getAttribute("data-theme") === "dark") {
    document.querySelectorAll(".js-logo").forEach(function (img) { img.src = LOGOS.dark; });
  }

  /* ── Scroll progress bar + nav state ── */
  var nav = document.getElementById("nav");
  var scrollBar = document.getElementById("scrollBar");
  function onScroll() {
    var h = document.documentElement;
    var scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    scrollBar.style.width = scrolled * 100 + "%";
    nav.classList.toggle("is-scrolled", h.scrollTop > 30);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ── */
  var burger = document.getElementById("navBurger");
  var menu = document.getElementById("navMenu");
  burger.addEventListener("click", function () {
    menu.classList.toggle("is-open");
    nav.classList.toggle("is-open-mobile");
  });

  /* ── Reveal on scroll ── */
  var revealEls = document.querySelectorAll(".reveal");
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute("data-delay") || "0", 10);
        setTimeout(function () {
          el.classList.add("is-visible");
        }, prefersReduced ? 0 : delay);
        io.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach(function (el) { io.observe(el); });

  /* ── Section-level visibility (stat bar, steps line) ── */
  var statSection = document.querySelector(".stat-section");
  var stepsLine = document.getElementById("stepsProgress");
  var sectionIO = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        if (entry.target.id === "como-funciona" && stepsLine) {
          stepsLine.style.width = "100%";
        }
        sectionIO.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );
  if (statSection) sectionIO.observe(statSection);
  var stepsSection = document.getElementById("como-funciona");
  if (stepsSection) sectionIO.observe(stepsSection);

  /* ── Count-up numbers ── */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (prefersReduced) { el.textContent = target; return; }
    var duration = 1600;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var countIO = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        countIO.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-count]").forEach(function (el) { countIO.observe(el); });

  /* ── Card hover glow follows cursor ── */
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - rect.left + "px");
      card.style.setProperty("--my", e.clientY - rect.top + "px");
    });
  });

  /* ── Testimonial slider ── */
  var slides = document.querySelectorAll(".tslide");
  var dots = document.querySelectorAll(".tslider__dot");
  var current = 0;
  var timer = null;

  function goTo(i) {
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    current = (i + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    dots[current].classList.add("is-active");
  }
  function startAuto() {
    if (prefersReduced) return;
    timer = setInterval(function () { goTo(current + 1); }, 6500);
  }
  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      clearInterval(timer);
      goTo(i);
      startAuto();
    });
  });
  if (slides.length) startAuto();
})();
