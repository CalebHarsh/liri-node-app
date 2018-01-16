//node install functions
var fs = require("fs")
var client = require("./keys.js")
var request = require("request")

//Twitter Api Function
var runTwitter = function () {
  var parmas = { screen_name: "jackcarmichae17", count: 20 }
  client.twitterKeys.get('statuses/user_timeline', parmas, (err, tweets, res) => {
    
    logCommand("my-tweets")
    if (!err) {
      tweets.forEach(twet => {
        var input = "User: " + twet.user.name + "\nMessage: " + twet.text +
          "\n  -" + twet.user.screen_name + "\nCreated on " + twet.created_at.slice(0, 16)
        input += "\n================================="
        console.log(input)
        logCommand(input)
      })
      // console.log(tweets)
    }
  })
}

//Spotify Api function
var runSpotify = function (search) {
  if (!search) { search = "The Sign" }
  client.spotData.search({ type: 'track', query: 'track:"' + search + '"', limit: 5 }, (err, data) => {
    if (err) {
      return console.log("Error occured: " + err)
    }
    logCommand("spotify-this-song", search)
    data.tracks.items.forEach(element => {
      var music = "Artist: " + element.artists[0].name + "\nAlbum: " + element.album.name +
        "\nTitle: " + element.name + "\nSpotify Link: " + element.external_urls.spotify
      music +="\n================================================="
      console.log(music)
      logCommand(music)
    })
    // console.log(data)
  })
}

//omdb rquest data 
var runMovie = function (movie) {
  if (!movie) { movie = "Mr. Nobody" }

  request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece", function (err, resp, body) {
    if (!err && resp.statusCode === 200) {
      var omdbMovie = JSON.parse(body)

      // * Title of the movie.
      // * Year the movie came out.
      // * IMDB Rating of the movie.
      // * Rotten Tomatoes Rating of the movie.
      // * Country where the movie was produced.
      // * Language of the movie.
      // * Plot of the movie.
      // * Actors in the movie.

      var show = `Title: ${omdbMovie.Title}\nYear of Release: ${omdbMovie.Year}\nIMDB Rating: ${omdbMovie.imdbRating}\nRotten Tomatoes Rating: ${omdbMovie.Ratings[1].Value}`
        + `\nCountry: ${omdbMovie.Country}\nLanguages: ${omdbMovie.Language}\nPlot: ${omdbMovie.Plot}\nActors: ${omdbMovie.Actors}`
      console.log(show)
    }
    logCommand("movie-this", movie)
    logCommand(show)
  })

}

//running a pre-set command from another file
var randomCommand = function () {
  fs.readFile("random.txt", (err, data) => {
    if (err) { return console.log(err) }
    console.log(data.toString())
    logCommand(process.argv[2])
    var randComand = data.toString().split(",")
    switchCase(randComand[0], randComand[1])
  })
}

//re-routing data 
var switchCase = function (command, value) {
  console.log("");
  switch (command) {
    case "my-tweets":
      runTwitter()
      break;
    case "spotify-this-song":
      runSpotify(value)
      break;
    case "movie-this":
      runMovie(value)
      break;
    case "do-what-it-says":
      randomCommand()
      break;
    default:
      console.log("That is not one of the commands. Here are some commands you can ask")
      console.log("my-tweets")
      console.log("spotify-this-song '<song name here>'")
      console.log("movie-this '<movie name here>'")
      console.log("do-what-it-says")
      return
  }

}

//logging data and commands 
var logCommand = function (command, info) {
  if (!info) { info = "" } else { info = "," + info }
  fs.appendFile("log.txt", command + info + "\n\n", function (err) {
    if (err) { console.log(err) }
  })
}

//getting all the infomation
var search = process.argv[3]
for (var i = 4; i < process.argv.length; i++) {
  search += " " + process.argv[i]
}

//run command
switchCase(process.argv[2], search)