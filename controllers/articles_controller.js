var axios = require("axios");
var cheerio = require("cheerio");
var express = require("express");
var request = require("request");

var router = express.Router();
// Require all models
var db = require("../models");

// Scrape data from one site and place it into the mongodb db
router.get("/scrape", function(req, res) {
    // Make a request for the news section of `ycombinator`
    request("http://www.healthdata.org/results/data-visualizations", function(error, response, html) {
      // Load the html body from request into cheerio
      var $ = cheerio.load(html);

      // For each element with a "title" class
      $("div.views-row").each(function(i, element) {

        // Save the text and href of each link enclosed in the current element
        var title = $(element).children(".summary-info").children(".views-field-title").text();
        var date = $(element).children(".summary-info").children(".views-field-field-publication-date").text();
        var summary = $(element).children(".summary-info").children(".views-field-body").text();
        var imageURL = $(element).children(".views-field").children(".field-content").children("a").text();
          imageURL = imageURL.split("\"");
          imageURL = imageURL[3];
        var vizURL = $(element).children(".views-field").children(".field-content").children("a").attr("href");
        // Build `result` object
        var result = {
          title: title,
          date: date,
          summary: summary,
          imageURL: imageURL,
          vizURL: vizURL
        }
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          // console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
      });

    });
  
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
  });

  // Route for getting all Articles from the db
router.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      var hbsObject = {
        articles: dbArticle
      };
      res.render("index", hbsObject);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.get("/saved", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      var hbsObject = {
        articles: dbArticle
      };
      res.render("saved", hbsObject);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.get("/", function(req, res) {
  res.redirect("/articles");
});

  // Export routes for server.js to use.
module.exports = router;