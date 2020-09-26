const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function isValidUuid(req, res, next) {
  const { id } = req.params;

  const isValid = isUuid(id);

  if (!isValid) {
    return res.status(400).json({ error: 'O ID não é válido' });
  }

  next();
}

const repositories = [];

app.use('/repositories/:id', isValidUuid);

app.get("/repositories", (req, res) => {
  res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repository = {
    title,
    url,
    techs,
    id: uuid(),
    likes: 0,
  };

  repositories.push(repository);

  res.json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { title, url, techs } = req.body;
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(r => r.id === id);
  const repository = repositories.find(r => r.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repositório não existe' });
  }

  const newRepositoryData = {
    ...repository,
    title: title ? title : repository.title,
    url: url ? url : repository.url,
    techs: techs ? techs : repository.techs,
  }

  repositories[repositoryIndex] = newRepositoryData;

  res.json(newRepositoryData);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(r => r.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repositório não existe' });
  }

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  // TODO
});

module.exports = app;
