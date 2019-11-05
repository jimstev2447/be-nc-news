process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai;
const connection = require('../db/connection.js');
const request = require('supertest');
const app = require('../app.js');

beforeEach(() => connection.seed.run());
after(() => connection.destroy());

describe('app', () => {
  describe('/api', () => {
    describe('/topics', () => {
      describe('GET', () => {
        it('status:200 returns all topics', () => {
          return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body: { topics } }) => {
              expect(topics).to.be.an('array');
            });
        });
        it('status:404 given an incorrect path', () => {
          return request(app)
            .get('/api/topicz')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('path not found');
            });
        });
      });
    });
  });
});
