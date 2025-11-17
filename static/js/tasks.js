/*************************************************
 * FOCUS FLOW — TASK MANAGER (FULL FIXED VERSION)
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

  let tasks = [];  //Tasks from the JSON file will be stored here after loading.

  /***************************
   * URL FILTER (from dashboard)
   ***************************/

  //This makes your dashboard → tasks connection work.
  const params = new URLSearchParams(window.location.search);
  let initialFilter = params.get("filter") || "all";


  /***************************
   * LOAD TASKS FROM JSON
   ***************************/

  //load tasks from server converts it to js
  async function loadTasks() {
    const res = await fetch("/get_tasks");
    if (!res.ok) {
      console.error("Failed to load tasks JSON");
      return;
    }

    tasks = await res.json().catch(err => {
      console.error("JSON parse error:", err);
      tasks = [];
    });
  }


  /***************************
   * SAVE TASKS TO SERVER JSON
   ***************************/
  function saveTasksToServer() {
    fetch("/save_tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tasks)
    });
  }


  /***************************
   * STATUS MAPPER
   ***************************/
  function mapStatus(filter) {
    if (filter === "in-progress") return "in-progress";
    if (filter === "coming-next") return "coming-next";
    if (filter === "completed") return "completed";
    return filter;
  }


  /***************************
   * RENDER TASKS
   ***************************/
  function renderTasks(filter = "all") {
    // Clear old tasks
    taskList.innerHTML = "";

    // Auto-progress logic
    tasks = tasks.map(t => {
      //Auto-update progress bar
      if (t.status === "completed") t.progress = 100;
      else if (t.status === "in-progress") t.progress = 50;
      else if (t.status === "coming-next") t.progress = 0;
      return t;
    });
    //Filtering
    const filtered =
      filter === "all" ? tasks : tasks.filter(t => t.status === mapStatus(filter));
5
    if (filtered.length === 0) {
      taskList.innerHTML = `<p class="empty-text">No tasks found.</p>`;
      return;
    }

    filtered.forEach(task => {
      const formattedDate = new Date(task.date || task.dueDate).toLocaleDateString("en-US", {
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

      const statusDisplay = task.status.replace("-", " ")
        .replace(/\b\w/g, l => l.toUpperCase());
        
        //Create the HTML for each task

      taskList.innerHTML += `.
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


  /***************************
   * DELETE TASK (with confirm)
   ***************************/
  taskList.addEventListener("click", (e) => {
    if (e.target.classList.contains("task-delete-btn")) {

      const confirmDelete = confirm("Are you sure you want to delete this task?");
      if (!confirmDelete) return;

      const id = Number(e.target.dataset.id);
      tasks = tasks.filter(t => t.id !== id);

      saveTasksToServer();
      renderTasks(document.querySelector(".task-tab.active")?.dataset.filter || "all");
    }
  });


  /***************************
   * EDIT TASK
   ***************************/
  taskList.addEventListener("click", (e) => {
    if (e.target.classList.contains("task-edit-btn")) {

      const id = Number(e.target.dataset.id);
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      taskTitleInput.value = task.title;
      taskDescInput.value = task.desc;
      taskStatusInput.value = task.status;

      taskModal.classList.remove("hidden");
      document.body.style.overflow = "hidden";

      saveTaskBtn.onclick = () => {

        task.title = taskTitleInput.value.trim();
        task.desc = taskDescInput.value.trim();
        task.status = taskStatusInput.value;

        // auto progress
        if (task.status === "completed") task.progress = 100;
        else if (task.status === "in-progress") task.progress = 50;
        else task.progress = 0;

        saveTasksToServer();
        closeModal();
        renderTasks(document.querySelector(".task-tab.active")?.dataset.filter || "all");
      };
    }
  });


  /***************************
   * ADD NEW TASK
   ***************************/
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
      status,
      priority: "medium",
      date: new Date().toISOString().split("T")[0],
      comments: 0,
      files: 0,
      progress: 0,
      totalSubtasks: 0,
      completedSubtasks: 0
    };

    tasks.unshift(newTask);
    saveTasksToServer();
    closeModal();
    renderTasks(document.querySelector(".task-tab.active")?.dataset.filter || "all");
  });


  /***************************
   * FILTER TABS
   ***************************/
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelector(".task-tab.active")?.classList.remove("active");
      tab.classList.add("active");
      renderTasks(tab.dataset.filter);
    });
  });


  /***************************
   * MODAL CONTROL
   ***************************/
  function closeModal() {
    taskModal.classList.add("hidden");
    taskTitleInput.value = "";
    taskDescInput.value = "";
    taskStatusInput.value = "in-progress";
    document.body.style.overflow = "auto";
    saveTaskBtn.onclick = null; // IMPORTANT
  }

  addTaskBtn.addEventListener("click", () => {
    taskModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });

  closeTaskModal.addEventListener("click", closeModal);


  /***************************
   * INITIAL LOAD + FILTER
   ***************************/
  loadTasks().then(() => {
    renderTasks(initialFilter);

    // highlight correct tab
    document.querySelector(".task-tab.active")?.classList.remove("active");
    const tab = document.querySelector(`.task-tab[data-filter="${initialFilter}"]`);
    if (tab) tab.classList.add("active");
  });

}); // END DOMContentLoaded
