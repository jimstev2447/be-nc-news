const express = require('express');
const app = express();
app.use(express.json());
apiRouter = require('./routes/api-router');
const { server500s, server404s } = require('./errors');

app.use('/api', apiRouter);
app.use('/*', server404s);

app.use(server500s);
module.exports = app;
