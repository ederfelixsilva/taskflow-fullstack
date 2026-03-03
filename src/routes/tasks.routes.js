import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const dbPath = path.resolve("src/data/db.json");

function ensureDbFile() {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ tasks: [] }, null, 2));
    return;
  }

  const raw = fs.readFileSync(dbPath, "utf-8").trim();
  if (!raw) fs.writeFileSync(dbPath, JSON.stringify({ tasks: [] }, null, 2));
}

function readDb() {
  ensureDbFile();
  const raw = fs.readFileSync(dbPath, "utf-8").trim();
  try {
    const parsed = raw ? JSON.parse(raw) : { tasks: [] };
    if (Array.isArray(parsed)) return { tasks: parsed };
    return { tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [] };
  } catch {
    return { tasks: [] };
  }
}

function writeDb(data) {
  ensureDbFile();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

router.get("/", (req, res) => {
  const data = readDb();
  res.json(data.tasks);
});

router.post("/", (req, res) => {
  const { title, date, priority } = req.body;

  if (!title || !String(title).trim()) {
    return res.status(400).json({ error: "Título é obrigatório" });
  }

  const data = readDb();
  const newTask = {
    id: Date.now(),
    title: String(title).trim(),
    date: date || null,
    priority: priority || "Media",
    done: false,
    createdAt: new Date().toISOString(),
  };

  data.tasks.push(newTask);
  writeDb(data);
  res.status(201).json(newTask);
});

router.patch("/:id", (req, res) => {
  const idParam = req.params.id;
  const data = readDb();

  const idx = data.tasks.findIndex(t => String(t.id) === String(idParam));
  if (idx === -1) return res.status(404).json({ error: "Tarefa não encontrada" });

  data.tasks[idx] = { ...data.tasks[idx], ...req.body };
  writeDb(data);

  res.json(data.tasks[idx]);
});

router.delete("/:id", (req, res) => {
  const idParam = req.params.id;
  const data = readDb();

  const before = data.tasks.length;
  data.tasks = data.tasks.filter(t => String(t.id) !== String(idParam));
  if (data.tasks.length === before) return res.status(404).json({ error: "Tarefa não encontrada" });

  writeDb(data);
  res.status(204).end();
});

export default router;