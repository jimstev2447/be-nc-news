const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());
apiRouter = require('./routes/api-router');
const {
  psql400s,
  psql422s,
  server404s,
  customErrors,
  server500s
} = require('./errors');

app.use('/api', apiRouter);
app.use('/*', server404s);

app.use(psql400s);
app.use(psql422s);
app.use(customErrors);
app.use(server500s);
module.exports = app;
