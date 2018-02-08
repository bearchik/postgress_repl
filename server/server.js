const express = require("express");
const path = require('path');
const config = require("./config");
const helpers = require("./helpers");
const apiRouter = require("./api-router");
const cors = require('cors');

const server = express();

// log all incoming requests
server.use(function (req, res, next) {
  helpers.log(req.method + " " + req.originalUrl);
  return next();
});

server.use(express.static('public'));

// Set CORS headers
server.use(cors());

// parse request body
server.use(helpers.parseBody);

// handle our core requests
server.use("/api", apiRouter.ApiRouter(config));


server.use(function (req, res) {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

helpers.log("listening at port: " + config.server.port);

if (config.server.host == null)
  server.listen(config.server.port);
else
  server.listen(config.server.port, config.server.host);

