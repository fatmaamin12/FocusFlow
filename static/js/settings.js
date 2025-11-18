/********************************
     DARK MODE TOGGLE
 ********************************/

const themeToggle = document.getElementById("themeToggle");

// Apply saved theme on load
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.checked = true;
}

// Listen for toggle switch change
themeToggle?.addEventListener("change", () => {
  const isDark = themeToggle.checked;

  if (isDark) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } 
  else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});

const deleteBtn = document.getElementById("deleteAccountBtn");
const modal = document.getElementById("deleteModal");
const cancelBtn = document.getElementById("cancelDelete");
const confirmBtn = document.getElementById("confirmDelete");

// Open modal
deleteBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

// Cancel: close modal
cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Confirm delete
confirmBtn.addEventListener("click", () => {
  fetch("/delete_account", {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.json())
  .then(data => {
    if (data.redirect) {
      window.location.href = data.redirect;
    }
  })
  .catch(err => console.error("Delete error:", err));
});



