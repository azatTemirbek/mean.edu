'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Kategori = mongoose.model('Kategori'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Kategori
 */
exports.create = function(req, res) {
  var kategori = new Kategori(req.body);
  kategori.user = req.user;

  kategori.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(kategori);
    }
  });
};

/**
 * Show the current Kategori
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var kategori = req.kategori ? req.kategori.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  kategori.isCurrentUserOwner = req.user && kategori.user && kategori.user._id.toString() === req.user._id.toString();

  res.jsonp(kategori);
};

/**
 * Update a Kategori
 */
exports.update = function(req, res) {
  var kategori = req.kategori;

  kategori = _.extend(kategori, req.body);

  kategori.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(kategori);
    }
  });
};

/**
 * Delete an Kategori
 */
exports.delete = function(req, res) {
  var kategori = req.kategori;

  kategori.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(kategori);
    }
  });
};

/**
 * List of Kategoris
 */
exports.list = function(req, res) {
  Kategori.find().sort('-created').populate('user', 'displayName').exec(function(err, kategoris) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(kategoris);
    }
  });
};

/**
 * Kategori middleware
 */
exports.kategoriByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Kategori is invalid'
    });
  }

  Kategori.findById(id).populate('user', 'displayName').exec(function (err, kategori) {
    if (err) {
      return next(err);
    } else if (!kategori) {
      return res.status(404).send({
        message: 'No Kategori with that identifier has been found'
      });
    }
    req.kategori = kategori;
    next();
  });
};
