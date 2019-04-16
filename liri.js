require("dotenv").config();
var keys = require("./keys.js")
var Spotify = require('node-spotify-api');
var fs = require('fs')
var spotify = new Spotify(keys.spotify)
var song = process.argv.slice(3).join(" ")
if (!process.argv[3]){
   song = "The Sign"
}

var command = process.argv.slice(2,process.argv.length).join(" ")

fs.appendFile("./log.txt",`${command}, `, function(err){
   if(err){
      console.log(err)
   }
})

function spotifySearch(song){
   spotify.search({type: 'track', query: song})
      .then(function(response){

         for (i=0;i<10; i++){
            var artistResult = response.tracks.items[i].album.artists
            var track = response.tracks.items[i]
            var album = response.tracks.items[i].album.name

            console.log(`Artist: ${artistResult[0].name}`)
            console.log(`Title: ${track.name}`)
            console.log(`Preview link: ${track.preview_url}`)
            console.log(`Album: ${album} (Track no.${track.track_number})`)
            console.log('=====================')
      }
   })
}

/*===========================================================*/
var moment = require('moment')
var axios = require('axios')
var states = require('states-abbreviations')

function bandsintown(artist){
if (!artist){artist= process.argv.slice(3).join(" ");
}
let queryURL = "https://rest.bandsintown.com/artists/" 
   + artist 
   + "/events?app_id=codingbootcamp"

axios.get(queryURL).then(function(response){
  // console.log(queryURL)
  for (i = 0; i < response.data.length; i++){
     let datetime = response.data[i].datetime.split("T")
     let date = moment(datetime[0]).format("MM/DD/YYYY")
     let abbrev = response.data[i].venue.region;
     let stateName = states[abbrev]
     
     console.log(`Location: ${response.data[i].venue.city}`)
      if (abbrev){
         console.log(stateName)
      }
     
     console.log(`Date: ${date}`)

     console.log("===============================")
  }
})
}

/*===========================================================*/
function movieThis(movie){
   
   if (!movie){movie = process.argv.slice(3).join(" ")}
   if (!process.argv[3]){movie = "Mr.Nobody"}
   let queryURL = "http://www.omdbapi.com/?apikey=792d71a4&t=" + movie
   console.log(queryURL)
   axios.get(queryURL).then(function(response){
      var movieData = response.data
      console.log("----------------")
      console.log(`Title: ${movieData.Title}`)
      console.log(`Release Year: ${movieData.Year}`)
      console.log(`Rated: ${movieData.Rated}`)
      console.log(`${movieData.Ratings[1].Source} rating: ${movieData.Ratings[1].Value}`)
      console.log(`Produced in: ${movieData.Country}`)
      console.log(`Language: ${movieData.Language}`)
      console.log(`Plot: ${movieData.Plot}`)
      console.log(`Cast: ${movieData.Actors}`)
      console.log('-----------------')
   }).catch(function(err){
      //console.log(err)
   })
}

/*===========================================================*/
fs.readFile("random.txt", "utf8", function(error, data) {

  if (error) {
    return console.log(error);
  }
  var dataArr = data.split(",");
  var command = dataArr[0]
  if (process.argv[2] === 'do-what-it-says'){
      if (command === "spotify-this-song"){
      spotifySearch(dataArr[1])
      }
      else if (command === "movie-this"){
         movieThis(dataArr[1])
      }
      else if (command === "concert-this"){
         bandsintown(dataArr[1])
      }
  }
});

/*===========================================================*/
switch(process.argv[2]){
   case "spotify-this-song":
   spotifySearch(song)
   break;

   case "movie-this":
   movieThis()
   break;

   case "concert-this":
   bandsintown()
}