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

exports.createUser = ({ username, name, avatar_url = '' }) => {
  return knex
    .insert({ username, name, avatar_url })
    .into('users')
    .returning('*')
    .then(([user]) => {
      return user;
    });
};

exports.fetchAllUsers = () => {
  return knex
    .select('*')
    .from('users')
    .then(users => {
      return users;
    });
};
