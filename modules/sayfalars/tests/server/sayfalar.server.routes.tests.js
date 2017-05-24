'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Sayfalar = mongoose.model('Sayfalar'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  sayfalar;

/**
 * Sayfalar routes tests
 */
describe('Sayfalar CRUD tests', function () {

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

    // Save a user to the test db and create new Sayfalar
    user.save(function () {
      sayfalar = {
        name: 'Sayfalar name'
      };

      done();
    });
  });

  it('should be able to save a Sayfalar if logged in', function (done) {
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

        // Save a new Sayfalar
        agent.post('/api/sayfalars')
          .send(sayfalar)
          .expect(200)
          .end(function (sayfalarSaveErr, sayfalarSaveRes) {
            // Handle Sayfalar save error
            if (sayfalarSaveErr) {
              return done(sayfalarSaveErr);
            }

            // Get a list of Sayfalars
            agent.get('/api/sayfalars')
              .end(function (sayfalarsGetErr, sayfalarsGetRes) {
                // Handle Sayfalars save error
                if (sayfalarsGetErr) {
                  return done(sayfalarsGetErr);
                }

                // Get Sayfalars list
                var sayfalars = sayfalarsGetRes.body;

                // Set assertions
                (sayfalars[0].user._id).should.equal(userId);
                (sayfalars[0].name).should.match('Sayfalar name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Sayfalar if not logged in', function (done) {
    agent.post('/api/sayfalars')
      .send(sayfalar)
      .expect(403)
      .end(function (sayfalarSaveErr, sayfalarSaveRes) {
        // Call the assertion callback
        done(sayfalarSaveErr);
      });
  });

  it('should not be able to save an Sayfalar if no name is provided', function (done) {
    // Invalidate name field
    sayfalar.name = '';

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

        // Save a new Sayfalar
        agent.post('/api/sayfalars')
          .send(sayfalar)
          .expect(400)
          .end(function (sayfalarSaveErr, sayfalarSaveRes) {
            // Set message assertion
            (sayfalarSaveRes.body.message).should.match('Please fill Sayfalar name');

            // Handle Sayfalar save error
            done(sayfalarSaveErr);
          });
      });
  });

  it('should be able to update an Sayfalar if signed in', function (done) {
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

        // Save a new Sayfalar
        agent.post('/api/sayfalars')
          .send(sayfalar)
          .expect(200)
          .end(function (sayfalarSaveErr, sayfalarSaveRes) {
            // Handle Sayfalar save error
            if (sayfalarSaveErr) {
              return done(sayfalarSaveErr);
            }

            // Update Sayfalar name
            sayfalar.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Sayfalar
            agent.put('/api/sayfalars/' + sayfalarSaveRes.body._id)
              .send(sayfalar)
              .expect(200)
              .end(function (sayfalarUpdateErr, sayfalarUpdateRes) {
                // Handle Sayfalar update error
                if (sayfalarUpdateErr) {
                  return done(sayfalarUpdateErr);
                }

                // Set assertions
                (sayfalarUpdateRes.body._id).should.equal(sayfalarSaveRes.body._id);
                (sayfalarUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Sayfalars if not signed in', function (done) {
    // Create new Sayfalar model instance
    var sayfalarObj = new Sayfalar(sayfalar);

    // Save the sayfalar
    sayfalarObj.save(function () {
      // Request Sayfalars
      request(app).get('/api/sayfalars')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Sayfalar if not signed in', function (done) {
    // Create new Sayfalar model instance
    var sayfalarObj = new Sayfalar(sayfalar);

    // Save the Sayfalar
    sayfalarObj.save(function () {
      request(app).get('/api/sayfalars/' + sayfalarObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', sayfalar.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Sayfalar with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sayfalars/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Sayfalar is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Sayfalar which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Sayfalar
    request(app).get('/api/sayfalars/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Sayfalar with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Sayfalar if signed in', function (done) {
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

        // Save a new Sayfalar
        agent.post('/api/sayfalars')
          .send(sayfalar)
          .expect(200)
          .end(function (sayfalarSaveErr, sayfalarSaveRes) {
            // Handle Sayfalar save error
            if (sayfalarSaveErr) {
              return done(sayfalarSaveErr);
            }

            // Delete an existing Sayfalar
            agent.delete('/api/sayfalars/' + sayfalarSaveRes.body._id)
              .send(sayfalar)
              .expect(200)
              .end(function (sayfalarDeleteErr, sayfalarDeleteRes) {
                // Handle sayfalar error error
                if (sayfalarDeleteErr) {
                  return done(sayfalarDeleteErr);
                }

                // Set assertions
                (sayfalarDeleteRes.body._id).should.equal(sayfalarSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Sayfalar if not signed in', function (done) {
    // Set Sayfalar user
    sayfalar.user = user;

    // Create new Sayfalar model instance
    var sayfalarObj = new Sayfalar(sayfalar);

    // Save the Sayfalar
    sayfalarObj.save(function () {
      // Try deleting Sayfalar
      request(app).delete('/api/sayfalars/' + sayfalarObj._id)
        .expect(403)
        .end(function (sayfalarDeleteErr, sayfalarDeleteRes) {
          // Set message assertion
          (sayfalarDeleteRes.body.message).should.match('User is not authorized');

          // Handle Sayfalar error error
          done(sayfalarDeleteErr);
        });

    });
  });

  it('should be able to get a single Sayfalar that has an orphaned user reference', function (done) {
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

          // Save a new Sayfalar
          agent.post('/api/sayfalars')
            .send(sayfalar)
            .expect(200)
            .end(function (sayfalarSaveErr, sayfalarSaveRes) {
              // Handle Sayfalar save error
              if (sayfalarSaveErr) {
                return done(sayfalarSaveErr);
              }

              // Set assertions on new Sayfalar
              (sayfalarSaveRes.body.name).should.equal(sayfalar.name);
              should.exist(sayfalarSaveRes.body.user);
              should.equal(sayfalarSaveRes.body.user._id, orphanId);

              // force the Sayfalar to have an orphaned user reference
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

                    // Get the Sayfalar
                    agent.get('/api/sayfalars/' + sayfalarSaveRes.body._id)
                      .expect(200)
                      .end(function (sayfalarInfoErr, sayfalarInfoRes) {
                        // Handle Sayfalar error
                        if (sayfalarInfoErr) {
                          return done(sayfalarInfoErr);
                        }

                        // Set assertions
                        (sayfalarInfoRes.body._id).should.equal(sayfalarSaveRes.body._id);
                        (sayfalarInfoRes.body.name).should.equal(sayfalar.name);
                        should.equal(sayfalarInfoRes.body.user, undefined);

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
      Sayfalar.remove().exec(done);
    });
  });
});
