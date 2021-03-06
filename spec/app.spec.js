process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-sorted'));
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
      describe('POST', () => {
        it('status: 201 returns new topic', () => {
          const newTopic = {
            slug: 'underwaterWeaving',
            description: 'basket making made damp'
          };
          return request(app)
            .post('/api/topics')
            .send(newTopic)
            .expect(201)
            .then(({ body: { topic } }) => {
              expect(topic.slug).to.equal('underwaterWeaving');
              expect(topic.description).to.equal('basket making made damp');
            });
        });

        it('status: 400 returns bad request when missing a column', () => {
          const newTopic = {
            slug: 'underwaterWeaving'
          };
          return request(app)
            .post('/api/topics')
            .send(newTopic)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
      });
      describe('Invalid Methods', () => {
        it('status: 405 returns method not allowed when given an invalid method', () => {
          const invalidMethods = ['put', 'patch', 'delete'];
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
      describe('POST', () => {
        it('status: 201 returns new user objet', () => {
          const newUser = {
            username: 'testUser01',
            name: 'Jane Dough',
            avatar_url: 'www.test.com'
          };
          return request(app)
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .then(({ body: { user } }) => {
              expect(user).to.have.keys('username', 'name', 'avatar_url');
            });
        });
        it('status:201 returns with correct values', () => {
          const newUser = {
            username: 'testUser01',
            name: 'Jane Dough',
            avatar_url: 'www.test.com'
          };
          return request(app)
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .then(({ body: { user } }) => {
              expect(user).to.have.keys('username', 'name', 'avatar_url');
            });
        });
        it('status:400 returns bad request for missing username', () => {
          const newUser = {
            name: 'Jane Dough',
            avatar_url: 'www.test.com'
          };
          return request(app)
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
        it('status:400 returns bad request for missing name', () => {
          const newUser = {
            username: 'icellusedkars'
          };
          return request(app)
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
      });
      describe('GET', () => {
        it('status: 200 returns array of users', () => {
          return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body: { users } }) => {
              expect(users).to.be.an('array');
              expect(users.length).to.eql(4);
            });
        });
        describe('Invalid methods', () => {
          it('status: 405 returns method not allowed when given an invalid method', () => {
            const invalidMethods = ['put', 'patch', 'delete'];
            const promisesToTest = invalidMethods.map(method => {
              return request(app)
                [method]('/api/users')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('method not allowed');
                });
            });
            return Promise.all(promisesToTest);
          });
        });
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
            it('status:404 returns user not found for valid but non-existent username', () => {
              return request(app)
                .get('/api/users/anyUsername')
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('user not found');
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
                  'votes',
                  'comment_count'
                );
                expect(article.comment_count).to.equal('13');
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
          it('status:404 returns article not found for vaild but non-existent article_id', () => {
            return request(app)
              .get('/api/articles/75')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('article not found');
              });
          });
        });
        describe('PATCH', () => {
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
          it('status:200 returns unmodified article when given an invalid votes key', () => {
            const newVotes = { test: 1 };
            return request(app)
              .patch('/api/articles/1')
              .send(newVotes)
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.votes).to.equal(100);
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
          it('status:404 returns path not found for valid but non-existent', () => {
            const newVotes = { inc_votes: 1 };
            return request(app)
              .patch('/api/articles/101')
              .send(newVotes)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('article not found');
              });
          });
          it('status:400 returns bad request if invalid article_id', () => {
            const newVotes = { inc_votes: 1 };
            return request(app)
              .patch('/api/articles/incorrect_id')
              .send(newVotes)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
        });
        describe('DELETE', () => {
          it('Status:204 returns no content', () => {
            return request(app)
              .delete('/api/articles/1')
              .expect(204);
          });
          it('Status:404 returns article not found if valid but non existent article if', () => {
            return request(app)
              .delete('/api/articles/13176')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('article not found');
              });
          });
          it('Status: 400 returns bad request for invalid article id', () => {
            return request(app)
              .delete('/api/articles/invalidArticle')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
        });
        describe('Invalid Methods', () => {
          it('status:405 returns invalid methd when given an invalid method', () => {
            const invalidMethods = ['put', 'post'];
            const methodsToTest = invalidMethods.map(method => {
              return request(app)
                [method]('/api/articles/1')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('method not allowed');
                });
            });
            return Promise.all(methodsToTest);
          });
        });
        describe('/comments', () => {
          describe('POST', () => {
            it('status:201 returns comment', () => {
              const newComment = {
                username: 'icellusedkars',
                body: 'new comment'
              };
              return request(app)
                .post('/api/articles/1/comments')
                .send(newComment)
                .expect(201)
                .then(({ body: { comment } }) => {
                  expect(comment).to.have.keys(
                    'body',
                    'created_at',
                    'comment_id',
                    'article_id',
                    'votes',
                    'author'
                  );
                });
            });
            it('status:201 returns with correct values', () => {
              const newComment = {
                username: 'icellusedkars',
                body: 'new comment'
              };
              return request(app)
                .post('/api/articles/1/comments')
                .send(newComment)
                .expect(201)
                .then(({ body: { comment } }) => {
                  expect(comment.body).to.equal('new comment');
                  expect(comment.article_id).to.equal(1);
                  expect(comment.author).to.equal('icellusedkars');
                  expect(comment.created_at).to.not.equal(undefined);
                  expect(comment.comment_id).to.equal(19);
                  expect(comment.votes).to.equal(0);
                });
            });
            it('status:422 returns unprocessable request for valid but non-existent article_id', () => {
              const newComment = {
                username: 'icellusedkars',
                body: 'new comment'
              };
              return request(app)
                .post('/api/articles/1999/comments')
                .send(newComment)
                .expect(422)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('unprocessable request');
                });
            });
            it('status:400 returns bad request for invalid article_id', () => {
              const newComment = {
                username: 'icellusedkars',
                body: 'new comment'
              };
              return request(app)
                .post('/api/articles/invalidArticleId/comments')
                .send(newComment)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('bad request');
                });
            });
            it('status:400 returns bad request for missing username', () => {
              const newComment = {
                body: 'new comment'
              };
              return request(app)
                .post('/api/articles/invalidArticleId/comments')
                .send(newComment)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('bad request');
                });
            });
            it('status:400 returns bad request for missing body', () => {
              const newComment = {
                username: 'icellusedkars'
              };
              return request(app)
                .post('/api/articles/1/comments')
                .send(newComment)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('bad request');
                });
            });
            it('status:400 returns bad request for non-existent username', () => {
              const newComment = {
                username: 'icellusedkars',
                body: 'new comment'
              };
              return request(app)
                .post('/api/articles/invalidArticleId/comments')
                .send(newComment)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('bad request');
                });
            });
          });
          describe('GET', () => {
            it('status:200 returns array of comments with correct art_id', () => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.an('array');
                  expect(comments[0]).to.have.keys(
                    'comment_id',
                    'votes',
                    'created_at',
                    'author',
                    'body'
                  );
                });
            });
            it('status:200 returns with the correct number of comments for that article', () => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.length(10);
                });
            });
            it('status:200 returns sorted by created_at desc by default', () => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.sortedBy('created_at', {
                    descending: true
                  });
                });
            });
            it('status:200 accepts sortBy query and returns correctly', () => {
              const cols = [
                'comment_id',
                'votes',
                'created_at',
                'author',
                'body'
              ];
              const sortByProms = cols.map(sortBy => {
                return request(app)
                  .get(`/api/articles/1/comments?sort_by=${sortBy}`)
                  .expect(200)
                  .then(({ body: { comments } }) => {
                    expect(comments).to.be.sortedBy(sortBy, {
                      descending: true
                    });
                  });
              });
              return Promise.all(sortByProms);
            });
            it('status:200 accepts order_by query accepts asc', () => {
              return request(app)
                .get('/api/articles/1/comments?order=asc')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.sortedBy('created_at');
                });
            });
            it('status:200 accepts limit query', () => {
              return request(app)
                .get('/api/articles/1/comments?limit=5')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.length(5);
                });
            });
            it('status:200 takes a p query which offests the results', () => {
              return request(app)
                .get('/api/articles/1/comments?p=2')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.length(3);
                });
            });
            it('status:404 returns article not found for non-existent art_id', () => {
              return request(app)
                .get('/api/articles/1234/comments')
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('article not found');
                });
            });
            it('status:400 returns bad request for invalid article_id', () => {
              return request(app)
                .get('/api/articles/invalidArt_id/comments')
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('bad request');
                });
            });
            it('status:400 returns bad request for invalid sort query', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=Banannas')
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('bad request');
                });
            });
            it('status:400 returns bad request for invalid order_by query', () => {
              return request(app)
                .get('/api/articles/1/comments?order=Banannas')
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('bad request');
                });
            });
            it('status:400 returns bad request for invalid limit query', () => {
              return request(app)
                .get('/api/articles/1/comments?limit=brioche')
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('bad request');
                });
            });
            it('status:400 returns bad request for invalid p query', () => {
              return request(app)
                .get('/api/articles/1/comments?p=panauchocolate')
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('bad request');
                });
            });
          });
          describe('Invalid Methods', () => {
            it('status:405 returns invalid methd when given an invalid method', () => {
              const invalidMethods = ['put', 'patch', 'delete'];
              const methodsToTest = invalidMethods.map(method => {
                return request(app)
                  [method]('/api/articles/1/comments')
                  .expect(405)
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal('method not allowed');
                  });
              });
              return Promise.all(methodsToTest);
            });
          });
        });
      });
      describe('GET', () => {
        it('status:200 returns array of all articles', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.an('array');
              expect(articles).to.have.length(10);
            });
        });
        it('status:200 returns articles with expected properties', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles[1]).to.have.keys(
                'author',
                'title',
                'article_id',
                'topic',
                'created_at',
                'votes',
                'comment_count'
              );
            });
        });
        it('status:200 returns sorted by created_at (desc) by default', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.sortedBy('created_at', {
                descending: true
              });
            });
        });
        it('status:200 returns ordered ascending as query', () => {
          return request(app)
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.sortedBy('created_at');
            });
        });
        it('status:200 returns ordered by valid columns', () => {
          const cols = [
            'author',
            'votes',
            'created_at',
            'title',
            'topic',
            'article_id',
            'comment_count'
          ];
          const sortByProms = cols.map(sortBy => {
            return request(app)
              .get(`/api/articles?sort_by=${sortBy}`)
              .expect(200)
              .then(({ body: { articles } }) => {
                if (sortBy === 'comment_count') {
                  const numberedCommentCount = articles.map(article => {
                    const newArticle = { ...article };
                    newArticle.comment_count = Number(newArticle.comment_count);
                    return newArticle;
                  });
                  expect(numberedCommentCount).to.be.sortedBy(sortBy, {
                    descending: true
                  });
                }
              });
          });
          return Promise.all(sortByProms);
        });
        it('status:200 returns no articles from an author with no articles when queried', () => {
          return request(app)
            .get('/api/articles?author=lurker')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.have.length(0);
            });
        });
        it('status:200 returns articles from an author when queried', () => {
          return request(app)
            .get('/api/articles?author=rogersop')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.have.length(3);
            });
        });
        it('status:200 returns articles with a topic when queried', () => {
          return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.have.length(1);
            });
        });
        it('status:200 returns no articles with a topic with no articles when queried', () => {
          return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.have.length(0);
            });
        });
        it('status:200 returns n most recent articles when given limit query', () => {
          return request(app)
            .get('/api/articles?limit=5')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.have.length(5);
              expect(articles).to.be.sortedBy('created_at', {
                descending: true
              });
            });
        });
        it('status:200 takes a p query which specifies the page at which to start showing articles', () => {
          return request(app)
            .get('/api/articles?p=2')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.have.length(2);
            });
        });
        it('status:200 takes a p query which specifies the page at which to start showing articles', () => {
          return request(app)
            .get('/api/articles?limit=3&p=3')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.have.length(3);
            });
        });
        it('status:400 returns bad request when given an invalid sort col', () => {
          return request(app)
            .get('/api/articles?sort_by=yes')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
        it('status:400 returns bad request when given an invalid order_by', () => {
          return request(app)
            .get('/api/articles?order=yesPlease')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
        it('status:404 returns author not found when given a non-existent author', () => {
          return request(app)
            .get('/api/articles?author=testAuthor')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('user not found');
            });
        });
        it('status:404 returns topic not found when given a non-existent topic', () => {
          return request(app)
            .get('/api/articles?topic=underwaterbasketweaving')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('topic not found');
            });
        });
        it('status:400 returns bad request when given invalid limit query', () => {
          return request(app)
            .get('/api/articles?limit=burgers')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
        it('status:400 returns bad request when given bad p query', () => {
          return request(app)
            .get('/api/articles?p=sausages')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
        it('status:200 returns a total_count proprty with the total number of articles without the page limit', () => {
          return request(app)
            .get('/api/articles?author=butter_bridge')
            .expect(200)
            .then(({ body: { total_count } }) => {
              expect(total_count).to.equal('3');
            });
        });
      });
      describe('POST', () => {
        it('status:201 returns new article object', () => {
          const newArticle = {
            title: "ain't newspapers brilliant",
            topic: 'paper',
            author: 'lurker',
            body: 'yes this is some words'
          };
          return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(201)
            .then(({ body: { article } }) => {
              expect(article).to.include.keys(
                'article_id',
                'votes',
                'created_at'
              );
            });
        });
        it('status:400 returns bad request when missing col', () => {
          const newArticle = {
            title: "ain't newspapers brilliant",
            author: 'lurker',
            body: 'yes this is some words'
          };
          return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
        it('status:422 returns unprocessable request when given non-existent username', () => {
          const newArticle = {
            title: "ain't newspapers brilliant",
            topic: 'paper',
            author: 'yarp',
            body: 'yes this is some words'
          };
          return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(422)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('unprocessable request');
            });
        });
        it('status:422 returns unprocessable request when given non-existent topic', () => {
          const newArticle = {
            title: "ain't newspapers brilliant",
            topic: 'testtopic',
            author: 'lurker',
            body: 'yes this is some words'
          };
          return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(422)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('unprocessable request');
            });
        });
      });
    });
    describe('/comments', () => {
      describe('/:comment_id', () => {
        describe('PATCH', () => {
          it('status:200 returns comment with votes increased', () => {
            const newVotes = { inc_votes: 1 };
            return request(app)
              .patch('/api/comments/1')
              .send(newVotes)
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment.votes).to.equal(17);
              });
          });
          it('status:200 returns comment with votes decreased', () => {
            const newVotes = { inc_votes: -1 };
            return request(app)
              .patch('/api/comments/1')
              .send(newVotes)
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment.votes).to.equal(15);
              });
          });
          it('status:200 returns unmodified comment when given an invalid votes key', () => {
            const newVotes = { test: 1 };
            return request(app)
              .patch('/api/comments/1')
              .send(newVotes)
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment.votes).to.equal(16);
              });
          });
          it('status:400 returns bad request when given an invalid inc_votes value', () => {
            const newVotes = { inc_votes: 'test' };
            return request(app)
              .patch('/api/comments/1')
              .send(newVotes)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
          it('status:404 returns path not found for valid but non-existent', () => {
            const newVotes = { inc_votes: 1 };
            return request(app)
              .patch('/api/comments/10001')
              .send(newVotes)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('comment not found');
              });
          });
          it('status:400 returns bad request if invalid article_id', () => {
            const newVotes = { inc_votes: 1 };
            return request(app)
              .patch('/api/comments/incorrect_id')
              .send(newVotes)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
        });
        describe('DELETE', () => {
          it('status:204 returns no content', () => {
            return request(app)
              .delete('/api/comments/1')
              .expect(204);
          });
          it('status:404 returns comment not found for non existend comment', () => {
            return request(app)
              .delete('/api/comments/12345')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('comment not found');
              });
          });
          it('status:400 retuns bad request for invalid comment_id', () => {
            return request(app)
              .delete('/api/comments/invalidComment')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
        });
        describe('Invalid Methods', () => {
          it('status:405 returns invalid methd when given an invalid method', () => {
            const invalidMethods = ['put', 'post'];
            const methodsToTest = invalidMethods.map(method => {
              return request(app)
                [method]('/api/comments/1')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('method not allowed');
                });
            });
            return Promise.all(methodsToTest);
          });
        });
      });
    });
    describe('GET', () => {
      it('returns JSON describing the endpoints', () => {
        return request(app)
          .get('/api')
          .expect(200)
          .then(({ body: { msg } }) => {
            expect(msg).to.be.an('object');
          });
      });
    });
    describe('Invalid Methods', () => {
      it('status: 405 returns method not allowed when given an invalid method', () => {
        const invalidMethods = ['put', 'patch', 'delete', 'post'];
        const promisesToTest = invalidMethods.map(method => {
          return request(app)
            [method]('/api')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('method not allowed');
            });
        });
        return Promise.all(promisesToTest);
      });
    });
    it('status:404 given an incorrect path', () => {
      return request(app)
        .get('/api/articlesx')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal('path not found');
        });
    });
  });
});
