// Theme is now controlled from Settings page only.
// Apply saved theme for dashboard load:
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

/********************************
 * ✅ DASHBOARD — TASK DATA
 ********************************/
const tasks = [
  {
    id: 1,
    tag: "UI Design",
    title: "Landing Page Design",
    desc: "Starting a new business feels like juggling while riding a unicycle",
    status: "coming-next", // coming-next, in-progress, completed
    priority: "high", // high, medium, low
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


/********************************
 * 📝 RENDER TASK CARDS
 ********************************/
function renderTasks(searchTerm = "") {
  const container = document.getElementById("taskContainer");
  if (!container) return;

  // Filter tasks based on search term
  let filteredTasks = tasks;
  if (searchTerm.trim() !== "") {
    const searchLower = searchTerm.toLowerCase();
    filteredTasks = tasks.filter(task => {
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.desc.toLowerCase().includes(searchLower) ||
        task.tag.toLowerCase().includes(searchLower) ||
        task.status.toLowerCase().includes(searchLower) ||
        task.priority.toLowerCase().includes(searchLower)
      );
    });
  }

  if (filteredTasks.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-light);">
        <i class="bx bx-search" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
        <p style="font-size: 16px;">No tasks found matching "${searchTerm}"</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredTasks.map(task => {
    const priorityColors = {
      high: "red",
      medium: "yellow",
      low: "green"
    };
    const statusColors = {
      "coming-next": "grey",
      "in-progress": "blue",
      "completed": "green"
    };
    const priorityIcons = {
      high: "bx-error-circle",
      medium: "bx-time",
      low: "bx-check-circle"
    };
    
    const formattedDate = new Date(task.dueDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });

    return `
    <div class="task-card">
      <div class="task-header">
        <span class="task-tag pink">${task.tag}</span>
        <span class="priority-badge ${priorityColors[task.priority]}">
          <i class="bx ${priorityIcons[task.priority]}"></i>
          ${task.priority}
        </span>
      </div>

      <h3 class="task-title">${task.title}</h3>
      <p class="task-desc">${task.desc}</p>

      <div class="task-progress">
        <i class="bx bx-check-double"></i>
        <span>${task.completedSubtasks}/${task.totalSubtasks}</span>
        <div class="progress-bar-mini">
          <div class="progress-fill-mini" style="width:${task.progress}%"></div>
        </div>
      </div>

      <div class="task-meta-row">
        <span class="task-status-badge ${statusColors[task.status]}">
          ${task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
        <span class="task-date">
          <i class="bx bx-calendar"></i> ${formattedDate}
        </span>
      </div>

      <div class="task-divider"></div>

      <div class="task-footer">
        <div class="avatars">
          ${task.avatars.map(a => `<img src="https://i.pravatar.cc/30?img=${a}">`).join("")}
          ${task.avatars.length > 3 ? `<span class="more">+${task.avatars.length - 3}</span>` : ''}
        </div>

        <div class="task-meta">
          <span><i class="bx bx-message-rounded"></i> ${task.comments}</span>
          <span><i class="bx bx-paperclip"></i> ${task.files}</span>
        </div>
      </div>
    </div>
  `;
  }).join("");
}


/********************************
 * 📁 PROJECT CARDS
 ********************************/
const projects = [
  { title: "Landing Page Redesign", status: "In Progress", progress: 45, avatars: [1, 2, 3] },
  { title: "Brand Identity Kit", status: "Completed", progress: 100, avatars: [4, 5, 6] },
  { title: "Mobile App UI", status: "In Progress", progress: 70, avatars: [7, 8, 9] }
];

function renderProjects() {
  const container = document.getElementById("projectsContainer");
  if (!container) return;

  container.innerHTML = projects.map(p => `
    <div class="project-card">
      <h3 class="project-title">${p.title}</h3>

      <span class="project-status ${p.status === "Completed" ? "status-complete" : "status-progress"}">
        ${p.status}
      </span>

      <div class="progress-bar">
        <div class="progress-fill" style="width:${p.progress}%"></div>
      </div>

      <div class="project-footer">
        <div class="avatars">
          ${p.avatars.map(a => `<img src="https://i.pravatar.cc/30?img=${a}">`).join("")}
        </div>
        <span>${p.progress}%</span>
      </div>
    </div>
  `).join("");
}


/********************************
 * 📊 UPDATE STATUS PILLS
 ********************************/
function updateStatusPills() {
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

/********************************
 * 🔗 STATUS PILL CLICK HANDLERS
 ********************************/
function setupStatusPillClickHandlers() {
  const pills = document.querySelectorAll(".status-pill");
  
  pills.forEach((pill, index) => {
    pill.style.cursor = "pointer";
    pill.addEventListener("click", () => {
      let filter = "all";
      
      // Map pill index to filter
      if (index === 0) filter = "coming-next"; // Coming Next
      else if (index === 1) filter = "in-progress"; // In Progress
      else if (index === 2) filter = "completed"; // Completed
      
      // Redirect to tasks page with filter
      window.location.href = `/tasks?filter=${filter}`;
    });
  });
}

/********************************
 * 🔍 SEARCH FUNCTIONALITY
 ********************************/
function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  // Real-time search as user types
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value;
    renderTasks(searchTerm);
  });

  // Clear search on Escape key
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = "";
      renderTasks("");
    }
  });
}

/********************************
 * 🚀 INIT
 ********************************/
renderTasks();
renderProjects();
updateStatusPills();
setupStatusPillClickHandlers();
setupSearch();
