// projects.js
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

/****************************
 * PROJECTS CALENDAR SCRIPT 
 ****************************/

const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

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

let currentDate = new Date();
let selectedDate = null;
let selectedTaskId = null;

const TAG_COLORS = {
  UI: "#ff4fa3",
  Meeting: "#3b82f6",
  Work: "#22c55e",
  Review: "#a855f7",
  Personal: "#f97316"
};

let tasks = []; // will be loaded from server

function fmtDate(y, m, d) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function loadTasksFromServer() {
  const res = await fetch("/get_tasks");
  if (!res.ok) {
    console.error("Failed to load tasks");
    tasks = [];
    return;
  }
  tasks = await res.json().catch(() => []);
}

async function saveTasksToServer() {
  const res = await fetch("/save_tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tasks)
  });
  // if (res.ok) localStorage.setItem("tasksUpdated", Date.now());
}

function buildDateMap() {
  const map = {};
  tasks.forEach(t => {
    const d = t.date || t.dueDate;
    if (!d) return;
    if (!map[d]) map[d] = [];
    map[d].push(t);
  });
  return map;
}

/********* RENDER CALENDAR *********/
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  if (monthYear) {
    monthYear.textContent = currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });
  } else {
    return;  
  }

  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay();
  startDay = startDay === 0 ? 7 : startDay; // start Monday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarDays.innerHTML = "";

  for (let i = 1; i < startDay; i++) calendarDays.innerHTML += `<div></div>`;

  const today = new Date();
  today.setHours(0,0,0,0);

  const dateMap = buildDateMap();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = fmtDate(year, month + 1, day);
    const cellDate = new Date(year, month, day);
    cellDate.setHours(0,0,0,0);

    const isToday = dateStr === todayStr();
    const isPast = cellDate < today;

    const dayTasks = dateMap[dateStr] || [];
    const tasksHTML = dayTasks.map(t => `
      <div class="cal-task"
           style="border-left:4px solid ${TAG_COLORS[t.tag] || "#444"}"
           data-id="${t.id}"
           data-date="${dateStr}"
           draggable="true">
        ${t.title}
      </div>
    `).join("");

    calendarDays.innerHTML += `
      <div class="calendar-day ${isToday ? "today" : ""} ${isPast ? "past-day" : ""}" data-date="${dateStr}">
        <span class="day-number">${day}</span>
        <div class="task-box">${tasksHTML}</div>
        <button class="add-task-btn" data-date="${dateStr}">+</button>
      </div>
    `;
  }

  // attach events & drag after DOM inserted
  setTimeout(() => {
    attachEvents();
    enableDrag();
  }, 0);
}

/********* EVENTS *********/
function attachEvents() {
  const today = new Date(todayStr());

  document.querySelectorAll(".cal-task").forEach(el => {
    const taskDate = new Date(el.dataset.date);
    taskDate.setHours(0,0,0,0);
    if (taskDate < today) {
      el.classList.add("disabled-task");
      el.draggable = false;
      return;
    }
    el.addEventListener("click", e => {
      e.stopPropagation();
      openTaskById(Number(el.dataset.id));
    });
  });

  document.querySelectorAll(".add-task-btn").forEach(btn => {
    const btnDate = new Date(btn.dataset.date);
    btnDate.setHours(0,0,0,0);
    if (btnDate < today) return;
    btn.addEventListener("click", e => {
      e.stopPropagation();
      newTask(btn.dataset.date); // Option 2: create on clicked date
    });
  });
}

/********* MODAL CONTROLS *********/
function showModal() { modal.classList.add("open"); }
function hideModal() { modal.classList.remove("open"); selectedTaskId = null; selectedDate = null; }
if(closeModalBtn){
closeModalBtn.onclick = hideModal;
window.addEventListener("click", e => { if (e.target === modal) hideModal(); });
}

/********* OPEN EXISTING TASK BY ID *********/
function openTaskById(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  selectedTaskId = id;
  selectedDate = t.date || t.dueDate;

  modalTitle.textContent = t.title;
  modalDate.textContent = selectedDate;
  modalTasks.innerHTML = `
    <p><strong>Tag:</strong> ${t.tag}</p>
    <p><strong>Description:</strong> ${t.desc || t.description || "No description"}</p>
  `;

  editTitle.value = t.title;
  editDesc.value = t.desc || t.description || "";
  editTag.value = t.tag || "Work";

  editForm.style.display = "none";
  modalActions.style.display = "flex";
  showModal();
}

/********* NEW TASK from calendar (Option 2) *********/
function newTask(date) {
  selectedDate = date;        // <-- important: use clicked date
  selectedTaskId = null;

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

/********* EDIT / SAVE (calendar modal) *********/
if(editTaskBtn){
editTaskBtn.onclick = () => {
  editForm.style.display = "block";
  modalActions.style.display = "none";
};}

if(saveTaskBtn){
saveTaskBtn.onclick = async () => {
  const title = editTitle.value.trim();
  if (!title) return alert("Title required");

  const dateToUse = selectedDate || todayStr(); // If created from calendar, selectedDate is that day

  if (!tasks) tasks = [];

  if (selectedTaskId === null) {
    // create new task (calendar): assign date = clicked date (Option 2)
    const newTask = {
      id: Date.now(),
      tag: editTag.value || "Work",
      title,
      desc: editDesc.value.trim(),
      status: "coming-next",
      priority: "medium",
      date: dateToUse,
      comments: 0,
      files: 0,
      progress: 0,
      totalSubtasks: 0,
      completedSubtasks: 0
    };
    tasks.push(newTask);
  } else {
    // update existing task (find by id)
    const idx = tasks.findIndex(t => t.id === selectedTaskId);
    if (idx !== -1) {
      tasks[idx].title = title;
      tasks[idx].desc = editDesc.value.trim();
      tasks[idx].tag = editTag.value || tasks[idx].tag;
      // update date only if selectedDate changed (we keep it)
      tasks[idx].date = dateToUse;
    }
  }

  await saveTasksToServer();
  hideModal();
  renderCalendar();
};}
if(deleteTaskBtn){
deleteTaskBtn.onclick = async () => {
  if (!confirm("Delete this task?")) return;
  if (!tasks || selectedTaskId === null) return;

  const idx = tasks.findIndex(t => t.id === selectedTaskId);
  if (idx !== -1) {
    tasks.splice(idx, 1);
    await saveTasksToServer();
    hideModal();
    renderCalendar();
  }
};}

/********* DRAG & DROP *********/
function enableDrag() {
  document.querySelectorAll(".cal-task").forEach(task => {
    // make sure draggable toggling is correct
    const taskDate = new Date(task.dataset.date);
    const today = new Date(); today.setHours(0,0,0,0);
    taskDate.setHours(0,0,0,0);

    if (taskDate < today) {
      task.draggable = false;
      task.classList.add("not-draggable");
      return;
    }

    task.draggable = true;
    task.ondragstart = e => {
      e.dataTransfer.setData("text/plain", JSON.stringify({ id: Number(task.dataset.id), from: task.dataset.date }));
    };
  });

  document.querySelectorAll(".calendar-day").forEach(day => {
    const dayDate = new Date(day.dataset.date);
    const today = new Date(); today.setHours(0,0,0,0);
    dayDate.setHours(0,0,0,0);

    if (dayDate < today) return;

    day.ondragover = e => e.preventDefault();
    day.ondrop = e => {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const toDate = day.dataset.date;
      moveTaskById(data.id, toDate);
    };
  });
}

async function moveTaskById(id, toDate) {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  tasks[idx].date = toDate;
  await saveTasksToServer();
  renderCalendar();
}

/********* NAVIGATION *********/
if(prevBtn){
prevBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};}

if(nextBtn){
nextBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};}

/********* LIVE SYNC (listen for saves elsewhere) *********/
window.addEventListener("storage", (e) => {
  if (e.key === "tasksUpdated") {
    loadTasksFromServer().then(() => renderCalendar());
  }
});

/********* INIT *********/
(async function init() {
  await loadTasksFromServer();
  renderCalendar();
})();
