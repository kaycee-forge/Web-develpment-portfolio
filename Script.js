/* ==========================================================
   KAYCEE_FORGE — SITE SCRIPT
   ========================================================== */

(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav scroll state ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 8) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");

  if (navToggle && mobileMenu) {
    function closeMobileMenu() {
      mobileMenu.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation menu");
      document.body.style.overflow = "";
    }

    navToggle.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMobileMenu();
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && mobileMenu.classList.contains("is-open")) {
        closeMobileMenu();
        navToggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && mobileMenu.classList.contains("is-open")) {
        closeMobileMenu();
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Render "Selected Work" grid from projects-data.js ---------- */
  function renderWorkGrid() {
    var grid = document.getElementById("workGrid");
    if (!grid || typeof projects === "undefined") return;

    var html = projects
      .map(function (p) {
        return (
          '<article class="work-card" aria-label="Project: ' +
          escapeHtml(p.title) +
          '">' +
          '<div class="work-card-media">' +
          renderPreview(p) +
          '<span class="work-card-number mono">' +
          p.number +
          "</span>" +
          "</div>" +
          '<div class="work-card-body">' +
          '<p class="work-card-category">' +
          escapeHtml(p.category) +
          "</p>" +
          '<h3 class="work-card-title">' +
          escapeHtml(p.title) +
          "</h3>" +
          '<p class="work-card-desc">' +
          escapeHtml(p.shortDescription) +
          "</p>" +
          '<div class="work-card-tags">' +
          p.tags
            .map(function (t) {
              return '<span class="tag">' + escapeHtml(t) + "</span>";
            })
            .join("") +
          "</div>" +
          '<div class="work-card-actions">' + renderLiveAction(p) + "</div>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");

    grid.innerHTML = html;
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function renderLiveAction(project) {
    return '<a class="work-card-live" href="' + escapeHtml(project.liveUrl) + '" target="_blank" rel="noopener noreferrer">View Live Website</a>';
  }

  function renderPreview(project) {
    var imagePath = project.image || "";
    if (imagePath) {
      return '<img class="work-card-preview" src="' + escapeHtml(imagePath) + '" alt="Preview of ' + escapeHtml(project.title) + '" onerror="this.parentNode.querySelector(\'.work-card-image-placeholder\').hidden=false; this.remove();">' +
        '<div class="work-card-image-placeholder" hidden>Screenshot to be added<br><span>' + escapeHtml(imagePath) + '</span></div>';
    }
    return '<div class="work-card-image-placeholder">Screenshot to be added</div>';
  }

  renderWorkGrid();
})();