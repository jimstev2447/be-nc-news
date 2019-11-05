const { fetchAllTopics } = require('../models/topics-models');

exports.getAllTopics = (req, res, next) => {
  console.log('getting all topics...');
  fetchAllTopics().then(topics => {
    res.status(200).send({ topics });
  });
};
