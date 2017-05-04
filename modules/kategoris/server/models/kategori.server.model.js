'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  uniqueValidator = require('mongoose-unique-validator');

/**
 * Kategori Schema
 */
var KategoriSchema = new Schema({
  name: {
    type: String,
    default: '',
    unique: true,
    required: 'Kategory Girin Lütfen',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

KategoriSchema.plugin(uniqueValidator);
mongoose.model('Kategori', KategoriSchema);
