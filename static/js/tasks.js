if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

/******************************
 * ✅ Focus Flow Task Manager
 ******************************/

document.addEventListener("DOMContentLoaded", () => {
  /* === DOM ELEMENTS === */
  const taskList = document.getElementById("taskList");
  const tabs = document.querySelectorAll(".task-tab");

  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskModal = document.getElementById("taskModal");
  const closeTaskModal = document.getElementById("closeTaskModal");
  const saveTaskBtn = document.getElementById("saveTaskBtn");

  const taskTitleInput = document.getElementById("taskTitleInput");
  const taskDescInput = document.getElementById("taskDescInput");
  const taskStatusInput = document.getElementById("taskStatusInput");

  /* === DEFAULT TASKS === */
  const defaultTasks = [
    {
      id: 1,
      tag: "UI Design",
      title: "Landing Page Design",
      desc: "Starting a new business feels like juggling while riding a unicycle",
      status: "coming-next",
      priority: "high",
      dueDate: "2025-01-15",
      comments: 2,
      files: 2,
      progress: 0,
      totalSubtasks: 5,
      completedSubtasks: 0
    },
    {
      id: 2,
      tag: "Frontend",
      title: "Dashboard Layout",
      desc: "Build UI for admin dashboard pages",
      status: "in-progress",
      priority: "medium",
      dueDate: "2025-01-20",
      comments: 4,
      files: 1,
      progress: 60,
      totalSubtasks: 8,
      completedSubtasks: 5
    },
    {
      id: 3,
      tag: "Testing",
      title: "Unit Tests",
      desc: "Write comprehensive unit tests for core modules",
      status: "completed",
      priority: "medium",
      dueDate: "2025-01-12",
      comments: 1,
      files: 0,
      progress: 100,
      totalSubtasks: 12,
      completedSubtasks: 12
    }
  ];

  /* === LOAD OR INITIALIZE TASKS === */
  let tasks = JSON.parse(localStorage.getItem("focusflowTasks")) || defaultTasks;

  /* === HELPER FUNCTIONS === */
  function mapStatus(filter) {
    if (filter === "ongoing") return "in-progress";
    if (filter === "coming-next") return "coming-next";
    if (filter === "completed") return "completed";
    return filter;
  }

  function saveTasks() {
    localStorage.setItem("focusflowTasks", JSON.stringify(tasks));
  }

  /* === RENDER TASKS === */
  function renderTasks(filter = "all") {
    taskList.innerHTML = "";

    const filtered =
      filter === "all" ? tasks : tasks.filter(t => t.status === mapStatus(filter));

    if (filtered.length === 0) {
      taskList.innerHTML = `<p class="empty-text">No tasks found.</p>`;
      return;
    }

    filtered.forEach(task => {
      const formattedDate = new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });

      const statusColors = {
        "coming-next": "grey",
        "in-progress": "blue",
        "completed": "green"
      };

      const priorityColors = {
        high: "red",
        medium: "yellow",
        low: "green"
      };

      const statusDisplay = task.status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase());

      taskList.innerHTML += `
        <div class="task-item">
          <div class="task-item-header">
            <span class="task-tag-small ${task.tag.toLowerCase().replace(" ", "-")}">${task.tag}</span>
            <span class="priority-badge-small ${priorityColors[task.priority]}">${task.priority}</span>
          </div>

          <div class="task-item-content">
            <h4 class="task-title">${task.title}</h4>
            <p class="task-desc">${task.desc}</p>
          </div>

          <div class="task-item-progress">
            <div class="progress-info">
              <i class="bx bx-check-double"></i>
              <span>${task.completedSubtasks}/${task.totalSubtasks} subtasks</span>
            </div>
            <div class="progress-bar-task">
              <div class="progress-fill-task" style="width:${task.progress}%"></div>
            </div>
          </div>

          <div class="task-item-footer">
            <div class="task-item-meta">
              <span class="task-date">
                <i class="bx bx-calendar"></i> ${formattedDate}
              </span>
              <span><i class="bx bx-message-rounded"></i> ${task.comments}</span>
              <span><i class="bx bx-paperclip"></i> ${task.files}</span>
            </div>
            <span class="badge ${statusColors[task.status]}">${statusDisplay}</span>
          </div>
        </div>
      `;
    });
  }

  /* === FILTER TABS === */
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelector(".task-tab.active")?.classList.remove("active");
      tab.classList.add("active");
      renderTasks(tab.dataset.filter);
    });
  });

  /* === MODAL CONTROLS === */
  addTaskBtn.addEventListener("click", () => {
    taskModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });

  closeTaskModal.addEventListener("click", closeModal);
  taskModal.addEventListener("click", e => {
    if (e.target === taskModal) closeModal();
  });

  function closeModal() {
    taskModal.classList.add("hidden");
    document.body.style.overflow = "auto";
    taskTitleInput.value = "";
    taskDescInput.value = "";
    taskStatusInput.value = "ongoing";
  }

  /* === SAVE NEW TASK === */
  saveTaskBtn.addEventListener("click", () => {
    const title = taskTitleInput.value.trim();
    if (!title) return alert("Please enter a task title");

    const desc = taskDescInput.value.trim();
    const status = taskStatusInput.value;

    const newTask = {
      id: Date.now(),
      tag: "New Task",
      title,
      desc,
      status: status === "ongoing" ? "in-progress" : status,
      priority: "medium",
      dueDate: new Date().toISOString().split("T")[0],
      comments: 0,
      files: 0,
      progress: 0,
      totalSubtasks: 0,
      completedSubtasks: 0
    };

    tasks.unshift(newTask);
    saveTasks();
    closeModal();
    renderTasks(document.querySelector(".task-tab.active")?.dataset.filter || "all");
  });

  /* === INITIALIZE === */
  renderTasks("all");
});
