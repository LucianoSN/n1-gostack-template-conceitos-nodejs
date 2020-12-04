const express = require('express');
const cors = require('cors');

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const findByIndex = repositories.findIndex(
    (repository) => repository.id === id,
  );

  if (findByIndex === -1)
    return response.status(400).json({ error: 'Repository does not exist.' });

  const likes = repositories[findByIndex].likes;

  const data = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[findByIndex] = data;

  return response.json(data);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const findByIndex = repositories.findIndex(
    (repository) => repository.id === id,
  );

  if (findByIndex === -1) {
    return response
      .status(400)
      .json({ error: `Repository with id ${id} does not exist.` });
  }

  repositories.splice(findByIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const findByIndex = repositories.findIndex(
    (repository) => repository.id === id,
  );

  if (findByIndex === -1) {
    return response
      .status(400)
      .json({ error: `Repository with id ${id} does not exist.` });
  }

  repositories[findByIndex].likes++;

  return response.json(repositories[findByIndex]);
});

module.exports = app;
