const { apiCall } = require('../utils/api');
var express = require('express');
var router = express.Router();

router.get('/score/now', async function(req, res, next) {
  try {
    let data = await apiCall('v1/score/now', 30000); // 30 seconds TTL for live scores
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/game/:gameId/landing', async function(req, res, next) {
  try {
    let { gameId } = req.params;
    let data = await apiCall(`v1/gamecenter/${gameId}/landing`, 30000); // 30s TTL
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/game/:gameId/boxscore', async function(req, res, next) {
  try {
    let { gameId } = req.params;
    // Provide a small TTL (30s) to avoid spamming the official NHL API while still allowing live stats
    let data = await apiCall(`v1/gamecenter/${gameId}/boxscore`, 30000);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;