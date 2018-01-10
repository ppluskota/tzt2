var express = require('express');
var bodyParser = require('body-parser');
var stringify = require('json-stringify-safe');
var mongoose = require('mongoose');
var Project = require('../models/projects_model.js');
var url = require('url');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var urlencodedParser = bodyParser.urlencoded({extended: true});
var router = express.Router();
var mongoDbURL = "mongodb://pawko:asd123@ds245687.mlab.com:45687/tzt02";

mongoose.connect(mongoDbURL);

mongoose.connection.on("connected",function(database){
    console.log('connected');
});

router.get('/', function (req, res, next) {
    var data = {};
    Project.find(function(error, result) {
      data.items = result;
      res.render('projects_list', data);
    });
});

router.get('/add', function (req, res) {
    res.render('projects_add', {project: {}});
});

router.post('/add',function(req,res) {
  if (req.body.project_id) {
    var update_project = new Project({
      _id : req.body.project_id,
      nazwa : req.body.project_nazwa,
      zakonczony : req.body.project_ukonczono,
      opis : req.body.project_opis,
      zleceniodawca : req.body.project_zleceniodawca,
      platformy : req.body.project_platformy,
      budzet : req.body.project_budzet,
      data_utworzenia : req.body.project_data_utworzenia,
      deadline : req.body.project_deadline,
      procent_ukonczenia : req.body.project_poziom_ukonczenia,
      wersja: "1.0"
    });

    Project.update({_id: req.body.project_id }, {$set: update_project});
    res.redirect('/projects');

  } else {
    var new_project = new Project({
      _id : Math.floor((Math.random()*100000)),
      nazwa : req.body.project_nazwa,
      zakonczony : req.body.project_ukonczono,
      opis : req.body.project_opis,
      zleceniodawca : req.body.project_zleceniodawca,
      platformy : req.body.project_platformy,
      budzet : req.body.project_budzet,
      data_utworzenia : req.body.project_data_utworzenia,
      deadline : req.body.project_deadline,
      procent_ukonczenia : req.body.project_poziom_ukonczenia,
      wersja: "1.0"
    });

    new_project.save(function (err, results) {
      console.log(results._id);
      res.redirect('/projects');
    });
  }
 });

router.get('/:id/remove', function (req, res, next) {
  var current_id = req.param('id')
  console.log(current_id);

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  Project.remove({ _id: current_id }, function(err) {
    res.redirect('/projects');
    console.log("removed");
})
});

router.get('/:id/edit', function (req, res, next) {
  var current_id = req.param('id')
  console.log(current_id);

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  Project.findOne({"_id": current_id}, function (err, result) {
      var data = {};
      var project = {};
      project._id  = result._id;
      project.nazwa = result.nazwa;
      project.zakonczony = result.zakonczony;
      project.opis = result.opis;
      project.zleceniodawca = result.zleceniodawca;
      project.budzet = result.budzet;
      project.data_utworzenia = result.data_utworzenia;
      project.deadline = result.deadline;
      project.procent_ukonczenia = result.procent_ukonczenia;
      project.platformy = result.platformy;

      res.render('projects_add', {project: project});
  });
});

module.exports = router;
