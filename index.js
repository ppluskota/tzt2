var cool = require('cool-ascii-faces');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var url = require('url');

var app = express();

var index = require('./routes/index');
var projects = require('./routes/projects');

app.set('port', (process.env.PORT || 5000));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/** Application parts use declaration **/
app.use('/', index);
app.use('/projects', projects);
app.use('/clients', projects);
//app.use('/workers', workers);
app.use(express.static(__dirname + '/stylesheets'));

/** Common error handle **/
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('pages/index')
});

module.exports = app;

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
