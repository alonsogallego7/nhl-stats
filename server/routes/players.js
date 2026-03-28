const { apiCall } = require('../utils/api');

var express = require('express');
var router = express.Router();

// Map of team triCode -> logo URL (fetched once per request from standings)
async function getTeamMap() {
  const response = await apiCall('v1/standings/now');
  const map = {};
  for (const item of response.standings) {
    const abbrev = item.teamAbbrev.default;
    map[abbrev] = {
      logo: item.teamLogo,
      fullName: item.teamName.default
    };
  }
  return map;
}

// GET /players/all — returns all players from all team rosters
router.get('/all', async function(req, res, next) {
  try {
    const teamMap = await getTeamMap();
    const triCodes = Object.keys(teamMap);

    const rosterPromises = triCodes.map(async (triCode) => {
      try {
        const data = await apiCall(`v1/roster/${triCode}/current`);
        const allPlayers = [
          ...(data.forwards || []),
          ...(data.defensemen || []),
          ...(data.goalies || [])
        ];
        return allPlayers.map(p => ({
          id: p.id,
          firstName: p.firstName?.default || '',
          lastName: p.lastName?.default || '',
          headshot: p.headshot || '',
          positionCode: p.positionCode || '',
          teamAbbrev: triCode,
          teamName: teamMap[triCode]?.fullName || '',
          teamLogo: teamMap[triCode]?.logo || ''
        }));
      } catch {
        return [];
      }
    });

    const results = await Promise.all(rosterPromises);
    const allPlayers = results.flat();

    res.json(allPlayers);
  } catch (error) {
    next(error);
  }
});

// GET /players/player/:id — single player landing
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
