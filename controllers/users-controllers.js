const { fetchUserByUsername } = require('../models/users-models');

exports.getUserByUsername = (req, res, next) => {
  fetchUserByUsername(req.params.username)
    .then(([user]) => {
      if (!user) return Promise.reject({ status: 404, msg: 'path not found' });
      else res.status(200).send({ user });
    })
    .catch(next);
};
