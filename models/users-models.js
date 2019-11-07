const knex = require('../db/connection');

exports.fetchUserByUsername = username => {
  return knex
    .select('*')
    .from('users')
    .where({ username })
    .then(([user]) => {
      return !user
        ? Promise.reject({ status: 404, msg: 'user not found' })
        : user;
    });
};

exports.checkUser = ({ author = '' }) => {
  return knex
    .select('username')
    .from('users')
    .where('username', author)
    .returning('*')
    .then(([data]) => {
      if (!author) return data;

      return !data
        ? Promise.reject({ status: 404, msg: 'author not found' })
        : data;
    });
};
