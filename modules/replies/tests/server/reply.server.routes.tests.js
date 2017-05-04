'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Reply = mongoose.model('Reply'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  reply;

/**
 * Reply routes tests
 */
describe('Reply CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Reply
    user.save(function () {
      reply = {
        name: 'Reply name'
      };

      done();
    });
  });

  it('should be able to save a Reply if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Reply
        agent.post('/api/replies')
          .send(reply)
          .expect(200)
          .end(function (replySaveErr, replySaveRes) {
            // Handle Reply save error
            if (replySaveErr) {
              return done(replySaveErr);
            }

            // Get a list of Replies
            agent.get('/api/replies')
              .end(function (repliesGetErr, repliesGetRes) {
                // Handle Replies save error
                if (repliesGetErr) {
                  return done(repliesGetErr);
                }

                // Get Replies list
                var replies = repliesGetRes.body;

                // Set assertions
                (replies[0].user._id).should.equal(userId);
                (replies[0].name).should.match('Reply name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Reply if not logged in', function (done) {
    agent.post('/api/replies')
      .send(reply)
      .expect(403)
      .end(function (replySaveErr, replySaveRes) {
        // Call the assertion callback
        done(replySaveErr);
      });
  });

  it('should not be able to save an Reply if no name is provided', function (done) {
    // Invalidate name field
    reply.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Reply
        agent.post('/api/replies')
          .send(reply)
          .expect(400)
          .end(function (replySaveErr, replySaveRes) {
            // Set message assertion
            (replySaveRes.body.message).should.match('Please fill Reply name');

            // Handle Reply save error
            done(replySaveErr);
          });
      });
  });

  it('should be able to update an Reply if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Reply
        agent.post('/api/replies')
          .send(reply)
          .expect(200)
          .end(function (replySaveErr, replySaveRes) {
            // Handle Reply save error
            if (replySaveErr) {
              return done(replySaveErr);
            }

            // Update Reply name
            reply.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Reply
            agent.put('/api/replies/' + replySaveRes.body._id)
              .send(reply)
              .expect(200)
              .end(function (replyUpdateErr, replyUpdateRes) {
                // Handle Reply update error
                if (replyUpdateErr) {
                  return done(replyUpdateErr);
                }

                // Set assertions
                (replyUpdateRes.body._id).should.equal(replySaveRes.body._id);
                (replyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Replies if not signed in', function (done) {
    // Create new Reply model instance
    var replyObj = new Reply(reply);

    // Save the reply
    replyObj.save(function () {
      // Request Replies
      request(app).get('/api/replies')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Reply if not signed in', function (done) {
    // Create new Reply model instance
    var replyObj = new Reply(reply);

    // Save the Reply
    replyObj.save(function () {
      request(app).get('/api/replies/' + replyObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', reply.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Reply with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/replies/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Reply is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Reply which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Reply
    request(app).get('/api/replies/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Reply with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Reply if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Reply
        agent.post('/api/replies')
          .send(reply)
          .expect(200)
          .end(function (replySaveErr, replySaveRes) {
            // Handle Reply save error
            if (replySaveErr) {
              return done(replySaveErr);
            }

            // Delete an existing Reply
            agent.delete('/api/replies/' + replySaveRes.body._id)
              .send(reply)
              .expect(200)
              .end(function (replyDeleteErr, replyDeleteRes) {
                // Handle reply error error
                if (replyDeleteErr) {
                  return done(replyDeleteErr);
                }

                // Set assertions
                (replyDeleteRes.body._id).should.equal(replySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Reply if not signed in', function (done) {
    // Set Reply user
    reply.user = user;

    // Create new Reply model instance
    var replyObj = new Reply(reply);

    // Save the Reply
    replyObj.save(function () {
      // Try deleting Reply
      request(app).delete('/api/replies/' + replyObj._id)
        .expect(403)
        .end(function (replyDeleteErr, replyDeleteRes) {
          // Set message assertion
          (replyDeleteRes.body.message).should.match('User is not authorized');

          // Handle Reply error error
          done(replyDeleteErr);
        });

    });
  });

  it('should be able to get a single Reply that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Reply
          agent.post('/api/replies')
            .send(reply)
            .expect(200)
            .end(function (replySaveErr, replySaveRes) {
              // Handle Reply save error
              if (replySaveErr) {
                return done(replySaveErr);
              }

              // Set assertions on new Reply
              (replySaveRes.body.name).should.equal(reply.name);
              should.exist(replySaveRes.body.user);
              should.equal(replySaveRes.body.user._id, orphanId);

              // force the Reply to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Reply
                    agent.get('/api/replies/' + replySaveRes.body._id)
                      .expect(200)
                      .end(function (replyInfoErr, replyInfoRes) {
                        // Handle Reply error
                        if (replyInfoErr) {
                          return done(replyInfoErr);
                        }

                        // Set assertions
                        (replyInfoRes.body._id).should.equal(replySaveRes.body._id);
                        (replyInfoRes.body.name).should.equal(reply.name);
                        should.equal(replyInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Reply.remove().exec(done);
    });
  });
});
