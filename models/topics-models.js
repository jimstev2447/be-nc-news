const knex = require('../db/connection');

exports.fetchAllTopics = () => {
  return knex.select('*').from('topics');
};
