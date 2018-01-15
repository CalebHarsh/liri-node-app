var Spotify = require("node-spotify-api")
console.log("Spotify is loaded.")

var spotData = new Spotify({
  id: "2c3c3a58d51b4519975b5fb8d591a2f1",
  secret: "03f09a92d3504f63a688462d3a2189da"
})

module.exports = spotData