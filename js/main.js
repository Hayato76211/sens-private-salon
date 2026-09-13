const header = document.querySelector(".site-header");
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

function updateParallax() {
  if (reduceMotion.matches) return;
  document.querySelectorAll("[data-parallax]").forEach((el) => {
    const host = el.parentElement;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    const speed = Number(el.dataset.parallaxSpeed) || 0.28;
    const extra = Math.max(0, (el.offsetHeight - host.clientHeight) / 2);
    const raw = (rect.top - window.innerHeight * 0.2) * speed;
    const offset = extra ? Math.max(-extra, Math.min(extra, raw)) : raw;
    el.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
}

let ticking = false;
function onScroll() {
  updateHeader();
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateParallax();
    ticking = false;
  });
}

updateHeader();
updateParallax();
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", updateParallax);

toggle?.addEventListener("click", () => {
  const open = nav?.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(Boolean(open)));
});

document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", () => nav?.classList.remove("is-open"));
});

document.querySelectorAll(".time-slot").forEach((select) => {
  for (let hour = 10; hour <= 20; hour += 1) {
    for (const minute of ["00", "30"]) {
      if (hour === 20 && minute === "30") continue;
      const value = `${String(hour).padStart(2, "0")}:${minute}`;
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.append(option);
    }
  }
});

const local = new Date();
const today = new Date(local.getTime() - local.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
document.querySelectorAll('input[type="date"]').forEach((input) => {
  input.min = today;
});

const reserveForm = document.querySelector("#reserve-form-el") || document.querySelector("#reserve-form");
reserveForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(reserveForm);
  const body = [...data.entries()]
    .filter(([, value]) => String(value).trim())
    .map(([key, value]) => `${key}：${value}`)
    .join("\n");
  const mailto = `mailto:sens.privatesalon@gmail.com?subject=${encodeURIComponent("【SENS】ご予約リクエスト")}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
  const done = document.querySelector(".form-done");
  if (done) done.hidden = false;
});
