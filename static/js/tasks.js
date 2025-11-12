/******************************
 * ✅ Task List Page Script
 ******************************/

// Shared task data (should match dashboard data)
const tasks = [
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
    completedSubtasks: 0,
    avatars: [1, 2, 3]
  },
  {
    id: 2,
    tag: "Brand Identity",
    title: "Logo Exploration",
    desc: "Brainstorm logo ideas and finalize top 3 concepts",
    status: "in-progress",
    priority: "medium",
    dueDate: "2025-01-20",
    comments: 4,
    files: 1,
    progress: 60,
    totalSubtasks: 8,
    completedSubtasks: 5,
    avatars: [4, 5, 6]
  },
  {
    id: 3,
    tag: "Frontend",
    title: "Dashboard Layout",
    desc: "Build UI for admin dashboard pages",
    status: "in-progress",
    priority: "high",
    dueDate: "2025-01-18",
    comments: 3,
    files: 2,
    progress: 40,
    totalSubtasks: 10,
    completedSubtasks: 4,
    avatars: [7, 8, 9]
  },
  {
    id: 4,
    tag: "Backend",
    title: "API Integration",
    desc: "Integrate REST API endpoints for user authentication",
    status: "in-progress",
    priority: "high",
    dueDate: "2025-01-17",
    comments: 5,
    files: 3,
    progress: 75,
    totalSubtasks: 6,
    completedSubtasks: 4,
    avatars: [10, 11]
  },
  {
    id: 5,
    tag: "Testing",
    title: "Unit Tests",
    desc: "Write comprehensive unit tests for core modules",
    status: "coming-next",
    priority: "medium",
    dueDate: "2025-01-22",
    comments: 1,
    files: 0,
    progress: 0,
    totalSubtasks: 12,
    completedSubtasks: 0,
    avatars: [12, 13, 14]
  },
  {
    id: 6,
    tag: "Documentation",
    title: "User Guide",
    desc: "Create comprehensive user documentation",
    status: "completed",
    priority: "low",
    dueDate: "2025-01-10",
    comments: 2,
    files: 5,
    progress: 100,
    totalSubtasks: 4,
    completedSubtasks: 4,
    avatars: [15, 16]
  },
  {
    id: 7,
    tag: "Design",
    title: "Mobile Responsive",
    desc: "Ensure all pages are mobile responsive",
    status: "completed",
    priority: "high",
    dueDate: "2025-01-12",
    comments: 3,
    files: 2,
    progress: 100,
    totalSubtasks: 7,
    completedSubtasks: 7,
    avatars: [17, 18, 19]
  },
  {
    id: 8,
    tag: "Frontend",
    title: "Component Library",
    desc: "Build reusable component library",
    status: "in-progress",
    priority: "medium",
    dueDate: "2025-01-25",
    comments: 6,
    files: 4,
    progress: 50,
    totalSubtasks: 9,
    completedSubtasks: 4,
    avatars: [20, 21]
  },
  {
    id: 9,
    tag: "UI Design",
    title: "Icon Set Design",
    desc: "Design custom icon set for the application",
    status: "coming-next",
    priority: "low",
    dueDate: "2025-01-28",
    comments: 0,
    files: 1,
    progress: 0,
    totalSubtasks: 15,
    completedSubtasks: 0,
    avatars: [22]
  },
  {
    id: 10,
    tag: "Backend",
    title: "Database Migration",
    desc: "Migrate database schema to new version",
    status: "completed",
    priority: "high",
    dueDate: "2025-01-08",
    comments: 4,
    files: 2,
    progress: 100,
    totalSubtasks: 5,
    completedSubtasks: 5,
    avatars: [23, 24, 25]
  }
];

const taskList = document.getElementById("taskList");
const tabs = document.querySelectorAll(".task-tab");

/* ---------- Get URL Parameter ---------- */
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

/* ---------- Map Status for Filtering ---------- */
function mapStatusForFilter(filter) {
  // Map old filter names to new status values
  if (filter === "ongoing") return "in-progress";
  if (filter === "coming-next") return "coming-next";
  if (filter === "completed") return "completed";
  return filter;
}

/* ---------- Render Tasks ---------- */
function renderTasks(filter = "all") {
  if (!taskList) return;
  
  taskList.innerHTML = "";

  // Map filter to status
  const statusFilter = mapStatusForFilter(filter);
  
  const filtered = tasks.filter(task => {
    if (filter === "all") return true;
    return task.status === statusFilter;
  });

  if (filtered.length === 0) {
    taskList.innerHTML = `<p class="empty-text">No tasks found.</p>`;
    return;
  }

  filtered.forEach((task) => {
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
    
    const formattedDate = new Date(task.dueDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });

    const statusDisplay = task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

    taskList.innerHTML += `
      <div class="task-item">
        <div class="task-item-header">
          <span class="task-tag-small ${task.tag.toLowerCase().replace(' ', '-')}">${task.tag}</span>
          <span class="priority-badge-small ${priorityColors[task.priority]}">
            ${task.priority}
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
          <span class="badge ${statusColors[task.status]}">
            ${statusDisplay}
          </span>
        </div>
      </div>
    `;
  });
}

/* ---------- Set Active Tab Based on Filter ---------- */
function setActiveTab(filter) {
  tabs.forEach(tab => {
    tab.classList.remove("active");
    const tabFilter = tab.dataset.filter;
    
    // Map filter to tab data-filter
    if (filter === "coming-next" && tabFilter === "coming-next") {
      tab.classList.add("active");
    } else if (filter === "in-progress" && tabFilter === "ongoing") {
      tab.classList.add("active");
    } else if (filter === "completed" && tabFilter === "completed") {
      tab.classList.add("active");
    } else if (filter === "all" && tabFilter === "all") {
      tab.classList.add("active");
    }
  });
}

/* ---------- Tabs (All / Ongoing / Completed) ---------- */
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelector(".task-tab.active").classList.remove("active");
    tab.classList.add("active");
    const filter = tab.dataset.filter;
    renderTasks(filter);
    // Update URL without reload
    const newUrl = filter === "all" ? "/tasks" : `/tasks?filter=${filter}`;
    window.history.pushState({ filter }, "", newUrl);
  });
});

/* ---------- Handle URL Parameter on Load ---------- */
function initializeFromUrl() {
  const urlFilter = getUrlParameter("filter");
  
  if (urlFilter) {
    // Map URL filter to our filter system
    let filter = "all";
    if (urlFilter === "coming-next") {
      filter = "coming-next";
      setActiveTab("coming-next");
    } else if (urlFilter === "in-progress") {
      filter = "in-progress";
      setActiveTab("in-progress");
    } else if (urlFilter === "completed") {
      filter = "completed";
      setActiveTab("completed");
    } else {
      setActiveTab("all");
    }
    
    renderTasks(filter);
  } else {
    renderTasks("all");
  }
}

/* ---------- Initial Load ---------- */
initializeFromUrl();
