const { apiCall } = require('../utils/api');
var express = require('express');
var router = express.Router();

router.get('/all', async function(req, res, next) {
  try {
    let response = await apiCall('v1/standings/now');
    
    let teams = response.standings.map(item => ({
      id: item.teamAbbrev.default, 
      fullName: item.teamName.default,
      logo: item.teamLogo,
      conference: item.conferenceName,
      division: item.divisionName
    }));

    res.json(teams);
  } catch (error) {
    next(error);
  }
});

router.get('/:triCode', async function(req, res, next) {
  try {
    let triCode = req.params.triCode.toUpperCase();
    let data = await apiCall(`v1/roster/${triCode}/current`);
    
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/schedule/:triCode/:season', async function(req, res, next) {
  try {
    let { triCode, season } = req.params;
    let data = await apiCall(`v1/club-schedule-season/${triCode.toUpperCase()}/${season}`);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;