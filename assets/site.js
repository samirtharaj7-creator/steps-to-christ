/* ============================================================
   Steps to Christ — cinematic interactions
   Scroll-reveal, reading-progress bar, parallax glow.
   ============================================================ */
(function () {
  "use strict";

  /* --- scroll reveal --- */
  const items = document.querySelectorAll(".reveal");
  if (items.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("in"));
  }

  /* --- reading progress + parallax glow (one scroll handler) --- */
  const bar = document.getElementById("progress");
  const root = document.documentElement;
  const pageTopbar = document.querySelector(".topbar");
  document.body.classList.toggle("has-chapter-topbar", Boolean(pageTopbar));
  let lastScrollY = Math.max(root.scrollTop || window.scrollY, 0);
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = root.scrollHeight - root.clientHeight;
      const y = root.scrollTop || window.scrollY;
      const delta = y - lastScrollY;
      if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
      document.body.style.setProperty("--scroll", y);
      document.body.classList.toggle("has-scrolled", y > 96);
      if (pageTopbar) {
        if (y <= 16 || delta < 0) document.body.classList.remove("chapter-bar-hidden");
        else if (y > 80 && delta > 3) document.body.classList.add("chapter-bar-hidden");
      }
      lastScrollY = y;
      ticking = false;
    });
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --- shared chapter selector --- */
  const chapterSteps = [
    ["01-gods-love.html", "1 · Loved First", "#dc5a74"],
    ["02-need-of-christ.html", "2 · Why We Need Jesus", "#d76a4c"],
    ["03-repentance.html", "3 · A Real Change of Heart", "#cf7f3a"],
    ["04-confession.html", "4 · Coming Clean", "#c99328"],
    ["05-consecration.html", "5 · All In", "#a99a2e"],
    ["06-faith-and-acceptance.html", "6 · Receive the Gift", "#7fa03f"],
    ["07-test-of-discipleship.html", "7 · The Evidence of a Changed Life", "#3f9b6b"],
    ["08-growing-up.html", "8 · Stay Connected", "#2f9a9c"],
    ["09-work-and-life.html", "9 · Love Goes to Work", "#3a8bc4"],
    ["10-knowledge-of-god.html", "10 · Learning to See God", "#4d73c6"],
    ["11-prayer.html", "11 · Talk to God as a Friend", "#6a63c2"],
    ["12-doubt.html", "12 · Faith When You Have Questions", "#9159b4"],
    ["13-rejoicing.html", "13 · A Life of Joy", "#e0a52e"]
  ];
  const chapterTopbar = pageTopbar;
  if (chapterTopbar) {
    const currentFile = window.location.pathname.split("/").pop();
    const chapterJourney = document.createElement("nav");
    chapterJourney.className = "journey chapter-journey";
    chapterJourney.setAttribute("aria-label", "Choose a step");

    chapterSteps.forEach(([href, title, color]) => {
      const link = document.createElement("a");
      link.href = href;
      link.dataset.title = title;
      link.style.setProperty("--dot", color);
      link.setAttribute("aria-label", `Step ${title}`);
      if (href === currentFile) link.setAttribute("aria-current", "step");
      chapterJourney.appendChild(link);
    });

    chapterTopbar.insertAdjacentElement("afterend", chapterJourney);
  }

  /* --- touch-friendly chapter ribbon --- */
  const journeyLinks = Array.from(document.querySelectorAll(".journey a"));
  const coarsePointer = window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (coarsePointer && journeyLinks.length) {
    journeyLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        if (!link.classList.contains("is-active")) {
          event.preventDefault();
          journeyLinks.forEach((item) => item.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    });
    document.addEventListener("pointerdown", (event) => {
      if (!event.target.closest(".journey")) journeyLinks.forEach((item) => item.classList.remove("is-active"));
    });
  }

  /* --- About this edition dialog --- */
  const editionDialog = document.getElementById("about-edition");
  const editionOpen = document.querySelector("[data-edition-open]");
  const editionClose = document.querySelectorAll("[data-edition-close]");
  if (editionDialog && editionOpen) {
    editionOpen.addEventListener("click", () => {
      if (typeof editionDialog.showModal === "function") editionDialog.showModal();
      else editionDialog.setAttribute("open", "");
    });
    editionClose.forEach((button) => button.addEventListener("click", () => editionDialog.close()));
    editionDialog.addEventListener("click", (event) => {
      if (event.target === editionDialog) editionDialog.close();
    });
  }

})();
