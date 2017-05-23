'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Der Schema
 */
// TODO +img url array validate url

var DerSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Lütfen İsim verin',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Lütfen Açıklama Verin',
    trim: true
  },
  kategoris: [{
    type: Schema.ObjectId,
    ref: 'Kategori',
    required: 'Lütfen Kategori Seçin',
    index: true,
    min: 1
  }],
  comment: [{
    type: String,
    default: '',
    index: true,
    trim: true
  }],
  coords: {
    lat: {
      type: Number
    },
    lng:{
      type: Number
    },
    zoom:{
      type: Number,
      default: 10
    }
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
// ApplyDerSchema the uniqueValidator plugin
DerSchema.index({ 'description': 'text','name': 'text'});
mongoose.model('Der', DerSchema);
