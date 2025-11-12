// Apply saved theme across all pages on load
(function() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  } catch (e) {
    // no-op if localStorage unavailable
  }
})();


