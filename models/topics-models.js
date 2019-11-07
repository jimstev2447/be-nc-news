const knex = require('../db/connection');

exports.fetchAllTopics = () => {
  return knex.select('*').from('topics');
};

exports.checkTopic = ({ topic = '' }) => {
  return knex
    .select('slug')
    .from('topics')
    .where('slug', topic)
    .returning('*')
    .then(([data]) => {
      if (!topic) return data;

      return !data
        ? Promise.reject({ status: 404, msg: 'topic not found' })
        : data;
    });
};
