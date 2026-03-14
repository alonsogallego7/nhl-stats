const { apiCall } = require('../utils/api');
var express = require('express');
var router = express.Router();

const teamColors = {
  ANA: '#F47A38', ARI: '#8C2633', BOS: '#FFB81C', BUF: '#002654',
  CGY: '#D2001C', CAR: '#CC0000', CHI: '#CF0A2C', COL: '#6F263D',
  CBJ: '#002654', DAL: '#006847', DET: '#CE1126', EDM: '#041E42',
  FLA: '#041E42', LAK: '#111111', MIN: '#154734', MTL: '#AF1E2D',
  NSH: '#FFB81C', NJD: '#CE1126', NYI: '#00539B', NYR: '#0038A8',
  OTT: '#C52032', PHI: '#F74902', PIT: '#FCB514', SJS: '#006D75',
  SEA: '#001628', STL: '#002F87', TBL: '#003E7E', TOR: '#00205B',
  UTA: '#69B3E7', VAN: '#00205B', VGK: '#B4975A', WPG: '#041E42',
  WSH: '#C8102E'
};

router.get('/all', async function(req, res, next) {
  try {
    let response = await apiCall('v1/standings/now');
    
    let teams = response.standings.map(item => ({
      id: item.teamAbbrev.default, 
      fullName: item.teamName.default,
      logo: item.teamLogo,
      conference: item.conferenceName,
      division: item.divisionName,
      primaryColor: teamColors[item.teamAbbrev.default] || '#333333'
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