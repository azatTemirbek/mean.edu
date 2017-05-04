'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Der = mongoose.model('Der'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  der;

/**
 * Der routes tests
 */
describe('Der CRUD tests', function () {

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

    // Save a user to the test db and create new Der
    user.save(function () {
      der = {
        name: 'Der name'
      };

      done();
    });
  });

  it('should be able to save a Der if logged in', function (done) {
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

        // Save a new Der
        agent.post('/api/ders')
          .send(der)
          .expect(200)
          .end(function (derSaveErr, derSaveRes) {
            // Handle Der save error
            if (derSaveErr) {
              return done(derSaveErr);
            }

            // Get a list of Ders
            agent.get('/api/ders')
              .end(function (dersGetErr, dersGetRes) {
                // Handle Ders save error
                if (dersGetErr) {
                  return done(dersGetErr);
                }

                // Get Ders list
                var ders = dersGetRes.body;

                // Set assertions
                (ders[0].user._id).should.equal(userId);
                (ders[0].name).should.match('Der name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Der if not logged in', function (done) {
    agent.post('/api/ders')
      .send(der)
      .expect(403)
      .end(function (derSaveErr, derSaveRes) {
        // Call the assertion callback
        done(derSaveErr);
      });
  });

  it('should not be able to save an Der if no name is provided', function (done) {
    // Invalidate name field
    der.name = '';

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

        // Save a new Der
        agent.post('/api/ders')
          .send(der)
          .expect(400)
          .end(function (derSaveErr, derSaveRes) {
            // Set message assertion
            (derSaveRes.body.message).should.match('Please fill Der name');

            // Handle Der save error
            done(derSaveErr);
          });
      });
  });

  it('should be able to update an Der if signed in', function (done) {
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

        // Save a new Der
        agent.post('/api/ders')
          .send(der)
          .expect(200)
          .end(function (derSaveErr, derSaveRes) {
            // Handle Der save error
            if (derSaveErr) {
              return done(derSaveErr);
            }

            // Update Der name
            der.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Der
            agent.put('/api/ders/' + derSaveRes.body._id)
              .send(der)
              .expect(200)
              .end(function (derUpdateErr, derUpdateRes) {
                // Handle Der update error
                if (derUpdateErr) {
                  return done(derUpdateErr);
                }

                // Set assertions
                (derUpdateRes.body._id).should.equal(derSaveRes.body._id);
                (derUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Ders if not signed in', function (done) {
    // Create new Der model instance
    var derObj = new Der(der);

    // Save the der
    derObj.save(function () {
      // Request Ders
      request(app).get('/api/ders')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Der if not signed in', function (done) {
    // Create new Der model instance
    var derObj = new Der(der);

    // Save the Der
    derObj.save(function () {
      request(app).get('/api/ders/' + derObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', der.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Der with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/ders/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Der is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Der which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Der
    request(app).get('/api/ders/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Der with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Der if signed in', function (done) {
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

        // Save a new Der
        agent.post('/api/ders')
          .send(der)
          .expect(200)
          .end(function (derSaveErr, derSaveRes) {
            // Handle Der save error
            if (derSaveErr) {
              return done(derSaveErr);
            }

            // Delete an existing Der
            agent.delete('/api/ders/' + derSaveRes.body._id)
              .send(der)
              .expect(200)
              .end(function (derDeleteErr, derDeleteRes) {
                // Handle der error error
                if (derDeleteErr) {
                  return done(derDeleteErr);
                }

                // Set assertions
                (derDeleteRes.body._id).should.equal(derSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Der if not signed in', function (done) {
    // Set Der user
    der.user = user;

    // Create new Der model instance
    var derObj = new Der(der);

    // Save the Der
    derObj.save(function () {
      // Try deleting Der
      request(app).delete('/api/ders/' + derObj._id)
        .expect(403)
        .end(function (derDeleteErr, derDeleteRes) {
          // Set message assertion
          (derDeleteRes.body.message).should.match('User is not authorized');

          // Handle Der error error
          done(derDeleteErr);
        });

    });
  });

  it('should be able to get a single Der that has an orphaned user reference', function (done) {
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

          // Save a new Der
          agent.post('/api/ders')
            .send(der)
            .expect(200)
            .end(function (derSaveErr, derSaveRes) {
              // Handle Der save error
              if (derSaveErr) {
                return done(derSaveErr);
              }

              // Set assertions on new Der
              (derSaveRes.body.name).should.equal(der.name);
              should.exist(derSaveRes.body.user);
              should.equal(derSaveRes.body.user._id, orphanId);

              // force the Der to have an orphaned user reference
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

                    // Get the Der
                    agent.get('/api/ders/' + derSaveRes.body._id)
                      .expect(200)
                      .end(function (derInfoErr, derInfoRes) {
                        // Handle Der error
                        if (derInfoErr) {
                          return done(derInfoErr);
                        }

                        // Set assertions
                        (derInfoRes.body._id).should.equal(derSaveRes.body._id);
                        (derInfoRes.body.name).should.equal(der.name);
                        should.equal(derInfoRes.body.user, undefined);

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
      Der.remove().exec(done);
    });
  });
});
