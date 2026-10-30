// Task Manager – Supabase REST API (plain fetch, no libraries)

let API_URL = "";   // e.g. https://PROJECT_ID.supabase.co/rest/v1/tasks
let API_KEY = "";   // public publishable key
let editingId = null;

const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const descInput = document.getElementById("task-description");
const submitBtn = document.getElementById("task-submit");
const cancelBtn = document.getElementById("task-cancel");
const taskList = document.getElementById("task-list");
const statusMsg = document.getElementById("status-message");

function showStatus(text, isError = false) {
  statusMsg.textContent = text;
  statusMsg.className = isError ? "error" : "success";
}

// Generic request helper for the Supabase REST API
async function api(method, query = "", body = null) {
  const options = {
    method,
    headers: {
      "apikey": API_KEY,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    }
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(API_URL + query, options);
  if (!response.ok) {
    let detail = response.statusText;
    try {
      const err = await response.json();
      detail = err.message || detail;
    } catch (e) { /* no JSON body */ }
    throw new Error(`${method} failed (${response.status}): ${detail}`);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// ---------- CRUD ----------

async function loadTasks() {
  try {
    const tasks = await api("GET", "?select=*&order=id.asc");
    renderTasks(tasks);
  } catch (err) {
    showStatus("Could not load tasks. " + err.message, true);
  }
}

async function addTask(title, description) {
  await api("POST", "", { title, description, completed: false });
  showStatus("Task added.");
}

async function updateTask(id, fields) {
  await api("PATCH", `?id=eq.${id}`, fields);
}

async function deleteTask(id) {
  await api("DELETE", `?id=eq.${id}`);
  showStatus("Task deleted.");
}

// ---------- Rendering ----------

function renderTasks(tasks) {
  taskList.innerHTML = "";
  if (tasks.length === 0) {
    taskList.innerHTML = '<p class="empty">No tasks yet. Add one above.</p>';
    return;
  }
  for (const task of tasks) {
    const item = document.createElement("div");
    item.className = "task-item" + (task.completed ? " done" : "");
    item.dataset.id = task.id;

    const title = document.createElement("h3");
    title.className = "task-title";
    title.textContent = task.title;

    const desc = document.createElement("p");
    desc.className = "task-description";
    desc.textContent = task.description || "";

    const status = document.createElement("span");
    status.className = "task-status";
    status.textContent = task.completed ? "Completed" : "Not completed";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "toggle-task";
    toggleBtn.textContent = task.completed ? "Mark incomplete" : "Mark complete";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-task";
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-task";
    deleteBtn.textContent = "Delete";

    const actions = document.createElement("div");
    actions.className = "actions";
    actions.append(toggleBtn, editBtn, deleteBtn);

    item.append(title, desc, status, actions);
    taskList.appendChild(item);

    toggleBtn.addEventListener("click", async () => {
      try {
        await updateTask(task.id, { completed: !task.completed });
        showStatus("Task status updated.");
        await loadTasks();
      } catch (err) {
        showStatus(err.message, true);
      }
    });

    editBtn.addEventListener("click", () => startEdit(task));

    deleteBtn.addEventListener("click", async () => {
      try {
        await deleteTask(task.id);
        if (editingId === task.id) resetForm();
        await loadTasks();
      } catch (err) {
        showStatus(err.message, true);
      }
    });
  }
}

// ---------- Form (create + edit) ----------

function startEdit(task) {
  editingId = task.id;
  titleInput.value = task.title;
  descInput.value = task.description || "";
  submitBtn.textContent = "Save Changes";
  cancelBtn.hidden = false;
  titleInput.focus();
}

function resetForm() {
  editingId = null;
  form.reset();
  submitBtn.textContent = "Add Task";
  cancelBtn.hidden = true;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  if (!title) {
    showStatus("Title is required.", true);
    return;
  }
  try {
    if (editingId !== null) {
      await updateTask(editingId, { title, description });
      showStatus("Task updated.");
    } else {
      await addTask(title, description);
    }
    resetForm();
    await loadTasks();
  } catch (err) {
    showStatus(err.message, true);
  }
});

cancelBtn.addEventListener("click", resetForm);

// ---------- Start ----------

async function init() {
  try {
    const res = await fetch("config.json");
    if (!res.ok) throw new Error("config.json not found");
    const config = await res.json();
    API_URL = `${config.supabaseUrl.replace(/\/$/, "")}/rest/v1/${config.tableName}`;
    API_KEY = config.supabasePublishableKey;
    await loadTasks();
  } catch (err) {
    showStatus("Configuration error: " + err.message, true);
  }
}

init();
