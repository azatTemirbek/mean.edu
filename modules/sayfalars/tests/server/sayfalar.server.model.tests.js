'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Sayfalar = mongoose.model('Sayfalar');

/**
 * Globals
 */
var user,
  sayfalar;

/**
 * Unit tests
 */
describe('Sayfalar Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      sayfalar = new Sayfalar({
        name: 'Sayfalar Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return sayfalar.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      sayfalar.name = '';

      return sayfalar.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Sayfalar.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
