const authMiddleware = (req, res, next) => {
  const { password, email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }

  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  
  if (email.includes('@' && '.com') === false) { 
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' }); 
  }

  next();
};

module.exports = authMiddleware;
