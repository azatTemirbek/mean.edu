'use strict';

/**
 * Module dependencies
 */
var sayfalarsPolicy = require('../policies/sayfalars.server.policy'),
  sayfalars = require('../controllers/sayfalars.server.controller');

module.exports = function(app) {
  // Sayfalars Routes
  app.route('/api/sayfalars').all(sayfalarsPolicy.isAllowed)
    .get(sayfalars.list)
    .post(sayfalars.create);

  app.route('/api/sayfalars/:sayfalarId').all(sayfalarsPolicy.isAllowed)
    .get(sayfalars.read)
    .put(sayfalars.update)
    .delete(sayfalars.delete);

  app.route('/api/sayfalarsF/:uzanti').all(sayfalarsPolicy.isAllowed)
    .get(sayfalars.frontread);

  // app.param('uzanti', sayfalars.FsayfalarByID);

  // Finish by binding the Sayfalar middleware
  app.param('sayfalarId', sayfalars.sayfalarByID);
};
