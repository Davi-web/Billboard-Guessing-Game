let express = require("Express");
let router = express.Router();
const request = require("request");
const cheerio = require("Cheerio");
let songs = [];
let artists = [];
let data = [];

request("https://www.billboard.com/charts/hot-100", (error, response, html) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);

    const chartList = $(".chart-list__elements");
    $(".chart-element__information").each((index, element) => {
      const song = $(element).children().html();
      const artist = $(element).children().next().html();

      songs.push(song);
      artists.push(artist);
    });

    if (songs.length == artists.length && songs.length == 100) {
      for (let i = 0; i < 100; ++i) {
        data.push({ rank: i + 1, song: songs[i], artist: artists[i] });
      }
    } else {
      console.log("Error getting all songs");
    }
  }
  console.log(data.length);
});

router.get("/", function (req, res) {
  res.send(data);
  res.end();
});

module.exports = router;
