//Web Scraper //

// Required dependencies
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');

// Instantiate Express App
var app = express();

// Designate public folder as a static directory
app.use(express.static(__dirname + '/public'));

// connect Handlebars to Express app
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// use bodyParser in app
app.use(bodyParser.urlencoded({
    extended: false
}));


// Save MongoDB directory to a db var
var db = 'mongodb://localhost/mongoHeadlines';

// Connect that directory to Mongoose, for simple, powerful querying
mongoose.connect(db, function(err){
	// log any errors connecting with mongoose
  if(err){
    console.log(err);
  } 
  // or log a success message
  else {
    console.log('mongoose connection is established');
  }
});

// bring in routes file into the the server files
var routes = require('./config/routes.js');

// Incorporate these routes into app
app.use('/', routes);
app.use('/test', routes);
app.use('/fetch', routes);
app.use('/gather', routes);
app.use('/check', routes);
app.use('/save', routes);
app.use('/delete', routes);


// set up port to be either the host's designated port, or 3000
var port = process.env.PORT || 3000;

// set app to listen on the port.
app.listen(port, function() {
    console.log("lisenting on port:" + port);
});
