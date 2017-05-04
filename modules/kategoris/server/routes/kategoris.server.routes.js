'use strict';

/**
 * Module dependencies
 */
var kategorisPolicy = require('../policies/kategoris.server.policy'),
  kategoris = require('../controllers/kategoris.server.controller');

module.exports = function(app) {
  // Kategoris Routes
  app.route('/api/kategoris').all(kategorisPolicy.isAllowed)
    .get(kategoris.list)
    .post(kategoris.create);

  app.route('/api/kategoris/:kategoriId').all(kategorisPolicy.isAllowed)
    .get(kategoris.read)
    .put(kategoris.update)
    .delete(kategoris.delete);

  // Finish by binding the Kategori middleware
  app.param('kategoriId', kategoris.kategoriByID);
};
