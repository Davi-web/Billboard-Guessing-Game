// let express = require("Express");
// let router = express.Router();
// const request = require("request");
// const cheerio = require("Cheerio");
// let pictures = [];

// request("https://www.billboard.com/charts/hot-100", (error, response, html) => {
//   if (!error && response.statusCode == 200) {
//     const $ = cheerio.load(html);

//     const chartList = $(".chart-list__elements");
//     // const output = chartList.children("li").text().replace(/\s\s+/g, " ");

//     const output = chartList
//       .children("#chart-element__image flex--no-shrink")
//       .css("background-image");
//     const array = output.split("\n");
//     let billBoardsArray = [];
//     console.log(output);
//     // const result = array.filter(
//     //   (word) =>
//     //     word != "" &&
//     //     word != "-" &&
//     //     word != "+" &&
//     //     isNaN(word) &&
//     //     !word.includes("Failing") &&
//     //     !word.includes("Rising") &&
//     //     !word.includes("New") &&
//     //     !word.includes("Last Week") &&
//     //     !word.includes("Peak Rank") &&
//     //     !word.includes("Weeks on Chart")
//     // );

//     // for (let i = 0; i < result.length; i += 2) {
//     //   let song = result[i] + " by " + result[i + 1];
//     //   songs.push(song);
//     //   console.log(song);
//     // }
//   }
// });

// // router.get("/", function (req, res, next) {
// //   res.send(songs);
// // });

// module.exports = router;
