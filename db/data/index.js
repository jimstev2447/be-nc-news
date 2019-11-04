const ENV = process.env.NODE_ENV || "development";

const devData = require("./dev-data");
const testData = require("./test-data");

const data = {
  test: testData,
  development: devData
};

module.exports = data[ENV];
