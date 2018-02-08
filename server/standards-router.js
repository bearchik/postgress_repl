const express = require('express');
const database = require('./standards-database');
const helpers = require('./helpers');

function StandardsRouter(config) {
  const router = express.Router();

  router.get('/', function (req, res) {
    return database.getStandards(config.database.options, function (err, standards) {
      if (err) {
        console.log(err);
        return helpers.sendError(res, 'Internal server error');
      }
      return helpers.sendSuccess(res, standards);
    });
  });

  router.get('/:id', function (req, res) {
    return database.getStandard(config.database.options, req.params.id, function (err, standard) {
      if (err)
        return helpers.sendError(res, 'Internal server error');
      else
        return helpers.sendSuccess(res, standard);
    });
  });

  router.post('/', function (req, res) {
    return database.add(config.database.options, req.body, function (err, standard) {
      if (err)
        return helpers.sendError(res, 'Internal server error');
      else
        return helpers.sendSuccess(res, standard);
    });
  });

  router.put('/:id', function (req, res) {
    return database.updateById(config.database.options, req.params.id, req.body, function (err, standard) {
      if (err)
        return helpers.sendError(res, 'Internal server error');
      else if (standard == null)
        return helpers.sendFail(res, 'Standard not found');
      else
        return helpers.sendSuccess(res, standard);
    });
  });

  router.delete('/:id', function (req, res) {
    return database.deleteStandard(config.database.options, req.params.id, function (err, standard) {
      if (err)
        return helpers.sendError(res, 'Internal server error');
      else if (standard != null)
        return helpers.sendFail(res, 'Standard not found');
      else
        return helpers.sendSuccess(res, null);
    });
  });

  router.use(function (req, res) {
    return helpers.sendWrongCommand(res);
  });

  return router;
}

module.exports = {
  StandardsRouter,
};
