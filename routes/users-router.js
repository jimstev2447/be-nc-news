const usersRouter = require('express').Router();
const { getUserByUsername } = require('../controllers/users-controllers');
const { server405s } = require('../errors');

usersRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(server405s);

module.exports = usersRouter;
