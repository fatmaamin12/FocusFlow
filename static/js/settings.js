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

// Cancel
cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Confirm
confirmBtn.addEventListener("click", () => {
  window.location.href = "/signup";  // Redirect to sign up
});


