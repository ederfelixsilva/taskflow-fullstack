// =====================
// TASKFLOW v1.2 - script.js (robusto)
// =====================

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
const loadingEl = document.getElementById("loading");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toastTitle");
const toastMsg = document.getElementById("toastMsg");
const toastClose = document.getElementById("toastClose");

// ===== API =====
const API_URL = "/api/tasks";

// ===== ESTADO =====
let tasks = [];
let currentFilter = "all";

// ===== TOAST =====
let toastTimer = null;

function showToast(type = "info", title = "Aviso", message = "", ms = 2800) {
  if (!toast || !toastTitle || !toastMsg) return;

  toast.classList.remove("success", "error", "info");
  toast.classList.add(type);

  toastTitle.textContent = title;
  toastMsg.textContent = message;

  toast.classList.remove("hidden");
  requestAnimationFrame(() => toast.classList.add("show"));

  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, ms);
}

function hideToast() {
  if (!toast) return;
  toast.classList.remove("show");
  setTimeout(() => toast.classList.add("hidden"), 250);
}

toastClose?.addEventListener("click", hideToast);

// ===== LOADING =====
function setLoading(isLoading) {
  if (!loadingEl) return;
  loadingEl.classList.toggle("hidden", !isLoading);
}

function setButtonLoading(btn, isLoading, textIdle) {
  if (!btn) return;
  btn.disabled = isLoading;
  btn.textContent = isLoading ? "..." : textIdle;
  btn.style.opacity = isLoading ? "0.75" : "1";
}

// ===== API HELPERS (com mensagens reais) =====
async function apiGetTasks() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Falha ao carregar tasks");
  }
  return res.json();
}

async function apiCreateTask(task) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  if (!res.ok) {
    let msg = "Falha ao criar tarefa";
    try {
      const err = await res.json();
      if (err?.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

async function apiUpdateTask(id, patch) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });

  if (!res.ok) {
    let msg = "Falha ao atualizar tarefa";
    try {
      const err = await res.json();
      if (err?.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

async function apiDeleteTask(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

  if (res.status === 204) return;

  if (!res.ok) {
    let msg = "Falha ao excluir tarefa";
    try {
      const err = await res.json();
      if (err?.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }
}

// ===== RENDER =====
function renderTasks() {
  if (!taskList) return;
  taskList.innerHTML = "";

  // filtro
  let filtered = tasks.filter(task => {
    if (currentFilter === "pending") return !task.done;
    if (currentFilter === "done") return task.done;
    return true;
  });

  // busca
  const q = (searchInput?.value || "").trim().toLowerCase();
  if (q) filtered = filtered.filter(t => String(t.title).toLowerCase().includes(q));

  // lista
  filtered.forEach(task => {
    const li = document.createElement("li");

    const info = document.createElement("div");
    info.className = "task-info";
    info.innerHTML = `
      <strong class="${task.done ? "done" : ""}">${task.title}</strong>
      <small>${task.date ? task.date : "Sem data definida"}</small>
    `;

    const right = document.createElement("div");

    const priority = document.createElement("span");
    const p = task.priority || "Media";
    priority.className = `priority ${p}`;
    priority.textContent = p;

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = task.done ? "↩" : "✔";
    toggleBtn.title = task.done ? "Marcar como pendente" : "Concluir tarefa";
    toggleBtn.onclick = async () => {
      try {
        toggleBtn.disabled = true;
        const updated = await apiUpdateTask(task.id, { done: !task.done });
        tasks = tasks.map(t => (t.id === task.id ? updated : t));
        renderTasks();
        showToast("success", "Atualizado", updated.done ? "Tarefa concluída!" : "Tarefa voltou para pendente.");
      } catch (e) {
        showToast("error", "Erro", e.message || "Não consegui atualizar a tarefa.");
      } finally {
        toggleBtn.disabled = false;
      }
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.title = "Excluir tarefa";
    deleteBtn.onclick = async () => {
      const ok = confirm("Deseja excluir esta tarefa?");
      if (!ok) return;

      try {
        deleteBtn.disabled = true;
        await apiDeleteTask(task.id);
        tasks = tasks.filter(t => t.id !== task.id);
        renderTasks();
        showToast("info", "Removida", "Tarefa excluída com sucesso.");
      } catch (e) {
        showToast("error", "Erro", e.message || "Não consegui excluir a tarefa.");
      } finally {
        deleteBtn.disabled = false;
      }
    };

    right.append(priority, toggleBtn, deleteBtn);
    li.append(info, right);
    taskList.appendChild(li);
  });

  // dashboard
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pending = total - done;

  if (totalCount) totalCount.textContent = total;
  if (doneCount) doneCount.textContent = done;
  if (pendingCount) pendingCount.textContent = pending;
  if (totalTasks) totalTasks.textContent = `${total} tarefas`;

  // progresso
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  if (progressText) progressText.textContent = `${percent}%`;
  if (progressFill) progressFill.style.width = `${percent}%`;
}

// ===== CARREGAR =====
async function refresh() {
  try {
    setLoading(true);
    tasks = await apiGetTasks();
    tasks.sort((a, b) => (b.id || 0) - (a.id || 0));
    renderTasks();
  } catch (e) {
    console.error(e);
    showToast("error", "Falha ao carregar", e.message || "Não consegui carregar as tarefas.");
  } finally {
    setLoading(false);
  }
}

// ===== ADICIONAR =====
async function handleAddTask() {
  const title = (titleInput?.value || "").trim();
  if (!title) {
    showToast("error", "Campo vazio", "Digite um título para a tarefa.");
    titleInput?.focus();
    return;
  }

  try {
    setButtonLoading(addTaskBtn, true, "Adicionar Tarefa");

    const created = await apiCreateTask({
      title,
      date: dateInput?.value || null,
      priority: prioritySelect?.value || "Media",
    });

    tasks.unshift(created);
    renderTasks();

    if (titleInput) titleInput.value = "";
    if (dateInput) dateInput.value = "";
    if (prioritySelect) prioritySelect.value = "Media";
    titleInput?.focus();

    showToast("success", "Tarefa criada", "Sua tarefa foi salva com sucesso!");
  } catch (e) {
    console.error(e);
    showToast("error", "Erro", e.message || "Não consegui criar a tarefa.");
  } finally {
    setButtonLoading(addTaskBtn, false, "Adicionar Tarefa");
  }
}

addTaskBtn?.addEventListener("click", handleAddTask);

// Enter no input também adiciona
titleInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleAddTask();
});

// ===== FILTROS =====
filterButtons?.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filters .active")?.classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter || "all";
    renderTasks();
  });
});

// ===== BUSCA =====
searchInput?.addEventListener("input", renderTasks);

// ===== DARK/LIGHT =====
themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  themeToggle.textContent = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
});

// ===== INICIAR =====
refresh();