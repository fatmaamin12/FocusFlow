// dashboard.js
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

/*******************************
 * DASHBOARD — LOAD & RENDER TASKS
 *******************************/

async function fetchTasksFromServer() {
  const res = await fetch("/get_tasks");
  if (!res.ok) {
    console.error("Failed to fetch tasks");
    return [];
  }
  const tasks = await res.json().catch(() => []);
  return tasks;
}

function formatDateShort(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function renderTasksOnDashboard(tasks, searchTerm = "") {
  const container = document.getElementById("taskContainer");
  if (!container) return;

  let filtered = tasks;
  if (searchTerm && searchTerm.trim() !== "") {
    const q = searchTerm.toLowerCase();
    filtered = tasks.filter(t =>
      (t.title || "").toLowerCase().includes(q) ||
      (t.desc || "").toLowerCase().includes(q) ||
      (t.tag || "").toLowerCase().includes(q)
    );
  }

  if (!filtered.length) {
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding:40px; color:var(--text-light)">
      <i class="bx bx-search" style="font-size:48px; opacity:.5"></i>
      <p>No tasks found${searchTerm ? ` matching "${searchTerm}"` : ""}</p>
    </div>`;
    return;
  }

  container.innerHTML = filtered.map(task => {
    const priorityColors = { high: "red", medium: "yellow", low: "green" };
    const statusColors = { "coming-next": "grey", "in-progress": "blue", "completed": "green" };
    const formattedDate = formatDateShort(task.date || task.dueDate || "");

    return `
      <div class="task-card">
        <div class="task-header">
          <span class="task-tag pink">${task.tag || "General"}</span>
          <span class="priority-badge ${priorityColors[task.priority] || "medium"}">
            ${task.priority || "medium"}
          </span>
        </div>

        <h3 class="task-title">${task.title || ""}</h3>
        <p class="task-desc">${task.desc || ""}</p>

        <div class="task-progress">
          <i class="bx bx-check-double"></i>
          <span>${task.completedSubtasks || 0}/${task.totalSubtasks || 0}</span>
          <div class="progress-bar-mini">
            <div class="progress-fill-mini" style="width:${task.progress || 0}%"></div>
          </div>
        </div>

        <div class="task-meta-row">
          <span class="task-status-badge ${statusColors[task.status] || "grey"}">
            ${(task.status || "").replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          <span class="task-date">
            <i class="bx bx-calendar"></i> ${formattedDate}
          </span>
        </div>

        <div class="task-divider"></div>

        <div class="task-footer">
          <div class="avatars">
            ${(task.avatars || []).map(a => `<img src="https://i.pravatar.cc/30?img=${a}">`).join("")}
            ${(task.avatars && task.avatars.length > 3) ? `<span class="more">+${task.avatars.length - 3}</span>` : ''}
          </div>
          <div class="task-meta">
            <span><i class="bx bx-message-rounded"></i> ${task.comments || 0}</span>
            <span><i class="bx bx-paperclip"></i> ${task.files || 0}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function updateStatusPillsValues(tasks) {
  const comingNextCount = tasks.filter(t => t.status === "coming-next").length;
  const inProgressCount = tasks.filter(t => t.status === "in-progress").length;
  const completedCount = tasks.filter(t => t.status === "completed").length;
  const pills = document.querySelectorAll(".status-pill");
  if (pills.length >= 3) {
    pills[0].querySelector(".pill-count").textContent = comingNextCount;
    pills[1].querySelector(".pill-count").textContent = inProgressCount;
    pills[2].querySelector(".pill-count").textContent = completedCount;
  }
}

async function initDashboard() {
  let tasks = await fetchTasksFromServer();

  // Render
  renderTasksOnDashboard(tasks);

  // Search hookup
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => renderTasksOnDashboard(tasks, e.target.value));
  }

  // Update pills and handlers
  updateStatusPillsValues(tasks);
  document.querySelectorAll(".status-pill").forEach((pill, index) => {
    pill.style.cursor = "pointer";
    pill.addEventListener("click", () => {
      let filter = "all";
      if (index === 0) filter = "coming-next";
      else if (index === 1) filter = "in-progress";
      else if (index === 2) filter = "completed";
      window.location.href = `/tasks?filter=${filter}`;
    });
  });

  // Live-sync when tasks change on other pages
  window.addEventListener("storage", (e) => {
    if (e.key === "tasksUpdated") {
      fetchTasksFromServer().then(newTasks => {
        tasks = newTasks;
        renderTasksOnDashboard(tasks);
        updateStatusPillsValues(tasks);
      });
    }
  });
}

initDashboard();
