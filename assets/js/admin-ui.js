/* ==========================================================================
   ADMIN PANEL UI CONTROLLER (admin-ui.js)
   Handles UI state, theme toggle, mobile drawers, modals & toasts
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initSidebar();
  initModals();
});

// --- Theme Management ---
function initTheme() {
  const savedTheme = localStorage.getItem("admin_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("admin_theme", next);
      showToast(`Switched to ${next} mode`);
    });
  }
}

// --- Mobile Sidebar Toggle ---
function initSidebar() {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.querySelector(".admin-sidebar");

  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove("open");
      }
    });
  }
}

// --- Generic Modal Handler ---
function initModals() {
  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal-overlay");
      if (modal) modal.classList.remove("open");
    });
  });

  window.openModal = function (modalId) {
    const target = document.getElementById(modalId);
    if (target) target.classList.add("open");
  };

  window.closeModal = function (modalId) {
    const target = document.getElementById(modalId);
    if (target) target.classList.remove("open");
  };
}

// --- UI Toast Notification Helper ---
window.showToast = function (message, type = "info") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};
