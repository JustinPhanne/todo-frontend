// To-Do App script.js

const API = "<YOUR_BACKEND_URL>";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

addBtn.addEventListener("click", addTask);
window.addEventListener("DOMContentLoaded", loadTasks);

// ----------------------
// LocalStorage backend
// ----------------------
function loadTasksLocal() {
  const raw = localStorage.getItem("tasks");
  const tasks = raw ? JSON.parse(raw) : [];
  render(tasks);
}
function saveTasksLocal(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function addTaskLocal() {
  const name = taskInput.value.trim();
  if (!name) return;
  const raw = localStorage.getItem("tasks");
  const tasks = raw ? JSON.parse(raw) : [];
  tasks.unshift({ id: Date.now().toString(), name, completed: false });
  saveTasksLocal(tasks);
  taskInput.value = "";
  render(tasks);
}
function toggleLocal(id, completed) {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const idx = tasks.findIndex(t => t.id === id);
  if (idx >= 0) {
    tasks[idx].completed = completed;
    saveTasksLocal(tasks);
    render(tasks);
  }
}
function removeLocal(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks = tasks.filter(t => t.id !== id);
  saveTasksLocal(tasks);
  render(tasks);
}

// ----------------------
// Remote (Express) backend
// ----------------------
async function loadTasksRemote() {
  try {
    const res = await fetch(`${API}/tasks`);
    if (!res.ok) throw new Error("Network error");
    const tasks = await res.json();
    render(tasks);
  } catch (e) {
    console.error("Remote load failed:", e);
    // fallback to local
    loadTasksLocal();
  }
}
async function addTaskRemote() {
  const name = taskInput.value.trim();
  if (!name) return;
  await fetch(`${API}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
  taskInput.value = "";
  loadTasksRemote();
}
async function toggleRemote(id, completed) {
  await fetch(`${API}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed })
  });
  loadTasksRemote();
}
async function removeRemote(id) {
  await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
  loadTasksRemote();
}

// ----------------------
// UI render + router
// ----------------------
function render(tasks) {
  taskList.innerHTML = "";
  tasks.forEach(t => {
    const li = document.createElement("li");
    const left = document.createElement("span");
    left.textContent = t.name;
    left.className = "left";
    if (t.completed) left.classList.add("completed");
    left.addEventListener("click", () => {
      const useRemote = !API.includes("YOUR_BACKEND_URL");
      if (useRemote) toggleRemote(t._id || t.id, !(t.completed));
      else toggleLocal(t.id, !t.completed);
    });

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = () => {
      const useRemote = !API.includes("YOUR_BACKEND_URL");
      if (useRemote) removeRemote(t._id || t.id);
      else removeLocal(t.id);
    };

    li.appendChild(left);
    li.appendChild(del);
    taskList.appendChild(li);
  });
}

function loadTasks() {
  const useRemote = !API.includes("YOUR_BACKEND_URL");
  if (useRemote) loadTasksRemote();
  else loadTasksLocal();
}

function addTask() {
  const useRemote = !API.includes("YOUR_BACKEND_URL");
  if (useRemote) addTaskRemote();
  else addTaskLocal();
}
