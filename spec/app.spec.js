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
              expect(topics[0]).to.have.keys('slug', 'description');
              expect(topics.length).to.equal(3);
            });
        });
      });
      describe('Invalid Methods', () => {
        it('status: 405 returns method not allowed when given an invalid method', () => {
          const invalidMethods = ['put', 'patch', 'delete', 'post'];
          const promisesToTest = invalidMethods.map(method => {
            return request(app)
              [method]('/api/topics')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('method not allowed');
              });
          });
          return Promise.all(promisesToTest);
        });
      });
    });
    describe('/users', () => {
      describe('/:username', () => {
        describe('GET', () => {
          it('status:200 returns correct user object', () => {
            return request(app)
              .get('/api/users/lurker')
              .expect(200)
              .then(({ body: { user } }) => {
                expect(user).to.have.keys('username', 'name', 'avatar_url');
              });
          });
        });
      });
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
