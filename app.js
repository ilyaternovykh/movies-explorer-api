const express = require('express');
const { CURRENT_PORT } = require('./utils/config');

const app = express();

app.listen(CURRENT_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${CURRENT_PORT}`);
});
