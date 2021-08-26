const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./middlewares/error-handler');
const routes = require('./routes');
const { CURRENT_PORT, MONGO_URL } = require('./utils/config');

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(routes);

app.use(errors());
app.use(errorHandler);

app.listen(CURRENT_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${CURRENT_PORT}`);
});
