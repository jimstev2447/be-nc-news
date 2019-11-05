const usersRouter = require('express').Router();
const { getUserByUsername } = require('../controllers/users-controllers');

usersRouter.route('/:username').get(getUserByUsername);

module.exports = usersRouter;
