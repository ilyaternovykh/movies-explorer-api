require('dotenv').config();

const {
  JWT_SECRET, NODE_ENV, PORT, MONGO_URL = 'mongodb://localhost:27017/moviesdb',
} = process.env;

const INTERNAL_SERVER_ERROR = 500;
const CURRENT_PORT = NODE_ENV === 'production' && PORT ? PORT : 3000;
const CURRENT_JWT_SECRET = NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : 'develop-secret';

module.exports = {
  CURRENT_PORT,
  MONGO_URL,
  INTERNAL_SERVER_ERROR,
  CURRENT_JWT_SECRET,
};
