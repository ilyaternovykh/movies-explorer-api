require('dotenv').config();

const { NODE_ENV, PORT } = process.env;

const CURRENT_PORT = NODE_ENV === 'production' && PORT ? PORT : 3000;

module.exports = {
  CURRENT_PORT,
};
