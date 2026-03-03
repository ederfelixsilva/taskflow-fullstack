# 🚀 TaskFlow v1.2

🔗 **Demo Online:**  
https://taskflow-fullstack-petf.onrender.com

Sistema Full Stack de gerenciamento de tarefas desenvolvido com Node.js, Express e integração com API REST.

---

## 📌 Sobre o Projeto

O TaskFlow é um sistema de produtividade que permite criar, atualizar, filtrar e excluir tarefas.

Este projeto foi desenvolvido com o objetivo de demonstrar habilidades em desenvolvimento Full Stack, incluindo:

- Construção de API REST
- Operações CRUD
- Persistência de dados no backend
- Integração entre frontend e backend
- Organização de projeto em camadas

---

## 🛠 Tecnologias Utilizadas

### 🎨 Frontend
- HTML5
- CSS3 (UI moderna + Dark/Light Mode)
- JavaScript (Fetch API)

### ⚙ Backend
- Node.js
- Express
- API REST
- Persistência com arquivo JSON

---


## ✨ Funcionalidades

- ✅ Criar tarefas
- ✅ Concluir / Desmarcar tarefas
- ✅ Excluir tarefas
- ✅ Filtros (Todas / Pendentes / Concluídas)
- ✅ Busca por título
- ✅ Dashboard com estatísticas
- ✅ Barra de progresso (% concluído)
- ✅ Toast feedback (UX)
- ✅ Dark / Light Mode
- ✅ Deploy em produção (Render)

---

## 🔗 Endpoints da API

| Método | Rota               | Descrição                  |
|--------|-------------------|----------------------------|
| GET    | /api/tasks        | Lista todas as tarefas     |
| POST   | /api/tasks        | Cria uma nova tarefa       |
| PATCH  | /api/tasks/:id    | Atualiza uma tarefa        |
| DELETE | /api/tasks/:id    | Remove uma tarefa          |

---

📁 Estrutura do Projeto

backend/
│
├── public/                # Frontend (HTML, CSS, JS)
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── src/
│   ├── routes/
│   │   └── tasks.routes.js
│   └── data/
│       └── db.json
│
├── server.js
└── package.json

---

🧠 Aprendizados

Durante o desenvolvimento deste projeto foram aplicados conceitos como:

Estruturação de API REST
Manipulação de arquivos no backend
Tratamento de erros com HTTP Status
Integração assíncrona com Fetch API
Debug utilizando Network e Console
Deploy e resolução de erros em produção

## ⚙ Como rodar localmente

```bash
npm install
node server.js


Abra no navegador:
http://localhost:3000


---

📈 Histórico de Versões

v1.0 – Versão com LocalStorage
v1.1 – Integração Full Stack com API REST
v1.2 – Melhorias de UX (Toast + Progress Bar + Loading)
---

## 👨‍💻 Desenvolvedor

Éder Félix Silva  
Estudante de Análise e Desenvolvimento de Sistemas  
Futuro Desenvolvedor Full Stack

