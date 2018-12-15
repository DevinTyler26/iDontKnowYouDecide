const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const config = require("config");
const http = require("http");
const yelp = require("yelp-fusion");

const client = yelp.client(config.get("apiKey"));

router.get("/", async (req, res) => {
  console.log(req.body);
  client
    .search({
      term: req.body.term,
      location: req.body.location || "Seattle" // this or option will be the location of the user if they do not supply one
    })
    .then(response => {
      let clientResponse = response.jsonBody.businesses;
      let len = clientResponse.length;
      let choice = Math.floor(Math.random(0, len) * 10);
      console.log(choice);
      res.send(clientResponse[choice]);
    })
    .catch(e => {
      console.log(e);
    });
});

module.exports = router;
