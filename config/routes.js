// routes
// =============

// require express
var express = require('express');


var router = express.Router();

// Scrape function from our scripts dir
var scrape = require('../scripts/scrape.js');

// bring Stories and characters from the controller
var StoriesController = require('../controllers/Stories.js');
var charactersController = require('../controllers/characters.js');

// basic route use cb... return json data from mongodb
router.get('/', function(req, res) {
    res.render('home');
});

//route for testing  scrape
router.get('/test', function(req,res) {
    // grab the story information from nytimes
    scrape("https://www.storyjumper.com/", function(data) {
        // send to browser as json
        res.json(data);
    });
});

// grab web scrape
router.post('/fetch', function(req, res) {
    // fetch function from the Stories controller,
    // this grabs all of the Stories from https://www.storyjumper.com/ and saves it to the db
    StoriesController.fetch();
    // send a success message to the browser
    res.send('success');
});

// check the mongodb for data
router.get('/check', function(req, res) {
    // use the check function from the Stories controller,
    // this checks all of our storys, sorted by id number
    StoriesController.check(function(data) {
        // send the story data to a json
        res.json(data);
    });
});

// gather the characters for an story from mongodb
router.post('/gather', function(req, res) {
    // gather all of the characters related to the story 
    charactersController.gather(req.body, function(data) {
        // and send the characters as a json
        res.json(data);
    });
});

// post our saved note to the db
router.post('/save', function(req, res) {
    // using the story information passed through req.body
    // and the save function from the characters controller
    // saved the note
    charactersController.save(req.body, function(data) {
        // send the note to the browser as a json
        res.json(data);
    });
});

// delete the characters of an story from mongodb
router.delete('/delete', function(req, res) {
    // using the charactersController and the story passed in req.body
    // delete all of an storys characters
    charactersController.delete(req.body, function(data) {
        // send the removal data to the browser as a json
        res.json(data);
    });
});

// export this router so our server file can refer to it.
module.exports = router;
