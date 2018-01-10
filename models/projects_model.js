var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectModel = mongoose.model('projects', new Schema({
  _id: Number,
  nazwa: String,
  zakonczony: Boolean,
  opis: String,
  zleceniodawca: String,
  platformy: Array,
  budzet: Number,
  data_utworzenia: String,
  deadline: String,
  procent_ukonczenia: Number,
  wersja: String
}));

module.exports = projectModel;
