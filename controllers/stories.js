// controller for our headlines
// ============================

// bring in our scrape script and makeDate scripts
var scrape = require('../scripts/scrape.js');
var makeDate = require('../scripts/date.js');

// bring in the Headline and Note mongoose models
var Headline = require('../models/Headline');
var Note = require('../models/Note');


// export this function as "fetch"
exports.fetch = function() {

  // run scrape function
  scrape("http://www.nytimes.com", function(data) {
    // save the data from scrape to obj
    var obj = data;

    // create a user-readable date with our makeDate script
    var formattedDate = makeDate();

    // loop over object's results 
    for (var i in obj) {
      // checks for duplicates. See the definition of this function below
      addIfNotFound(i);
    }

    // check to see if entry exists, and add if it to our db if it does not
    // note, current is the iterator
    function addIfNotFound(current) {
      // look for a match by the headline of the current article
      Headline.findOne({
        'headline': obj[current][0]
      }, function(err, res) {
        // log any errors
        if (err) {
          console.log(err);
        }
        // or, if there is no match (and thus no duplicate)
        if (res === null) {
          // create a new entry object using our Headline model
          var headlineEntry = new Headline({
            headline: obj[current][0],
            summary: obj[current][1],
            date: formattedDate
          });
          // save new entry to db
          headlineEntry.save(function(err) {
            // log any errors
            if (err) {
              console.log(err);
            } 
            // or tell the console we added the article succesffuly
            else {
              console.log('successfully added');
            }
          });
        }
      });
    }

  });
};

// export this function as "check" (cb is a callback function)
exports.check = function(cb) {
  // prepare a query to get the data we scraped, 
  // and sort starting from most recent (sorted by id num)
  Headline.find()
    .sort({
      _id: -1
    })
    // execute this query
    .exec(function(err, doc) {
      // once finished, pass the list into the callback function
      cb(doc);
    });


// images from giphy to storybook

$(function() {
    //do on page load
    populateButtons(choices, 'choiceButton', '#choiceButtons');
});

var choices = ["dog", "beach", "hiking", "hammer", "skunk", "football", "fire", "magic", "frog"];

//function to make buttons and add to page
function populateButtons(arrayToUse, classToAdd, areaToAddTo){
    $(areaToAddTo).empty();

    for (var i = 0; i < arrayToUse.length; i++){
        var a = $('<button>')
        a.addClass(classToAdd);
        a.attr('data-type', arrayToUse[i]);
        a.text(arrayToUse[i]);
        $(areaToAddTo).append(a);
    }

}

$(document).on('click', '.choiceButton', function(){
    $('#choices').empty();
    $('.choiceButton').removeClass('active');
    $(this).addClass('active');

    var type = $(this).data('type');
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + type + "&api_key=dc6zaTOxFJmzC&limit=10";

    $.ajax({url: queryURL, method: 'GET'})
     .done(function(response) {
         var results = response.data;

         for(var i=0; i < results.length; i++){
             var choiceDiv = $('<div class="choice-item">')

             var rating = results[i].rating;

             var p = $('<p>').text( "Rating: " + rating);

             var animated = results[i].images.fixed_height.url;
             var still = results[i].images.fixed_height_still.url;

             var choiceImage = $('<img>');
             choiceImage.attr('src', still);
             choiceImage.attr('data-still', still);
             choiceImage.attr('data-animate', animated);
             choiceImage.attr('data-state', 'still')
             choiceImage.addClass('choiceImage');

             choiceDiv.append(p)
             choiceDiv.append(choiceImage)

             $('#choices').append(choiceDiv);
         }
        
    }); 
});

$(document).on('click', '.choiceImage', function(){
    var state = $(this).attr('data-state'); 
    
    if ( state == 'still'){
        $(this).attr('src', $(this).data('animate'));
        $(this).attr('data-state', 'animate');
    }else{
        $(this).attr('src', $(this).data('still'));
        $(this).attr('data-state', 'still');
    }
})

$('#addChoice').on('click', function(){
    var newChoice = $('input').eq(0).val();

    if (newChoice.length > 2){
        choices.push(newChoice);
    }

    populateButtons(choices, 'choiceButton', '#choiceButtons');

    return false;
});
};
