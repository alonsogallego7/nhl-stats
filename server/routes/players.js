const { apiCall } = require('../utils/api');

var express = require('express');
var router = express.Router();

router.get('/player/:id', async function(req, res, next) {
  try {
    let playerId = req.params.id;
    let data = await apiCall(`v1/player/${playerId}/landing`);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
