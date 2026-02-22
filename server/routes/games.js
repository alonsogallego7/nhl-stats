const { apiCall } = require('../utils/api');
var express = require('express');
var router = express.Router();

router.get('/score/now', async function(req, res, next) {
  try {
    let data = await apiCall('v1/score/now');
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/game/:gameId/landing', async function(req, res, next) {
  try {
    let { gameId } = req.params;
    let data = await apiCall(`v1/gamecenter/${gameId}/landing`); // Gets detailed summary and boxscore of a specific game
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;