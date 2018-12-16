const _ = require("lodash");
const express = require("express");
const router = express.Router();
const http = require("http");
const yelp = require("yelp-fusion");

const client = yelp.client(process.env.apiKey);

router.get("/", async (req, res) => {
  const { term, location } = req.body;
  const search = {
    term,
    radius: 10000,
    limit: 50,
    open_now: true
  };
  if (location) {
    search.location = location;
  } else {
    console.log("No Location Provided, using user location");
    search.latitude = req.lat || 47.570475;
    search.longitude = req.long || -122.020556;
  }
  console.log("Searchhhhhhhhhhh", search);
  client
    .search(search)
    .then(response => {
      let clientResponse = response.jsonBody.businesses;
      let len = clientResponse.length;
      if (len === 0) {
        console.log("No Locations");
        res.send("No Locations");
        return;
      }
      let choice = Math.floor(Math.random() * (len - 0 + 1) + 0);
      let miles = clientResponse[choice].distance * 0.00062137;
      console.log("------------------------------------------");
      console.log(`
      Picked:  ${clientResponse[choice].name}
      Miles Away: ${miles}
      Options Length: ${len}
      Options Choice Number: ${choice}
      `);
      console.log("------------------------------------------");
      res.send(clientResponse[choice]);
    })
    .catch(e => {
      console.log(e);
      res.send(e);
    });
});

module.exports = router;
