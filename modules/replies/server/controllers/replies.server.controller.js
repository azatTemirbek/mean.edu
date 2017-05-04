'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Reply = mongoose.model('Reply'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Reply
 */
exports.create = function(req, res) {
  var reply = new Reply(req.body);
  reply.user = req.user;
  console.log(req.body);
  reply.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reply);
    }
  });
};

/**
 * Show the current Reply
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var reply = req.reply ? req.reply.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  reply.isCurrentUserOwner = req.user && reply.user && reply.user._id.toString() === req.user._id.toString();

  res.jsonp(reply);
};

/**
 * Update a Reply
 */
exports.update = function(req, res) {
  var reply = req.reply;

  reply = _.extend(reply, req.body);

  reply.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reply);
    }
  });
};

/**
 * Delete an Reply
 */
exports.delete = function(req, res) {
  var reply = req.reply;

  reply.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reply);
    }
  });
};

/**
 * List of Replies
 */
exports.list = function(req, res) {
  Reply.find().sort('-created').populate('user', 'displayName').exec(function(err, replies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(replies);
    }
  });
};

/**
 * Reply middleware
 */
exports.replyByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Reply is invalid'
    });
  }

  Reply.findById(id).populate('user', 'displayName').exec(function (err, reply) {
    if (err) {
      return next(err);
    } else if (!reply) {
      return res.status(404).send({
        message: 'No Reply with that identifier has been found'
      });
    }
    req.reply = reply;
    next();
  });
};

exports.listWithParams = function(req, res) {
  Reply.find({ dersId: req.params.replyDerId })
    .sort('-created')
    .populate('user', 'displayName profileImageURL')
    .exec(function (err, replies) {
      if(err){
        return res.status(400).send({
          message: 'Yorum bulunamadi'
        });
      }else{
        res.jsonp(replies);
      }
    });

};

