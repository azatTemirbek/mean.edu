'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Sayfalar Schema
 */
var SayfalarSchema = new Schema({
  baslik: {
    type: String,
    default: '',
    required: 'Başlık yazın',
    trim: true
  },
  uzanti: {
    type: String,
    default: '',
    required: 'uzantı yazın',
    trim: true
  },
  resimurl: {
    type: String,
    default: '',
    trim: true
  },
  icerik: {
    type: String,
    default: '',
    required: 'İçerik yazın',
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

mongoose.model('Sayfalar', SayfalarSchema);
