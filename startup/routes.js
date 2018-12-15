const express = require("express");
const error = require("../middleware/error");
const query = require("../routes/query");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/query", query);
  app.use(error);
};
