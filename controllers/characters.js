// controller for our Characterss
// ========================

// get the date formatting function from out scripts
var makeDate = require('../scripts/date.js');
// take in our Story and Characters mongoose models
var Story = require('../models/Story');
var Characters = require('../models/Characters');

// save a Characters
// export this function as "save" (data = Characters info, cb = callback)
exports.save = function(data, cb) {
  
  // create a formatted date
  var formattedDate = makeDate();

  // make a newCharacter with the Characters model, saving the apropos info
  var newCharacter = new Characters ({
    _StoryId:data.id,
    date:data.date,
    CharactersText:data.Characters
  });

  // save the newCharacter we made to mongoDB with mongoose's save function
  newCharacter.save(function(err, doc){
    // log any errors
    if (err) {
      console.log(err);
    } 
    // or just log the doc we saved
    else{
      console.log(doc);
      // and place the log back in this callback function
      // so it can be used with other functions asynchronously
      cb(doc);
    }
  });
};

// gather Characterss for a news article.
// export this function as gather (cb = callback, data = an article obj)
exports.gather = function(data, cb) {
  // find all Characterss with the Story id from the article we passed
  Characters.find({
    _StoryId: data.id
  })
  // and sort the results
  .sort({
    id: -1
  })
  // now, execute this query
  .exec(function(err, doc) {
    // pass the data to our callback 
    // so it can be used asynchronously
    cb(doc);
  });
};

// delete all Characterss from an article
// Export this function as delete (data = article, cb = callback)
exports.delete = function(data, cb) {
  // remove a Characters using mongoose and our Characters Model,
  // searching by the article's id
  Characters.remove({
    _StoryId:data.id
  }, function(err, removed){
    // log any errors
    if(err){
      console.log(err);
    } 
    // or tell the console the delete was successful
    else {
      console.log("Bye bye");
      // and send the "removed" data to our callback function
      cb(removed);
    }
  });
};
