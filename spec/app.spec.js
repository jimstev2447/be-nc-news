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
                expect(user).to.eql({
                  username: 'lurker',
                  name: 'do_nothing',
                  avatar_url:
                    'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
                });
              });
          });
          it('status:404 returns path not found for valid but non-existent username', () => {
            return request(app)
              .get('/api/users/anyUsername')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('path not found');
              });
          });
        });
        describe('Invalid methods', () => {
          it('status: 405 returns method not allowed when given an invalid method', () => {
            const invalidMethods = ['put', 'patch', 'delete', 'post'];
            const promisesToTest = invalidMethods.map(method => {
              return request(app)
                [method]('/api/users/lurker')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('method not allowed');
                });
            });
            return Promise.all(promisesToTest);
          });
        });
      });
    });
    describe('/articles', () => {
      describe('/:article_id', () => {
        describe('GET', () => {
          it('status:200 returns with the specified article', () => {
            return request(app)
              .get('/api/articles/1')
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article).to.have.keys(
                  'article_id',
                  'title',
                  'topic',
                  'author',
                  'body',
                  'created_at',
                  'votes'
                );
              });
          });
          it('status:400 returns bad request for invalid article_id', () => {
            return request(app)
              .get('/api/articles/invalidReq')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
          it('status:404 returns path not found for vaild but non-existent article_id', () => {
            return request(app)
              .get('/api/articles/75')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('path not found');
              });
          });
        });
        describe('POST', () => {
          it('status:200 returns updated article votes increased by 1', () => {
            const newVotes = { inc_votes: 1 };
            return request(app)
              .patch('/api/articles/1')
              .send(newVotes)
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.votes).to.equal(101);
              });
          });
          it('status:200 returns updated article votes increased by 10', () => {
            const newVotes = { inc_votes: 10 };
            return request(app)
              .patch('/api/articles/1')
              .send(newVotes)
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.votes).to.equal(110);
              });
          });
          it('status:200 returns updated article votes decreased by 1', () => {
            const newVotes = { inc_votes: -1 };
            return request(app)
              .patch('/api/articles/1')
              .send(newVotes)
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.votes).to.equal(99);
              });
          });
          it('status:200 returns updated article votes decreased by 10', () => {
            const newVotes = { inc_votes: -10 };
            return request(app)
              .patch('/api/articles/1')
              .send(newVotes)
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.votes).to.equal(90);
              });
          });
          it('status:400 returns bad request when given an invalid inc_votes value', () => {
            const newVotes = { inc_votes: 'test' };
            return request(app)
              .patch('/api/articles/1')
              .send(newVotes)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
          it('status:400 returns bad request when given an invalid votes key', () => {
            const newVotes = { test: 1 };
            return request(app)
              .patch('/api/articles/1')
              .send(newVotes)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
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
