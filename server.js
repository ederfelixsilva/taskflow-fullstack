import express from "express";
import path from "path";
import tasksRoutes from "./src/routes/tasks.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.use("/api/tasks", tasksRoutes);


app.use(express.static(path.join(process.cwd(), "public")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});