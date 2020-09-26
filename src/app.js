const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

// teste de chave ssh

function isValidUuid(req, res, next) {
  const { id } = req.params;

  const isValid = isUuid(id);

  if (!isValid) {
    return res.status(400).json({ error: 'O ID não é válido' });
  }

  req.repositoryId = id;

  next();
}

function repositoryExists(req, res, next) {
  const { repositoryId } = req;

  const repositoryIndex = repositories.findIndex(r => r.id === repositoryId);

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repositório não existe' });
  }

  req.repositoryIndex = repositoryIndex;

  next();
}

const repositories = [];

app.use('/repositories/:id', isValidUuid, repositoryExists);

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
  const { repositoryIndex, repositoryId } = req;
  const { title, url, techs } = req.body;

  const repository = repositories.find(r => r.id === repositoryId);

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
  const { repositoryIndex } = req;

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { repositoryIndex, repositoryId } = req;

  const repository = repositories.find(r => r.id === repositoryId);

  const repoWithLikes = {
    ...repository,
    likes: repository.likes + 1,
  }

  repositories[repositoryIndex] = repoWithLikes;

  res.json(repoWithLikes);
});

module.exports = app;
