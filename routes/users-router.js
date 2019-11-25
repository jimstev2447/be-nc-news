const usersRouter = require('express').Router();
const {
  getUserByUsername,
  postUser,
  getAllUsers
} = require('../controllers/users-controllers');
const { server405s } = require('../errors');

usersRouter
  .route('/')
  .get(getAllUsers)
  .post(postUser)
  .all(server405s);

usersRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(server405s);

module.exports = usersRouter;
