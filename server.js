import express from "express";
import path from "path";
import tasksRoutes from "./src/routes/tasks.routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// API
app.use("/api/tasks", tasksRoutes);

// Front (estático)
app.use(express.static(path.join(process.cwd(), "public")));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});