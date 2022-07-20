const hasValidToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }

  if (authorization.length < 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  next();
};

const hasValidName = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }

  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  next();
};

const hasValidAge = (req, res, next) => {
  const { age } = req.body;
  const minimumAge = 18;

  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });

  if (age < minimumAge) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }

  next();
};

const rateValidation = (req, res, next) => {
  const { talk: { rate } } = req.body;

  if (!rate) return res.status(400).json({ message: 'O campo "rate" é obrigatório' });

  if (rate < 1 || rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }

  next();
};

const watchedAtValidation = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;

  const date = new RegExp(/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/);

  if (!watchedAt) return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });

  if (!date.test(watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  next();
};

const talkValidation = (req, res, next) => {
  const { talk } = req.body;

  if (!talk) return res.status(400).json({ message: 'O campo "talk" é obrigatório' });

  next();
};

module.exports = {
  hasValidToken,
  hasValidName, 
  hasValidAge, 
  rateValidation, 
  watchedAtValidation,
  talkValidation,
 };
