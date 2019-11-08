const knex = require('../db/connection');

exports.fetchUserByUsername = username => {
  return knex
    .select('*')
    .from('users')
    .modify(query => {
      if (username) query.where({ username });
    })
    .then(([user]) => {
      return !user
        ? Promise.reject({ status: 404, msg: 'user not found' })
        : user;
    });
};
