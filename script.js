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
