const express = require('express');
const app = express();
app.use(express.json());
apiRouter = require('./routes/api-router');
const {
  psql400s,
  psql404s,
  server404s,
  customErrors,
  server500s
} = require('./errors');

app.use('/api', apiRouter);
app.use('/*', server404s);

app.use(psql400s);
app.use(psql404s);
app.use(customErrors);
app.use(server500s);
module.exports = app;
