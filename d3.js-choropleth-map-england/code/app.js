var express = require('express');
var mustacheExpress = require('mustache-express');
var path = require('path');

var geomapsRoutes = require('./routes/geomaps');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use('lib', express.static(path.join(__dirname, 'frontendCode/lib')));
app.use('src', express.static(path.join(__dirname, 'frontendCode/src')));
// app.use(express.static(__dirname + '/public'));
// app.use('/lib',  express.static(__dirname + '/bower_components'));

app.use('/geomaps', geomapsRoutes);

// http://www.learnfast.ninja/posts/53a6b961d972e2e411bf82f2
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/public/views');

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log('>>> Stacktrace', err);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
