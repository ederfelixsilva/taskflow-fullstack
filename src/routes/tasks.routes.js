import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const dbPath = path.join(process.cwd(), "src", "data", "db.json");

// ===== FUNÇÕES AUXILIARES =====
function readDb() {
  try {
    const raw = fs.readFileSync(dbPath, "utf-8").trim();
    return raw ? JSON.parse(raw) : { tasks: [] };
  } catch (err) {
    return { tasks: [] };
  }
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// ===== GET - LISTAR TODAS =====
router.get("/", (req, res) => {
  const data = readDb();
  res.json(data.tasks || []);
});

// ===== POST - CRIAR =====
router.post("/", (req, res) => {
  const { title, date, priority } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Título é obrigatório" });
  }

  const data = readDb();

  const newTask = {
    id: Date.now(),
    title: String(title).trim(),
    date: date || null,
    priority: priority || "Media",
    done: false,
    createdAt: new Date().toISOString()
  };

  data.tasks.push(newTask);
  writeDb(data);

  res.status(201).json(newTask);
});

// ===== PATCH - ATUALIZAR =====
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const updates = req.body;

  const data = readDb();

  const index = data.tasks.findIndex(task => task.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Tarefa não encontrada" });
  }

  data.tasks[index] = {
    ...data.tasks[index],
    ...updates
  };

  writeDb(data);

  res.json(data.tasks[index]);
});

// ===== DELETE - REMOVER =====
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  const data = readDb();

  const initialLength = data.tasks.length;
  data.tasks = data.tasks.filter(task => task.id !== id);

  if (data.tasks.length === initialLength) {
    return res.status(404).json({ error: "Tarefa não encontrada" });
  }

  writeDb(data);

  res.status(204).end();
});

export default router;