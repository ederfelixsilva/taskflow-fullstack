import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const dbPath = path.join(process.cwd(), "src", "data", "db.json");

// GET /api/tasks
router.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  res.json(data.tasks || []);
});

// POST /api/tasks
router.post("/", (req, res) => {
  const { title, date, priority } = req.body;

  if (!title) return res.status(400).json({ error: "Título é obrigatório" });

  const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  const newTask = {
    id: Date.now(),
    title,
    date: date || null,
    priority: priority || "Média",
    done: false
  };

  data.tasks.push(newTask);
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

  res.status(201).json(newTask);
});

export default router;