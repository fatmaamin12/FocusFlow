//Immediately Invoked Function Expression.
(() => {
  const defaultNotifications = [
    //These show if the user has no saved notifications.
    { text: "New comment on Landing Page Design", time: "2m ago" },
    { text: "Task 'Logo Exploration' marked completed", time: "1h ago" },
    { text: "Meeting added to calendar (Fri 2:00 PM)", time: "Yesterday" }
  ];
  const stored = JSON.parse(localStorage.getItem("ff_notifications") || "null");
  //If none exist → use default ones
  let notifications;
  if (!stored || stored.length === 0) {
      // No notifications stored → use defaults
    notifications = defaultNotifications.slice();  // copy
    localStorage.setItem("ff_notifications", JSON.stringify(notifications));
  } else {
    notifications = stored;
  }
  // updates UI
  function render(container) {
    const badge = container.querySelector(".notif-badge");
    const dropdown = container.querySelector(".notif-dropdown");
    const list = dropdown.querySelector(".notif-list");
    const empty = dropdown.querySelector(".notif-empty");
    const count = notifications.length;
    //If there are zero notifications → hide badge.
    if (badge) {
      badge.textContent = count;
      badge.style.display = count ? "inline-block" : "none";
    }
   //If notifications exist → generate HTML
    if (!count) {
      list.innerHTML = "";
      empty.style.display = "block";
    } else {
      empty.style.display = "none";
      list.innerHTML = notifications.map(n => `
        <div class="notif-item">
          ${n.text}
          <small>${n.time}</small>
        </div>
      `).join("");
    }
  }
  //Close all other dropdowns
  function closeAllExcept(skip) {
    document.querySelectorAll(".notif-dropdown").forEach(dd => {
      if (dd !== skip) dd.classList.add("hidden");
    });
  }
  //If you have notifications in multiple pages, all will work automatically.
  document.querySelectorAll(".notifications").forEach(container => {
    const icon = container.querySelector(".notif-icon");
    const dropdown = container.querySelector(".notif-dropdown");
    const clearBtn = container.querySelector(".clear-all");
    const markBtn = container.querySelector(".mark-read");

    render(container);

    icon?.addEventListener("click", (e) => {
      e.stopPropagation();
      const isHidden = dropdown.classList.contains("hidden");
      closeAllExcept(dropdown);
      dropdown.classList.toggle("hidden", !isHidden ? true : false);
      if (isHidden) dropdown.classList.remove("hidden");
    });

    // Clear all notifications
    clearBtn?.addEventListener("click", () => {
      notifications.length = 0;
      localStorage.setItem("ff_notifications", JSON.stringify(notifications));
      render(container);
    });
   // Mark as read

    markBtn?.addEventListener("click", () => {
      // In a fuller app you'd track unread state. Here we simply hide the badge.
      const badge = container.querySelector(".notif-badge");
      if (badge) badge.style.display = "none";
    });
  });

  // Close on outside click
  //✔ Clicking anywhere else hides the dropdown

  document.addEventListener("click", () => closeAllExcept(null));
})();


