'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Sayfalars Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/sayfalars',
      permissions: '*'
    }, {
      resources: '/api/sayfalars/:sayfalarId',
      permissions: '*'
    }]
  }, {
    roles: ['teacher'],
    allows: [{
      resources: '/api/sayfalars',
      permissions: ['get', 'post']
    }, {
      resources: '/api/sayfalars/:sayfalarId',
      permissions: ['get']
    }, {
      resources: '/api/sayfalarsF/:uzanti',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/sayfalars',
      permissions: ['get']
    }, {
      resources: '/api/sayfalars/:sayfalarId',
      permissions: ['get']
    }, {
      resources: '/api/sayfalarsF/:uzanti',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Sayfalars Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Sayfalar is being processed and the current user created it then allow any manipulation
  if (req.sayfalar && req.user && req.sayfalar.user && req.sayfalar.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
