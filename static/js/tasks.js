/*************************************************
 * FOCUS FLOW — TASK MANAGER (SYNCED VERSION)
 *************************************************/
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

document.addEventListener("DOMContentLoaded", () => {

  /***************************
   * DOM ELEMENTS
   ***************************/
  const taskList = document.getElementById("taskList");
  const tabs = document.querySelectorAll(".task-tab");

  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskModal = document.getElementById("taskModal");
  const closeTaskModal = document.getElementById("closeTaskModal");
  const saveTaskBtn = document.getElementById("saveTaskBtn");

  const taskTitleInput = document.getElementById("taskTitleInput");
  const taskDescInput = document.getElementById("taskDescInput");
  const taskStatusInput = document.getElementById("taskStatusInput");
  const taskTotalSubtasks = document.getElementById("taskTotalSubtasks");
  const taskCompletedSubtasks = document.getElementById("taskCompletedSubtasks");

  let tasks = [];
  let editingTaskId = null;

  const params = new URLSearchParams(window.location.search);
  let initialFilter = params.get("filter") || "all";

  /**********************
   * HELPERS
   **********************/
  async function loadTasks() {
    const res = await fetch("/get_tasks");
    if (!res.ok) return (tasks = []);
    tasks = await res.json().catch(() => []);
  }

  async function saveTasksToServer() {
    const res = await fetch("/save_tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tasks),
    });
    if (res.ok) {
      localStorage.setItem("tasksUpdated", Date.now());
    }
  }

  function mapStatus(filter) {
    if (filter === "in-progress") return "in-progress";
    if (filter === "coming-next") return "coming-next";
    if (filter === "completed") return "completed";
    return filter;
  }

  function formatDateVerbose(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function renderTasks(filter = "all") {
    if (!taskList) return;

    taskList.innerHTML = "";

    tasks = tasks.map(t => {
      if (t.status === "completed") t.progress = 100;
      else if (t.status === "in-progress") t.progress = 50;
      else t.progress = 0;
      return t;
    });

    const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === mapStatus(filter));

    if (filtered.length === 0) {
      taskList.innerHTML = `<p class="empty-text">No tasks found.</p>`;
      return;
    }

    filtered.forEach(task => {
      const formattedDate = formatDateVerbose(task.date || task.dueDate || "");

      const statusColors = { "coming-next": "grey", "in-progress": "blue", "completed": "green" };
      const priorityColors = { high: "red", medium: "yellow", low: "green" };
      const statusDisplay = (task.status || "").replace("-", " ").replace(/\b\w/g, l => l.toUpperCase());

      taskList.innerHTML += `
        <div class="task-item">
          <div class="task-item-header">
            <span class="task-tag-small">${task.tag || "General"}</span>
            <span class="priority-badge-small ${priorityColors[task.priority] || "yellow"}">
              ${task.priority || "medium"}
            </span>
          </div>

          <div class="task-item-content">
            <h4 class="task-title">${task.title}</h4>
            <p class="task-desc">${task.desc}</p>
          </div>

          <div class="task-item-progress">
            <div class="progress-info">
              <i class="bx bx-check-double"></i>
              <span>${task.completedSubtasks || 0}/${task.totalSubtasks || 0} subtasks</span>
            </div>
            <div class="progress-bar-task">
              <div class="progress-fill-task" style="width:${task.progress || 0}%"></div>
            </div>
          </div>

          <div class="task-item-footer">
            <div class="task-item-meta">
              <span class="task-date">
                <i class="bx bx-calendar"></i> ${formattedDate}
              </span>
              <span><i class="bx bx-message-rounded"></i> ${task.comments || 0}</span>
              <span><i class="bx bx-paperclip"></i> ${task.files || 0}</span>
            </div>

            <div class="task-actions">
              <button class="task-edit-btn" data-id="${task.id}">Edit</button>
              <button class="task-delete-btn" data-id="${task.id}">Delete</button>
            </div>

            <span class="badge ${statusColors[task.status]}">${statusDisplay}</span>
          </div>
        </div>
      `;
    });
  }

  /***********************
   * DELETE TASK
   ***********************/
  if (taskList) {
    taskList.addEventListener("click", (e) => {
      if (!e.target.classList.contains("task-delete-btn")) return;

      if (!confirm("Are you sure you want to delete this task?")) return;

      const id = Number(e.target.dataset.id);
      tasks = tasks.filter(t => t.id !== id);

      saveTasksToServer();
      renderTasks(document.querySelector(".task-tab.active")?.dataset.filter || "all");
    });
  }

  /***********************
   * EDIT TASK
   ***********************/
  if (taskList) {
    taskList.addEventListener("click", (e) => {
      if (!e.target.classList.contains("task-edit-btn")) return;

      const id = Number(e.target.dataset.id);
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      editingTaskId = id;

      taskTitleInput.value = task.title || "";
      taskDescInput.value = task.desc || "";
      taskStatusInput.value = task.status || "in-progress";
      taskTotalSubtasks.value = task.totalSubtasks || 0;
      taskCompletedSubtasks.value = task.completedSubtasks || 0;
      taskModal?.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    });
  }

  /***********************
   * SAVE (ADD + EDIT)
   ***********************/
  if (saveTaskBtn) {
    saveTaskBtn.addEventListener("click", async () => {
      const title = taskTitleInput.value.trim();
      if (!title) return alert("Please enter a task title");

      const desc = taskDescInput.value.trim();
      const status = taskStatusInput.value;

      // Edit mode
      if (editingTaskId !== null) {
        const index = tasks.findIndex(t => t.id === editingTaskId);
        if (index !== -1) {
          tasks[index].title = title;
          tasks[index].desc = desc;
          tasks[index].status = status;
          tasks[index].progress =
            status === "completed" ? 100 :
            status === "in-progress" ? 50 : 0;
          tasks[index].totalSubtasks = Number(taskTotalSubtasks.value) || 0;
          tasks[index].completedSubtasks = Number(taskCompletedSubtasks.value) || 0;

        }

        await saveTasksToServer();
        closeModal();
        renderTasks(document.querySelector(".task-tab.active")?.dataset.filter || "all");
        editingTaskId = null;
        return;
      }

      // Create new task → today's date
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const todayStr = `${yyyy}-${mm}-${dd}`;

      const newTask = {
        id: Date.now(),
        tag: "New Task",
        title,
        desc,
        status,
        priority: "medium",
        date: todayStr,
        comments: 0,
        files: 0,
        progress:
        Number(taskTotalSubtasks.value) > 0
        ? Math.floor((Number(taskCompletedSubtasks.value) / Number(taskTotalSubtasks.value)) * 100): 0,
        totalSubtasks: Number(taskTotalSubtasks.value) || 0,
        completedSubtasks: Number(taskCompletedSubtasks.value) || 0
      };

      tasks.unshift(newTask);
      await saveTasksToServer();
      closeModal();
      renderTasks(document.querySelector(".task-tab.active")?.dataset.filter || "all");
    });
  }

  /***********************
   * TABS
   ***********************/
  if (tabs.length > 0) {
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelector(".task-tab.active")?.classList.remove("active");
        tab.classList.add("active");
        renderTasks(tab.dataset.filter);
      });
    });
  }

  /***********************
   * MODAL
   ***********************/
  function closeModal() {
    taskModal?.classList.add("hidden");
    taskTitleInput.value = "";
    taskDescInput.value = "";
    taskStatusInput.value = "in-progress";
    document.body.style.overflow = "auto";
    editingTaskId = null;
  }

  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", () => {
      editingTaskId = null;
      taskModal?.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    });
  }

  if (closeTaskModal) {
    closeTaskModal.addEventListener("click", closeModal);
  }

  /***********************
   * LIVE SYNC
   ***********************/
  window.addEventListener("storage", (e) => {
    if (e.key === "tasksUpdated") {
      loadTasks().then(() => renderTasks(initialFilter));
    }
  });

  /***********************
   * INITIAL LOAD
   ***********************/
  loadTasks().then(() => {
    renderTasks(initialFilter);
    document.querySelector(".task-tab.active")?.classList.remove("active");
    const tab = document.querySelector(`.task-tab[data-filter="${initialFilter}"]`);
    tab?.classList.add("active");
  });

});
