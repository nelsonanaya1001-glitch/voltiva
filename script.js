// Mobile nav
const navToggle = document.getElementById("navToggle");
const mobileDrawer = document.getElementById("mobileDrawer");
if (navToggle && mobileDrawer) {
  navToggle.addEventListener("click", () => {
    const open = mobileDrawer.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  mobileDrawer.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      mobileDrawer.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );
}

// FAQ accordion
document.querySelectorAll(".faq-item").forEach((item) => {
  const btn = item.querySelector(".faq-q");
  const answer = item.querySelector(".faq-a");
  btn.addEventListener("click", () => {
    const isOpen = item.getAttribute("data-open") === "true";
    document.querySelectorAll(".faq-item").forEach((other) => {
      other.setAttribute("data-open", "false");
      other.querySelector(".faq-a").style.maxHeight = null;
    });
    if (!isOpen) {
      item.setAttribute("data-open", "true");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

// Coverage meter — animate fill + counting value when scrolled into view
const meterFill = document.getElementById("meterFill");
const meterValue = document.getElementById("meterValue");
const TARGET = 96;

if (meterFill && meterValue) {
  let animated = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          meterFill.classList.add("filled");
          const start = performance.now();
          const duration = 1100;
          function tick(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            meterValue.textContent = Math.round(eased * TARGET) + "%";
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      });
    },
    { threshold: 0.4 }
  );
  observer.observe(meterFill);
}

// Application form — front-end only, no backend wired up yet
const applyForm = document.getElementById("applyForm");
const formSuccess = document.getElementById("formSuccess");
if (applyForm && formSuccess) {
  applyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formSuccess.classList.add("show");
    applyForm.reset();
    setTimeout(() => formSuccess.classList.remove("show"), 6000);
  });
}
