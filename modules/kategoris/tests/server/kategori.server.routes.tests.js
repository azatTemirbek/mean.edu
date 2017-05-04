'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Kategori = mongoose.model('Kategori'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  kategori;

/**
 * Kategori routes tests
 */
describe('Kategori CRUD tests', function () {

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

    // Save a user to the test db and create new Kategori
    user.save(function () {
      kategori = {
        name: 'Kategori name'
      };

      done();
    });
  });

  it('should be able to save a Kategori if logged in', function (done) {
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

        // Save a new Kategori
        agent.post('/api/kategoris')
          .send(kategori)
          .expect(200)
          .end(function (kategoriSaveErr, kategoriSaveRes) {
            // Handle Kategori save error
            if (kategoriSaveErr) {
              return done(kategoriSaveErr);
            }

            // Get a list of Kategoris
            agent.get('/api/kategoris')
              .end(function (kategorisGetErr, kategorisGetRes) {
                // Handle Kategoris save error
                if (kategorisGetErr) {
                  return done(kategorisGetErr);
                }

                // Get Kategoris list
                var kategoris = kategorisGetRes.body;

                // Set assertions
                (kategoris[0].user._id).should.equal(userId);
                (kategoris[0].name).should.match('Kategori name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Kategori if not logged in', function (done) {
    agent.post('/api/kategoris')
      .send(kategori)
      .expect(403)
      .end(function (kategoriSaveErr, kategoriSaveRes) {
        // Call the assertion callback
        done(kategoriSaveErr);
      });
  });

  it('should not be able to save an Kategori if no name is provided', function (done) {
    // Invalidate name field
    kategori.name = '';

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

        // Save a new Kategori
        agent.post('/api/kategoris')
          .send(kategori)
          .expect(400)
          .end(function (kategoriSaveErr, kategoriSaveRes) {
            // Set message assertion
            (kategoriSaveRes.body.message).should.match('Please fill Kategori name');

            // Handle Kategori save error
            done(kategoriSaveErr);
          });
      });
  });

  it('should be able to update an Kategori if signed in', function (done) {
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

        // Save a new Kategori
        agent.post('/api/kategoris')
          .send(kategori)
          .expect(200)
          .end(function (kategoriSaveErr, kategoriSaveRes) {
            // Handle Kategori save error
            if (kategoriSaveErr) {
              return done(kategoriSaveErr);
            }

            // Update Kategori name
            kategori.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Kategori
            agent.put('/api/kategoris/' + kategoriSaveRes.body._id)
              .send(kategori)
              .expect(200)
              .end(function (kategoriUpdateErr, kategoriUpdateRes) {
                // Handle Kategori update error
                if (kategoriUpdateErr) {
                  return done(kategoriUpdateErr);
                }

                // Set assertions
                (kategoriUpdateRes.body._id).should.equal(kategoriSaveRes.body._id);
                (kategoriUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Kategoris if not signed in', function (done) {
    // Create new Kategori model instance
    var kategoriObj = new Kategori(kategori);

    // Save the kategori
    kategoriObj.save(function () {
      // Request Kategoris
      request(app).get('/api/kategoris')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Kategori if not signed in', function (done) {
    // Create new Kategori model instance
    var kategoriObj = new Kategori(kategori);

    // Save the Kategori
    kategoriObj.save(function () {
      request(app).get('/api/kategoris/' + kategoriObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', kategori.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Kategori with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/kategoris/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Kategori is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Kategori which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Kategori
    request(app).get('/api/kategoris/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Kategori with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Kategori if signed in', function (done) {
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

        // Save a new Kategori
        agent.post('/api/kategoris')
          .send(kategori)
          .expect(200)
          .end(function (kategoriSaveErr, kategoriSaveRes) {
            // Handle Kategori save error
            if (kategoriSaveErr) {
              return done(kategoriSaveErr);
            }

            // Delete an existing Kategori
            agent.delete('/api/kategoris/' + kategoriSaveRes.body._id)
              .send(kategori)
              .expect(200)
              .end(function (kategoriDeleteErr, kategoriDeleteRes) {
                // Handle kategori error error
                if (kategoriDeleteErr) {
                  return done(kategoriDeleteErr);
                }

                // Set assertions
                (kategoriDeleteRes.body._id).should.equal(kategoriSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Kategori if not signed in', function (done) {
    // Set Kategori user
    kategori.user = user;

    // Create new Kategori model instance
    var kategoriObj = new Kategori(kategori);

    // Save the Kategori
    kategoriObj.save(function () {
      // Try deleting Kategori
      request(app).delete('/api/kategoris/' + kategoriObj._id)
        .expect(403)
        .end(function (kategoriDeleteErr, kategoriDeleteRes) {
          // Set message assertion
          (kategoriDeleteRes.body.message).should.match('User is not authorized');

          // Handle Kategori error error
          done(kategoriDeleteErr);
        });

    });
  });

  it('should be able to get a single Kategori that has an orphaned user reference', function (done) {
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

          // Save a new Kategori
          agent.post('/api/kategoris')
            .send(kategori)
            .expect(200)
            .end(function (kategoriSaveErr, kategoriSaveRes) {
              // Handle Kategori save error
              if (kategoriSaveErr) {
                return done(kategoriSaveErr);
              }

              // Set assertions on new Kategori
              (kategoriSaveRes.body.name).should.equal(kategori.name);
              should.exist(kategoriSaveRes.body.user);
              should.equal(kategoriSaveRes.body.user._id, orphanId);

              // force the Kategori to have an orphaned user reference
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

                    // Get the Kategori
                    agent.get('/api/kategoris/' + kategoriSaveRes.body._id)
                      .expect(200)
                      .end(function (kategoriInfoErr, kategoriInfoRes) {
                        // Handle Kategori error
                        if (kategoriInfoErr) {
                          return done(kategoriInfoErr);
                        }

                        // Set assertions
                        (kategoriInfoRes.body._id).should.equal(kategoriSaveRes.body._id);
                        (kategoriInfoRes.body.name).should.equal(kategori.name);
                        should.equal(kategoriInfoRes.body.user, undefined);

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
      Kategori.remove().exec(done);
    });
  });
});
