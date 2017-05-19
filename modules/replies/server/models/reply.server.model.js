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
  created: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    required: true,
    default: 1,
    min: [1, 'En az bir yildiz seçmelisin!'],
    max: 10
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
