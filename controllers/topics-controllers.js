const { fetchAllTopics, createTopic } = require('../models/topics-models');

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const newTopic = req.body;
  createTopic(newTopic)
    .then(topic => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
