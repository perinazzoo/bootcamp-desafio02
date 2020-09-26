const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  // TODO
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
  // TODO
});

app.delete("/repositories/:id", (req, res) => {
  // TODO
});

app.post("/repositories/:id/like", (req, res) => {
  // TODO
});

module.exports = app;
