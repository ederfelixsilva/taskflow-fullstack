// ===== ELEMENTOS =====
const titleInput = document.getElementById("title");
const dateInput = document.getElementById("date");
const prioritySelect = document.getElementById("priority");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const searchInput = document.getElementById("search");
const filterButtons = document.querySelectorAll(".filters button");

const totalCount = document.getElementById("totalCount");
const doneCount = document.getElementById("doneCount");
const pendingCount = document.getElementById("pendingCount");

const themeToggle = document.getElementById("themeToggle");

// ===== API =====
const API_URL = "/api/tasks";

// ===== ESTADO =====
let tasks = [];
let currentFilter = "all";

// ===== API HELPERS =====
async function apiGetTasks() {
  const res = await fetch(API_URL);
  return res.json();
}

async function apiCreateTask(task) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Falha ao criar task");
  return res.json();
}

async function apiUpdateTask(id, patch) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Falha ao atualizar task");
  return res.json();
}

async function apiDeleteTask(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error("Falha ao deletar task");
}

// ===== RENDER =====
function renderTasks() {
  taskList.innerHTML = "";

  // FILTRO
  let filtered = tasks.filter(task => {
    if (currentFilter === "pending") return !task.done;
    if (currentFilter === "done") return task.done;
    return true;
  });

  // BUSCA
  filtered = filtered.filter(task =>
    task.title.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  // LISTA
  filtered.forEach(task => {
    const li = document.createElement("li");

    const info = document.createElement("div");
    info.className = "task-info";
    info.innerHTML = `
      <strong class="${task.done ? "done" : ""}">${task.title}</strong>
      <small>${task.date || "Sem data definida"}</small>
    `;

    const right = document.createElement("div");

    const priority = document.createElement("span");
    priority.className = `priority ${task.priority}`;
    priority.textContent = task.priority; // Baixa / Media / Alta

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "✔";
    toggleBtn.onclick = async () => {
      try {
        const updated = await apiUpdateTask(task.id, { done: !task.done });
        // atualiza no estado local
        tasks = tasks.map(t => (t.id === task.id ? updated : t));
        renderTasks();
      } catch (e) {
        alert("Erro ao atualizar tarefa.");
      }
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.onclick = async () => {
      try {
        await apiDeleteTask(task.id);
        tasks = tasks.filter(t => t.id !== task.id);
        renderTasks();
      } catch (e) {
        alert("Erro ao deletar tarefa.");
      }
    };

    right.append(priority, toggleBtn, deleteBtn);
    li.append(info, right);
    taskList.appendChild(li);
  });

  // DASHBOARD
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pending = total - done;

  totalCount.textContent = total;
  doneCount.textContent = done;
  pendingCount.textContent = pending;

  totalTasks.textContent = `${tasks.length} tarefas`;
}

// ===== CARREGAR DO BACKEND =====
async function refresh() {
  try {
    tasks = await apiGetTasks();
    // opcional: mostrar mais recentes primeiro
    tasks.sort((a, b) => b.id - a.id);
    renderTasks();
  } catch (e) {
    console.error(e);
    alert("Não consegui carregar as tarefas. Confira se o backend está rodando.");
  }
}

// ===== ADICIONAR =====
addTaskBtn.onclick = async () => {
  const title = titleInput.value.trim();
  if (!title) return;

  try {
    const created = await apiCreateTask({
      title,
      date: dateInput.value || null,
      priority: prioritySelect.value || "Media",
    });

    tasks.unshift(created);
    renderTasks();

    titleInput.value = "";
    dateInput.value = "";
  } catch (e) {
    alert("Erro ao criar tarefa.");
  }
};

// ===== FILTROS =====
filterButtons.forEach(btn => {
  btn.onclick = () => {
    document.querySelector(".filters .active").classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  };
});

// ===== BUSCA =====
searchInput.addEventListener("input", renderTasks);

// ===== DARK / LIGHT MODE =====
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  themeToggle.textContent = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
});

// ===== INICIALIZA =====
refresh();