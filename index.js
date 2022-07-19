const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res, next) => {
  try {
    const talkers = JSON.parse(await fs.readFile('talker.json'));
    return res.status(200).json(talkers);
  } catch (e) {
    next(e);
  }
});

app.get('/talker/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const talkers = JSON.parse(await fs.readFile('talker.json'));
    const talkerById = talkers.find((r) => r.id === Number(id));

    if (!talkerById) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

    return res.status(200).json(talkerById);
  } catch (err) {
    next(err);
  }
});

app.use((err, _req, res, _next) => {
  res.status(500).json({ message: err.message });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
