

  require("dotenv").config();
var fs = require("fs");
var request = require('request');

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var chalk = require('chalk');

var command = process.argv[2];
var parameter = process.argv[3];



function switchCase() {

  switch (command) {

    case 'concert-this':
      bandsInTown(parameter);                   
      break;                          

    case 'spotify-this-song':
      spotifySong(parameter);
      break;

    case 'movie-this':
      omdbInfo(parameter);
      break;

    case 'do-what-it-says':
      getRandom();
      break;

      default:                            
      display("Invalid. Does not compute. Self-destructing in 3..2..1..");
      break;

  }
};

//BANDS IN TOWN

function bandsInTown(parameter){

if ('concert-this')
{
	var artist="";
	for (var i = 3; i < process.argv.length; i++)
	{
		artist+=process.argv[i];
    }

	// console.log(artist);
}
else
{
	artist = parameter;
}



var queryUrl = "https://rest.bandsintown.com/artists/"+ artist +"/events?app_id=codingbootcamp";


request(queryUrl, function(error, response, body) {

  if (!error && response.statusCode === 200) {

    var JS = JSON.parse(body);
    for (i = 0; i < JS.length; i++)
    {
      var dateTime = JS[i].datetime;
        var month = dateTime.substring(5,7);
        var year = dateTime.substring(0,4);
        var day = dateTime.substring(8,10);
        var dateForm = month + "/" + day + "/" + year
  
      display(chalk.blue("\n---------------------------------------------------\n"));
      display(chalk.green("Name: " + JS[i].venue.name));
      display(chalk.green("City: " + JS[i].venue.city));
      if (JS[i].venue.region !== "")
      {
        display(chalk.green("Country: " + JS[i].venue.region));
      }
      display(chalk.green("Country: " + JS[i].venue.country));
      display(chalk.green("Date: " + dateForm));
      display(chalk.blue("\n---------------------------------------------------\n"));

    }
  }
});
}

//SPOTIFY


function spotifySong(parameter) {

 //  If no song is provided then your program will default to "The Sign" by Ace of Base.
  var searchTrack;
  if (parameter === undefined) {
    searchTrack = "Ace of Base The Sign";
  } else {
    searchTrack = parameter;
  }

  

  spotify.search({
    type: 'track',
    query: searchTrack
  }, function(error, data) {
    
    if (error) {
      display('Error recorded: ' + error);
      return;
    }  else {
      for (i = 0; i < data.tracks.items.length && i < 5; i++){
      
          var musicQuery = data.tracks.items[i];
          // console.log("===============================");
           // * Artist(s)
          console.log("Artist: " + musicQuery.artists[0].name +
          // * The song's name
          "\nSong Name: " + musicQuery.name +
          //* A preview link of the song from Spotify
          "\nLink to Song: " + musicQuery.preview_url +
          //* The album that the song is from
          "\nAlbum Name: " + musicQuery.album.name +
          "\n===============================");
      }
  };  
});
}
//OMDB

function omdbInfo(parameter) {


  var findMovie;
  if (parameter === undefined) {
    findMovie = "Mr. Nobody";
  } else {
    findMovie = parameter;
  };

  

  var queryUrl = "http://www.omdbapi.com/?t=" + findMovie + "&y=&plot=short&apikey=trilogy";
  
  request(queryUrl, function(err, res, body) {
  	var bodyOf = JSON.parse(body);
    if (!err && res.statusCode === 200) {
      display(chalk.blue("\n---------------------------------------------------\n"));
      display(chalk.green("Title: " + bodyOf.Title));
      display(chalk.green("Release Year: " + bodyOf.Year));
      display(chalk.green("IMDB Rating: " + bodyOf.imdbRating));
      display(chalk.green("Rotten Tomatoes Rating: " + bodyOf.Ratings[1].Value)); 
      display(chalk.green("Country: " + bodyOf.Country));
      display(chalk.green("Language: " + bodyOf.Language));
      display(chalk.green("Plot: " + bodyOf.Plot));
      display(chalk.green("Actors: " + bodyOf.Actors));
      display(chalk.blue("\n---------------------------------------------------\n"));
    }
  });
};

//DO WHAT RANDOM.TXT SAYS

function getRandom() {

   
 fs.readFile('random.txt', "utf8", function(error, data){

    if (error) {
        return display(error);
      }

  
    var dataArr = data.split(",");
    
    if (dataArr[0] === "spotify-this-song") {
        
      var songcheck = dataArr[1].trim().slice(1, -1);
      spotifySong(songcheck);
    } 
   
    });

};

//SEND TO LOG.TXT

function display(dataToLog) {

	console.log(dataToLog);

	fs.appendFile('log.txt', dataToLog + '\n', function(err) {
		
		if (err) return display('Error logging data to file: ' + err);	
	});
}


switchCase();