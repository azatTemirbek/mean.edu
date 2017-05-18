'use strict';

/**
 * Module dependencies
 */
var dersPolicy = require('../policies/ders.server.policy'),
  ders = require('../controllers/ders.server.controller');

module.exports = function(app) {
  // Ders Routes
  app.route('/api/ders').all(dersPolicy.isAllowed)
    .get(ders.list)
    .post(ders.create);

  app.route('/api/ders/:derId').all(dersPolicy.isAllowed)
    .get(ders.read)
    .put(ders.update)
    .delete(ders.delete);

  app.route('/api/ders/:lat/:lng/:rad')
    .get(ders.nearMap);

  // Finish by binding the Der middleware
  app.param('derId', ders.derByID);
};
