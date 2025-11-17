
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}



/****************************
 * PROJECTS CALENDAR SCRIPT
 ****************************/

// DOM Elements
// The month header
// The next/previous buttons
// The box where days are rendered
const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

// modal elements for viewing/editing tasks:
const modal = document.getElementById("taskModal");
const closeModalBtn = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalTasks = document.getElementById("modalTasks");
const modalActions = document.getElementById("modalActions");
const editForm = document.getElementById("editForm");

const editTitle = document.getElementById("editTitle");
const editDesc = document.getElementById("editDesc");
const editTag = document.getElementById("editTag");

const editTaskBtn = document.getElementById("editTaskBtn");
const deleteTaskBtn = document.getElementById("deleteTaskBtn");
const saveTaskBtn = document.getElementById("saveTaskBtn");

// These remember:
// Which month you're looking at
// Which day the user clicked
// Which task they clicked from that day

let currentDate = new Date();
let selectedDate = null;
let selectedTaskIndex = null;

// Tag colors
const TAG_COLORS = {
  UI: "#ff4fa3",
  Meeting: "#3b82f6",
  Work: "#22c55e",
  Review: "#a855f7",
  Personal: "#f97316"
};

// Load tasks
let tasks = JSON.parse(localStorage.getItem("calendarTasks")) || {};
// Each date has an array of tasks
// Each date string is a key
// ✅ Seed default tasks once if storage is empty
if (!tasks || Object.keys(tasks).length === 0) { 
  tasks = {
    "2025-11-12": [
      {
        title: "Design Review",
        description: "UI polish pass and component audit",
        tag: "Review"
      }
    ],
    "2025-11-14": [
      {
        title: "Client Meeting",
        description: "Project Alpha kickoff with stakeholder Q&A",
        tag: "Meeting"
      }
    ]
  };
  localStorage.setItem("calendarTasks", JSON.stringify(tasks));
}

// Helpers
function saveTasks() { //Save tasks to localStorage
  localStorage.setItem("calendarTasks", JSON.stringify(tasks));
}
//format date 
function fmtDate(y, m, d) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
//get today as a string
function todayStr() {
  return new Date().toISOString().split("T")[0];
}

/********* RENDER CALENDAR *********/
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.textContent = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay();
  startDay = startDay === 0 ? 7 : startDay; // start week on Monday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarDays.innerHTML = "";

  // Empty spaces before month start
  for (let i = 1; i < startDay; i++) {
    calendarDays.innerHTML += `<div></div>`;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = fmtDate(year, month + 1, day);
    const cellDate = new Date(year, month, day);
    cellDate.setHours(0, 0, 0, 0);

    const isToday = dateStr === todayStr();
    const isPast = cellDate < today;

    const dayTasks = tasks[dateStr] || [];
    const tasksHTML = dayTasks
      .map(
        (t, i) => `
          <div class="cal-task"
               style="border-left:4px solid ${TAG_COLORS[t.tag] || "#444"}"
               data-date="${dateStr}"
               data-index="${i}"
               draggable="true">
            ${t.title}
          </div>
        `
      )
      .join("");

    // Determine if entire month is past or future
    const isPastMonth =
      year < today.getFullYear() ||
      (year === today.getFullYear() && month < today.getMonth());
    const isFutureMonth =
      year > today.getFullYear() ||
      (year === today.getFullYear() && month > today.getMonth());

    // ✅ Render past, current, or future days accordingly
    if (isPastMonth) {
      // Whole month in past
      calendarDays.innerHTML += `
        <div class="calendar-day past-day" data-date="${dateStr}">
          <span class="day-number">${day}</span>
          <div class="task-box">${tasksHTML}</div>
          <button class="add-task-btn" data-date="${dateStr}">+</button>
        </div>`;
    } else {
      // Current or future month
      calendarDays.innerHTML += `
        <div class="calendar-day ${isToday ? "today" : ""} ${
        isPast ? "past-day" : ""
      }" data-date="${dateStr}">
          <span class="day-number">${day}</span>
          <div class="task-box">${tasksHTML}</div>
          <button class="add-task-btn" data-date="${dateStr}">+</button>
        </div>`;
    }
  }
  setTimeout(() => {
    attachEvents();
    enableDrag();  // 🔥 THIS WAS MISSING
    }, 0);
}

/********* EVENTS *********/
function attachEvents() {
  const today = new Date(todayStr());

  // Disable old tasks
  document.querySelectorAll(".cal-task").forEach(el => {
    const taskDate = new Date(el.dataset.date);
    if (taskDate < today) {
      el.classList.add("disabled-task");
      return;
    }
    el.addEventListener("click", e => {
      e.stopPropagation();
      openTask(el.dataset.date, el.dataset.index);
    });
  });

  // Add new tasks only for non-past days
  document.querySelectorAll(".add-task-btn").forEach(btn => {
    const btnDate = new Date(btn.dataset.date);
    if (btnDate < today) return; // no event for past days
    btn.addEventListener("click", e => {
      e.stopPropagation();
      newTask(btn.dataset.date);
    });
  });
}

/********* MODAL CONTROLS *********/
function showModal() {
  modal.classList.add("open");
}

function hideModal() {
  modal.classList.remove("open");
  selectedTaskIndex = null;
}

closeModalBtn.onclick = hideModal;

window.addEventListener("click", e => {
  if (e.target === modal) hideModal();
});

/********* OPEN EXISTING TASK *********/
function openTask(date, index) {
  selectedDate = date;
  selectedTaskIndex = index;

  const t = tasks[date][index];

  modalTitle.textContent = t.title;
  modalDate.textContent = date;
  modalTasks.innerHTML = `
    <p><strong>Tag:</strong> ${t.tag}</p>
    <p><strong>Description:</strong> ${t.description || "No description"}</p>
  `;

  editTitle.value = t.title;
  editDesc.value = t.description || "";
  editTag.value = t.tag;

  editForm.style.display = "none";
  modalActions.style.display = "flex";
  showModal();
}

/********* NEW TASK *********/
function newTask(date) {
  selectedDate = date;
  selectedTaskIndex = null;

  modalTitle.textContent = "New Task";
  modalDate.textContent = date;
  modalTasks.innerHTML = `<p>Fill the form below.</p>`;

  editTitle.value = "";
  editDesc.value = "";
  editTag.value = "Work";

  editForm.style.display = "block";
  modalActions.style.display = "none";
  showModal();
}

/********* EDIT TASK *********/
editTaskBtn.onclick = () => {
  editForm.style.display = "block";
  modalActions.style.display = "none";
};

saveTaskBtn.onclick = () => {
  const title = editTitle.value.trim();
  if (!title) return alert("Title required");

  const obj = {
    title,
    description: editDesc.value.trim(),
    tag: editTag.value
  };

  if (!tasks[selectedDate]) tasks[selectedDate] = [];

  selectedTaskIndex === null
    ? tasks[selectedDate].push(obj)
    : (tasks[selectedDate][selectedTaskIndex] = obj);

  saveTasks();
  hideModal();
  renderCalendar();
};

deleteTaskBtn.onclick = () => {
  if (!confirm("Delete this task?")) return;

  tasks[selectedDate].splice(selectedTaskIndex, 1);
  if (tasks[selectedDate].length === 0) delete tasks[selectedDate];

  saveTasks();
  hideModal();
  renderCalendar();
};

/********* DRAG & DROP *********/
function enableDrag() {
  document.querySelectorAll(".cal-task").forEach(task => {
    task.ondragstart = e => {
      e.dataTransfer.setData(
        "text",
        JSON.stringify({ date: task.dataset.date, index: task.dataset.index })
      );
    };
  });

  document.querySelectorAll(".calendar-day").forEach(day => {
    day.ondragover = e => e.preventDefault();
    day.ondrop = e => {
      const data = JSON.parse(e.dataTransfer.getData("text"));
      moveTask(data.date, data.index, day.dataset.date);
    };
  });
}

function moveTask(from, index, to) {
  const moved = tasks[from].splice(index, 1)[0];
  if (!tasks[to]) tasks[to] = [];
  tasks[to].push(moved);
  if (tasks[from].length === 0) delete tasks[from];
  saveTasks();
  renderCalendar();
}

/********* NAVIGATION *********/
prevBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

nextBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

// INIT
renderCalendar();


