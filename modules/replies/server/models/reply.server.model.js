'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Reply Schema
 */
var ReplySchema = new Schema({
  contentR: {
    type: String,
    default: '',
    required: 'Please fill Reply name',
    trim: true
  },
  name: {
    type: String,
    default: '',
    required: 'Please fill Reply name',
    trim: true
  },
  email: {
    type: String,
    default: '',
    required: 'Please fill Reply name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  dersId: {
    type: Schema.ObjectId,
    ref: 'Der'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Reply', ReplySchema);
