const express = require('express');
const server = express();

server.use(express.json());

const projects = [];

// Middleware global para contar o número de requisições
function requestsNumber(req, res, next) {
  console.count('Número de requisições');

  return next();
};

// Middleware para verificar se existe projeto com o ID passado
function checkProjectExistsById(req, res, next) {

  const { id } = req.params;
  const exists = projects.find(p => p.id === id);

  if (!exists) {
    return res.status(400).json({ error: "Não existe projeto com esse ID." })
  }

  return next();
}

server.use(requestsNumber);


// Buscando todos os projetos
server.get('/projects', (req, res) => {

  return res.json(projects);
})

// Inserindo um projeto
server.post('/projects', (req, res) => {

  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json('Projeto cadastrado com sucesso!');
})


// Alterando o título do projeto a partir de seu ID
server.put('/projects/:id', checkProjectExistsById, (req, res) => {

  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id)

  project.title = title;

  return res.json('Título alterado com sucesso.');
})

// Excluindo um projeto a partir do ID
server.delete('/projects/:id', checkProjectExistsById, (req, res) => {

  const { id } = req.params;

  const index = projects.findIndex(p => p.id == id);

  projects.splice(index, 1);

  return res.send();
});

// Adicionando tarefas ao projeto a partir do ID do projeto
server.post('/projects/:id/tasks', checkProjectExistsById, (req, res) => {

  const { id } = req.params;

  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.json("Tarefa adicionada ao projeto")
})


server.listen(3000)