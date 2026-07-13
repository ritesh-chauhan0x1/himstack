document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const body = document.body;
  const loader = document.querySelector(".loader");
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (navMenu) {
    const isPagesFolder = window.location.pathname.toLowerCase().includes("/pages/");
    const basePath = isPagesFolder ? "../" : "./";
    const menuHeader = document.createElement("li");
    menuHeader.className = "nav-menu-header";
    menuHeader.innerHTML = `
      <div class="nav-menu-logo">
        <img src="${basePath}logo/logoHimstack.png" alt="HimStack logo">
      </div>
      <div class="nav-menu-title">HimStack Pvt Ltd</div>
    `;
    navMenu.prepend(menuHeader);
  }

 // Theme: restore saved preference (falls back to the dark default set in CSS)
const THEME_KEY = "himstack-theme";
const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme === "light" || savedTheme === "dark") {
  root.dataset.theme = savedTheme;
}

document.addEventListener("click", (event) => {
  const toggleBtn = event.target.closest(".theme-toggle");
  if (!toggleBtn) return;
  const isLight = root.dataset.theme === "light";
  root.dataset.theme = isLight ? "dark" : "light";
  localStorage.setItem(THEME_KEY, root.dataset.theme);
});

  // Click Spark Effect
  document.addEventListener("click", (e) => {
    const spark = document.createElement("div");
    spark.className = "click-spark";
    spark.style.left = `${e.clientX}px`;
    spark.style.top = `${e.clientY}px`;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 450);
  }, { passive: true });

  window.addEventListener("load", () => {
    loader?.classList.add("hidden");
    body.classList.remove("loading");
  });

  const onScroll = () => {
    header?.classList.toggle("scrolled", window.scrollY > 18);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggleMenu = () => {
    const isOpen = navMenu?.classList.toggle("active");
    navToggle?.classList.toggle("open", Boolean(isOpen));
    header?.classList.toggle("menu-open", Boolean(isOpen));
    navToggle?.setAttribute("aria-expanded", String(Boolean(isOpen)));
  };

  document.addEventListener("click", (event) => {
    if (event.target.closest(".nav-toggle")) {
      toggleMenu();
      return;
    }

    if (navMenu?.classList.contains("active") && !event.target.closest(".nav-menu")) {
      navMenu.classList.remove("active");
      navToggle?.classList.remove("open");
      header?.classList.remove("menu-open");
      navToggle?.setAttribute("aria-expanded", "false");
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu?.classList.remove("active");
      navToggle?.classList.remove("open");
      header?.classList.remove("menu-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });


  const currentFile = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const file = (href.split("#")[0].split("/").pop() || "index.html").toLowerCase();
    link.classList.toggle("active", file === currentFile);
  });

  const revealItems = document.querySelectorAll("[data-aos]");
  if (!window.AOS && revealItems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("aos-animate");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  }

  if (window.AOS) {
    window.AOS.init({
      duration: 760,
      easing: "ease-out-cubic",
      once: true,
      offset: 80
    });
  }

  if (window.gsap) {
    gsap.from(".hero .eyebrow, .hero h1, .hero p, .hero-actions, .hero-trust", {
      y: 28,
      opacity: 0,
      duration: 0.85,
      stagger: 0.1,
      ease: "power3.out"
    });
    gsap.from(".dashboard-shell", {
      y: 32,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: "power3.out"
    });
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.count || "0");
      const suffix = counter.dataset.suffix || "";
      const duration = 1200;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = `${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(counter);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const isOpen = item?.classList.toggle("open");
      button.setAttribute("aria-expanded", String(Boolean(isOpen)));
      const icon = button.querySelector("span");
      if (icon) icon.textContent = isOpen ? "-" : "+";
    });
  });

  const showUnavailablePopup = (email) => {
    const overlay = document.createElement("div");
    overlay.className = "custom-popup-overlay";
    const card = document.createElement("div");
    card.className = "custom-popup-card";
    const icon = document.createElement("div");
    icon.className = "custom-popup-icon";
    icon.innerHTML = `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const title = document.createElement("h3");
    title.textContent = "Service Unavailable";
    const msg = document.createElement("p");
    msg.innerHTML = `Currently this service is unavailable. Please mail to <a href="mailto:${email}">${email}</a> for further query.`;
    const btn = document.createElement("button");
    btn.className = "btn btn-primary";
    btn.textContent = "Close";
    btn.addEventListener("click", () => {
      overlay.classList.add("fade-out");
      setTimeout(() => overlay.remove(), 300);
    });
    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(msg);
    card.appendChild(btn);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
  };

  const showSuccessPopup = () => {
    const overlay = document.createElement("div");
    overlay.className = "custom-popup-overlay";
    const card = document.createElement("div");
    card.className = "custom-popup-card";
    const icon = document.createElement("div");
    icon.className = "custom-popup-icon";
    icon.innerHTML = `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const title = document.createElement("h3");
    title.textContent = "Message Sent";
    const msg = document.createElement("p");
    msg.textContent = "Thank you for your message. Our team will get back to you soon.";
    const btn = document.createElement("button");
    btn.className = "btn btn-primary";
    btn.textContent = "Close";
    btn.addEventListener("click", () => {
      overlay.classList.add("fade-out");
      setTimeout(() => overlay.remove(), 300);
    });
    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(msg);
    card.appendChild(btn);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
  };

  document.querySelectorAll("form").forEach((form) => {

  let isSubmitting = false;

  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (isSubmitting) return;

    isSubmitting = true;

    const button = form.querySelector("button[type='submit']");
    const originalText = button.innerHTML;

    button.disabled = true;
    button.innerHTML = "Sending...";

    // Original form data
    const originalData = new FormData(form);

    // Add extra information
    originalData.append("submitted_at", new Date().toLocaleString());
    originalData.append("browser", navigator.userAgent);
    originalData.append("page", window.location.href);

    // Duplicate data for both services
    const sheetData = new FormData();
    const formspreeData = new FormData();

    for (const [key, value] of originalData.entries()) {
      sheetData.append(key, value);
      formspreeData.append(key, value);
    }

    let googleSuccess = false;
    let formspreeSuccess = false;

    try {

      // Save to Google Sheets
      await fetch(
        "https://script.google.com/macros/s/AKfycbxjJzCBF1n5Fs2kjQ9P-TpADhueBhJeBZr0KfbxP15t06YDL75_hDH9u-9PJpmksosIlQ/exec",
        {
          method: "POST",
          body: sheetData,
          mode: "no-cors"
        }
      );

      googleSuccess = true;

    } catch (error) {

      console.error("Google Sheets Error:", error);

    }

    try {

      const response = await fetch(
        "https://formspree.io/f/xpqggwdd",
        {
          method: "POST",
          body: formspreeData,
          body: JSON.stringify(Object.fromEntries(formspreeData)), 
          headers: {
            Accept: "application/json"
          }
        }
      );

      formspreeSuccess = response.ok;

    } catch (error) {

      console.error(error);
      showUnavailablePopup("contact@himstack.com");

    }

    if (googleSuccess || formspreeSuccess) {

      form.reset();

      showSuccessPopup();

    } else {

      showUnavailablePopup("contact@himstack.com");

    }

    button.disabled = false;
    button.innerHTML = originalText;
    button.textContent = original;

    isSubmitting = false;

  });

});
});
