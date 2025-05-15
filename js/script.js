// ======================
// Utility: Throttle
// ----------------------
// Used to limit the execution frequency of a function (e.g., scroll, resize).
// fn   : function to be throttled
// wait : minimum interval between calls (ms)
function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// ======================
// Library Init: AOS (Animate On Scroll)
// ----------------------
// Initializes AOS library to animate elements on scroll.
// Automatically applies effects defined via data-aos attributes.
// Docs: https://michalsnik.github.io/aos/
AOS.init({
  once: true, // Whether animation should happen only once
  easing: "ease-in-out", // Easing function for the animation
  offset: 50, // Offset (in px) from the original trigger point
  mirror: false, // Whether elements should animate out while scrolling past them
});

// ======================
// Mobile Menu (Navbar)
// ----------------------
// HTML: <button id="navToggle">…</button> & <div id="mobileMenu">…</div> (below <header>)
// 1) Toggle hamburger menu
// 2) Smooth-scroll & auto-close on link click
const navToggle = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");

if (navToggle && mobileMenu) {
  // Toggle menu open/close
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("hamburger-active");
    if (mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.remove("hidden");
      // fade-in
      setTimeout(
        () => mobileMenu.classList.remove("opacity-0", "-translate-y-4"),
        10
      );
    } else {
      // fade-out then hide
      mobileMenu.classList.add("opacity-0", "-translate-y-4");
      setTimeout(() => mobileMenu.classList.add("hidden"), 300);
    }
  });

  // Smooth scroll & auto-close
  document.querySelectorAll("#mobileMenu a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetEl = document.querySelector(this.getAttribute("href"));
      if (targetEl) {
        window.scrollTo({ top: targetEl.offsetTop, behavior: "smooth" });
        // close menu
        mobileMenu.classList.add("opacity-0", "-translate-y-4");
        setTimeout(() => mobileMenu.classList.add("hidden"), 300);
        navToggle.classList.remove("hamburger-active");
      }
    });
  });
}

// ======================
// Scroll Down Arrow (Hero)
// ----------------------
// HTML: <div class="scroll-down">…</div> inside #home
const scrollDownBtn = document.querySelector(".scroll-down");
if (scrollDownBtn) {
  scrollDownBtn.addEventListener("click", () => {
    const aboutEl = document.getElementById("about");
    if (!aboutEl) return;
    window.scrollTo({
      top: aboutEl.offsetTop - (window.innerHeight - aboutEl.clientHeight),
      behavior: "smooth",
    });
  });
}

// ======================
// Custom Cursor (Desktop)
// ----------------------
// HTML: <div id="customCursor"></div> placed directly under <body>
if (window.matchMedia("(pointer: fine)").matches) {
  const customCursor = document.getElementById("customCursor");
  if (customCursor) {
    // Basic styling
    Object.assign(customCursor.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "9px",
      height: "9px",
      backgroundColor: "rgba(255,255,255,1)",
      borderRadius: "50%",
      pointerEvents: "none",
      transform: "translate(-50%, -50%)",
      zIndex: "9999",
      mixBlendMode: "difference",
      transition:
        "width 0.2s ease, height 0.2s ease, background-color 0.2s ease, opacity 0.2s ease",
    });

    let [tx, ty, cx, cy] = [0, 0, 0, 0];
    let lastTime = performance.now();
    const smoothing = 12;

    function animate(now) {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      const f = 1 - Math.exp(-smoothing * dt);
      cx += (tx - cx) * f;
      cy += (ty - cy) * f;
      customCursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    document.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
      const buf = 5;
      customCursor.style.opacity =
        e.clientX < buf ||
        e.clientY < buf ||
        window.innerWidth - e.clientX < buf ||
        window.innerHeight - e.clientY < buf
          ? "0"
          : "1";
    });

    // Hover effect on clickable elements
    ["button", "a", "input[type='button']", "input[type='submit']"].forEach(
      (sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          el.addEventListener("mouseenter", () => {
            Object.assign(customCursor.style, {
              width: "30px",
              height: "30px",
              backgroundColor: "rgba(255,255,255,0.8)",
            });
          });
          el.addEventListener("mouseleave", () => {
            Object.assign(customCursor.style, {
              width: "9px",
              height: "9px",
              backgroundColor: "rgba(255,255,255,1)",
            });
          });
        });
      }
    );
  }
}

// ======================
// Navbar Blur on Scroll
// ----------------------
// HTML: <header id="navbar">…</header>
const navbar = document.getElementById("navbar");
if (navbar) {
  window.addEventListener(
    "scroll",
    throttle(() => {
      if (window.scrollY > 50) {
        navbar.classList.add(
          "backdrop-blur-md",
          "bg-white/10",
          "border-white/20",
          "rounded-xl",
          "mt-4",
          "h-16"
        );
        navbar.classList.remove(
          "bg-transparent",
          "border-transparent",
          "h-20",
          "mt-0"
        );
      } else {
        navbar.classList.remove(
          "backdrop-blur-md",
          "bg-white/10",
          "border-white/20",
          "rounded-xl",
          "mt-4",
          "h-16"
        );
        navbar.classList.add(
          "bg-transparent",
          "border-transparent",
          "h-20",
          "mt-0"
        );
      }
    }, 50),
    { passive: true }
  );
}

// ======================
// Page Loader (GSAP)
// ----------------------
// HTML: <div id="loader">…<div id="diamond"><div class="square">…
// Uses window.load to wait for all assets
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const squares = document.querySelectorAll("#diamond .square");
  if (!loader || squares.length === 0) return;

  gsap.set(squares, { scale: 0 });
  const tl = gsap.timeline({
    onComplete: () => {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.5,
        ease: "power1.out",
        onComplete: () => {
          loader.style.display = "none";
          document.body.classList.remove("overflow-hidden");
        },
      });
    },
  });
  tl.to(squares, {
    scale: 1,
    duration: 0.5,
    stagger: 0.1,
    ease: "back.out(1.7)",
  });
  tl.to({}, { duration: 0.5 });
});

// ======================
// Typewriter Effect
// ----------------------
// HTML: <div id="typewriter"></div> inside <header>
const messages = ["Hello", "Welcome", "I'm Syalom"];
const typeEl = document.getElementById("typewriter");
let msgIdx = 0,
  charIdx = 0,
  deleting = false;
const icons = [
  '<i class="fas fa-globe text-[#4a6fa5] mr-2"></i>',
  '<i class="fas fa-angle-right text-[#4a6fa5] mr-2"></i>',
];

function typewriter() {
  if (!typeEl) return;
  const txt = messages[msgIdx].substring(0, charIdx);
  typeEl.innerHTML = icons[0] + icons[1] + txt + "<span class='cursor'></span>";
  if (!deleting && charIdx < messages[msgIdx].length) {
    charIdx++;
    setTimeout(typewriter, 100);
  } else if (!deleting) {
    deleting = true;
    setTimeout(typewriter, 1500);
  } else if (deleting && charIdx > 0) {
    charIdx--;
    setTimeout(typewriter, 50);
  } else {
    deleting = false;
    msgIdx = (msgIdx + 1) % messages.length;
    setTimeout(typewriter, 500);
  }
}
document.addEventListener("DOMContentLoaded", typewriter);

// ======================
// Smooth Scroll Library
// ----------------------
// Initialize Lenis for global smooth scroll
const lenis = new Lenis();
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ======================
// Animate Text (GSAP)
// ----------------------
// HTML: elements with class .animated-text
function animateText(el) {
  const letters = el.innerText.split("");
  el.innerHTML = "";
  letters.forEach((l) => {
    const span = document.createElement("span");
    span.innerText = l;
    el.appendChild(span);
  });
  gsap.fromTo(
    el.querySelectorAll("span"),
    { opacity: 0, y: 10 },
    {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
      stagger: 0.05,
      delay: 2,
    }
  );
}
window.addEventListener("load", () => {
  document.querySelectorAll(".animated-text").forEach(animateText);
});

// ======================
// Scroll-to-Top Button
// ----------------------
// HTML: <button id="scrollTopBtn">…</button> placed at the top of <body>
const scrollTopBtn = document.getElementById("scrollTopBtn");
if (scrollTopBtn) {
  // Show/hide on scroll
  window.addEventListener(
    "scroll",
    throttle(() => {
      if (window.scrollY > 200) {
        scrollTopBtn.classList.add("show");
      } else {
        scrollTopBtn.classList.remove("show");
      }
    }, 50),
    { passive: true }
  );

  // Smooth scroll to top on click
  scrollTopBtn.addEventListener("click", () => {
    const duration = 1500;
    const start = window.scrollY;
    const startTime = performance.now();
    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    function scrollStep(ts) {
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, start * (1 - eased));
      if (progress < 1) requestAnimationFrame(scrollStep);
    }
    requestAnimationFrame(scrollStep);
  });
}
