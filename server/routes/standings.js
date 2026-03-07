const { apiCall } = require('../utils/api');
var express = require('express');
var router = express.Router();

router.get('/', async function(req, res, next) {
  try {
    let data = await apiCall('v1/standings/now');
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;