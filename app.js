const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
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

app.use(requestLogger);
app.use(limiter);
app.set('trust proxy', 'loopback');
app.use(helmet());

app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(CURRENT_PORT);
