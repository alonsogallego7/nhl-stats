const express = require('express');
const router = express.Router();
const { apiCall } = require('../utils/api');

router.get('/leaders', async function(req, res, next) {
  try {
    const [leadersData, standingsData] = await Promise.all([
      apiCall('v1/skater-stats-leaders/current?categories=points,goals,assists&limit=5'),
      apiCall('v1/standings/now')
    ]);

    // Crear un mapa de abreviatura -> nombre completo desde standings
    const teamNamesMap = {};
    if (standingsData && standingsData.standings) {
      standingsData.standings.forEach(team => {
        teamNamesMap[team.teamAbbrev.default] = team.teamName.default;
      });
    }

    // Inyectar el nombre completo en cada líder
    const categories = ['points', 'goals', 'assists'];
    categories.forEach(cat => {
      if (leadersData[cat]) {
        leadersData[cat].forEach(player => {
          player.teamName = { 
            default: teamNamesMap[player.teamAbbrev] || player.teamAbbrev 
          };
        });
      }
    });

    res.json(leadersData);
  } catch (error) {
    next(error);
  }
});

router.get('/team-leaders', async function(req, res, next) {
  try {
    let standingsData = await apiCall('v1/standings/now');
    let teams = standingsData?.standings || [];

    const mapTeam = (team, val) => ({
      id: team.teamAbbrev.default,
      teamName: team.teamName,
      teamAbbrev: team.teamAbbrev.default,
      teamLogo: team.teamLogo,
      value: val
    });

    const points = [...teams].sort((a, b) => b.points - a.points).slice(0, 5).map(team => mapTeam(team, team.points));
    const goalsFor = [...teams].sort((a, b) => b.goalFor - a.goalFor).slice(0, 5).map(team => mapTeam(team, team.goalFor));
    const goalDifferential = [...teams].sort((a, b) => b.goalDifferential - a.goalDifferential).slice(0, 5).map(team => mapTeam(team, (team.goalDifferential > 0 ? '+' : '') + team.goalDifferential));

    res.json({ points, goalsFor, goalDifferential });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
