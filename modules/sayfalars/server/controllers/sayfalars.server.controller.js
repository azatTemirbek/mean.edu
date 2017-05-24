'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Sayfalar = mongoose.model('Sayfalar'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Sayfalar
 */
exports.create = function(req, res) {
  var sayfalar = new Sayfalar(req.body);
  sayfalar.user = req.user;

  sayfalar.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sayfalar);
    }
  });
};

/**
 * Show the current Sayfalar
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var sayfalar = req.sayfalar ? req.sayfalar.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  sayfalar.isCurrentUserOwner = req.user && sayfalar.user && sayfalar.user._id.toString() === req.user._id.toString();

  res.jsonp(sayfalar);
};





/**
 * Update a Sayfalar
 */
exports.update = function(req, res) {
  var sayfalar = req.sayfalar;

  sayfalar = _.extend(sayfalar, req.body);

  sayfalar.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sayfalar);
    }
  });
};

/**
 * Delete an Sayfalar
 */
exports.delete = function(req, res) {
  var sayfalar = req.sayfalar;

  sayfalar.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sayfalar);
    }
  });
};

/**
 * List of Sayfalars
 */
exports.list = function(req, res) {
  Sayfalar.find().sort('-created').populate('user', 'displayName').exec(function(err, sayfalars) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(sayfalars);
    }
  });
};

/**
 * Sayfalar middleware
 */
exports.sayfalarByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Sayfalar is invalid'
    });
  }

  Sayfalar.findById(id).populate('user', 'displayName').exec(function (err, sayfalar) {
    if (err) {
      return next(err);
    } else if (!sayfalar) {
      return res.status(404).send({
        message: 'No Sayfalar with that identifier has been found'
      });
    }
    req.sayfalar = sayfalar;
    next();
  });
};

exports.frontread = function(req, res) {
  console.log(req.params.uzanti);
  Sayfalar.findOne({ uzanti: req.params.uzanti })
    .populate('user', 'displayName')
    .exec(function (err, sayfalar) {
    if (!sayfalar || err) {
      return res.status(404).send({
        message: 'No Sayfalar with that identifier has been found'
      });
    }
    sayfalar = sayfalar ? sayfalar.toJSON() : {};
    sayfalar.isCurrentUserOwner = req.user && sayfalar.user && sayfalar.user._id.toString() === req.user._id.toString();
    res.jsonp(sayfalar);
    });
};
