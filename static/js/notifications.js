(() => {
  const defaultNotifications = [
    { text: "New comment on Landing Page Design", time: "2m ago" },
    { text: "Task 'Logo Exploration' marked completed", time: "1h ago" },
    { text: "Meeting added to calendar (Fri 2:00 PM)", time: "Yesterday" }
  ];
  const stored = JSON.parse(localStorage.getItem("ff_notifications") || "null");
  const notifications = Array.isArray(stored) ? stored : defaultNotifications;

  function render(container) {
    const badge = container.querySelector(".notif-badge");
    const dropdown = container.querySelector(".notif-dropdown");
    const list = dropdown.querySelector(".notif-list");
    const empty = dropdown.querySelector(".notif-empty");
    const count = notifications.length;
    if (badge) {
      badge.textContent = count;
      badge.style.display = count ? "inline-block" : "none";
    }
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

  function closeAllExcept(skip) {
    document.querySelectorAll(".notif-dropdown").forEach(dd => {
      if (dd !== skip) dd.classList.add("hidden");
    });
  }

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

    clearBtn?.addEventListener("click", () => {
      notifications.length = 0;
      localStorage.setItem("ff_notifications", JSON.stringify(notifications));
      render(container);
    });

    markBtn?.addEventListener("click", () => {
      // In a fuller app you'd track unread state. Here we simply hide the badge.
      const badge = container.querySelector(".notif-badge");
      if (badge) badge.style.display = "none";
    });
  });

  // Close on outside click
  document.addEventListener("click", () => closeAllExcept(null));
})();


