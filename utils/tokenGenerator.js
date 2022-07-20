const { randomBytes } = require('crypto');

const numberOfBytes = 8;

const tokenGenerator = () => randomBytes(numberOfBytes).toString('hex');

module.exports = tokenGenerator;
