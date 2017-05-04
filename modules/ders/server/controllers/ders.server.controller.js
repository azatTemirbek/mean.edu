'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Der = mongoose.model('Der'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


/**
 * Create a Der
 */
exports.create = function(req, res) {
  console.log("create method called");
  var der = new Der(req.body);
  der.user = req.user;
  der.kategori = req.kategoris;
  // der.description = req.description;

  der.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(der);
    }
  });
};

/**
 * Show the current Der
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var der = req.der ? req.der.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  der.isCurrentUserOwner = req.user && der.user && der.user._id.toString() === req.user._id.toString();

  res.jsonp(der);
};

/**
 * Update a Der
 */
exports.update = function(req, res) {
  var der = req.der;

  der = _.extend(der, req.body);

  der.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(der);
    }
  });
};

/**
 * Delete an Der
 */
exports.delete = function(req, res) {
  var der = req.der;

  der.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(der);
    }
  });
};

/**
 * List of Ders
 */
exports.list = function(req, res) {
  Der.find().sort('-created').populate('user kategoris', 'displayName profileImageURL job').populate('kategoris').exec(function(err, ders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ders);
    }
  });
};

/**
 * Der middleware
 */
exports.derByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Der is invalid'
    });
  }

  Der.findById(id).populate('user kategoris', 'displayName profileImageURL job').populate('kategoris').exec(function (err, der) {
    if (err) {
      return next(err);
    } else if (!der) {
      return res.status(404).send({
        message: 'No Der with that identifier has been found'
      });
    }
    req.der = der;
    next();
  });
};
