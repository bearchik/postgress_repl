const express = require("express");

const helpers = require("./helpers");

const standardsRouter = require("./standards-router");

function ApiRouter(config) {
  const router = express.Router();

  router.use("/standards", standardsRouter.StandardsRouter(config));

  router.use(function (req, res) {
    return helpers.sendWrongCommand(res);
  });

  return router;
}

module.exports = {
  ApiRouter
};
