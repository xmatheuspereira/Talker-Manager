const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const authMiddleware = require('./middlewares/auth-middleware');
const getToken = require('./utils/tokenGenerator');
const {
  hasValidToken,
  hasValidName,
  hasValidAge,
  rateValidation,
  watchedAtValidation,
  talkValidation,
} = require('./middlewares/talkers-middeware');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const TALKER_FILE = 'talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res, next) => {
  try {
    const talkers = JSON.parse(await fs.readFile(TALKER_FILE));
    return res.status(200).json(talkers);
  } catch (e) {
    next(e);
  }
});

app.get('/talker/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const talkers = JSON.parse(await fs.readFile(TALKER_FILE));
    const talkerById = talkers.find((talker) => talker.id === Number(id));

    if (!talkerById) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

    return res.status(200).json(talkerById);
  } catch (e) {
    next(e);
  }
});

app.post('/login', authMiddleware, async (req, res, next) => {
  try {
    const { password } = req.body;

    if (password.length < 6) {
      return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
    }

    const token = getToken();

    return res.status(200).json({ token });
  } catch (e) {
    next(e);
  }
});

app.post('/talker',
  hasValidName,
  hasValidToken,
  hasValidAge,
  talkValidation,
  rateValidation,
  watchedAtValidation,
  async (req, res, next) => {
  try {
    const { name, age, talk: { watchedAt, rate } } = req.body;

    const talkers = JSON.parse(await fs.readFile(TALKER_FILE));

    const registerTalker = { name, age, id: talkers.length + 1, talk: { watchedAt, rate } };

    talkers.push(registerTalker);

    fs.writeFile(TALKER_FILE, JSON.stringify(talkers));

    return res.status(201).json(registerTalker);
  } catch (e) {
    next(e);
  }
});

app.put('/talker/:id',
  hasValidName,
  hasValidToken,
  hasValidAge,
  talkValidation,
  rateValidation,
  watchedAtValidation,
  async (req, res, next) => {
  try {
    const { name, age, talk } = req.body;
    const { id } = req.params;
    
    const talkerList = JSON.parse(await fs.readFile(TALKER_FILE));

    const talkerIndex = talkerList.findIndex((t) => t.id === Number(id));

    talkerList[talkerIndex] = { id: Number(id), name, age, talk };

    fs.writeFile(TALKER_FILE, JSON.stringify(talkerList));

    return res.status(200).json(talkerList[talkerIndex]);
  } catch (e) {
    next(e);
  }
});

app.delete('/talker/:id', hasValidToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const talkerList = JSON.parse(await fs.readFile(TALKER_FILE));
  
    const talkerIndex = talkerList.findIndex((t) => t.id === Number(id));
  
    talkerList.splice(talkerIndex, 1);

    fs.writeFile(TALKER_FILE, JSON.stringify(talkerList));
  
    res.status(204).json(talkerIndex);
  } catch (e) {
    next(e);
  }
});

app.use((err, _req, res, _next) => {
  res.status(500).json({ message: err.message });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
