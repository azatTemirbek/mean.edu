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
  var der = new Der(req.body);
  der.user = req.user;
  der.kategori = req.kategoris;
  console.log(req.body);
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
  Der.find().sort('-created')
    .populate('user kategoris', 'displayName profileImageURL job')
    .populate('kategoris')
    .exec(function(err, ders) {
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
 * List of searchDers
 */
exports.searchDers = function(req, res) {

  var clean=req.params.srch.replace(/[^a-zA-Z0-9]/g, '');
  Der.find({ $text: { $search: clean } })
    .sort('-created')
    .populate('kategoris', '_id')
    .exec(function(err, ders) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      else {
        res.jsonp(ders);
      }
    });
};

/**
 * Ders nearMap
 */
exports.nearMap = function (req, res) {
  var lat = req.params.lat;
  var lng = req.params.lng;
  var rad = req.params.rad;
  var gtex = lat-rad;
  var ltx = Number(lat)+Number(rad);
  var gtey = lng-rad;
  var lty = Number(lng)+Number(rad);

  // { $and: [
  //   { coords:lat: { $gte: gtex, $lt: ltx } },
  //   { coords:lng: { $gte: gtey, $lt: lty } } ]
  // }

  Der.find()
    .where('coords.lat').gt(gtex).lt(ltx)
    .where('coords.lng').gt(gtey).lt(lty)
    .exec(function (err, ders) {
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
        message: 'Boyle Bir Ders bulunamadi'
      });
    }
    req.der = der;
    next();
  });
};
