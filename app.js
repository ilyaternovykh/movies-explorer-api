const express = require('express');
const mongoose = require('mongoose');
const { CURRENT_PORT } = require('./utils/config');

const app = express();

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(CURRENT_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${CURRENT_PORT}`);
});
