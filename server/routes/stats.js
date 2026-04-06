const express = require('express');
const router = express.Router();
const { apiCall } = require('../utils/api');

router.get('/leaders', async function(req, res, next) {
  try {
    const [leadersData, goalieData, standingsData] = await Promise.all([
      apiCall('v1/skater-stats-leaders/current?categories=points,goals,assists,plusMinus,penaltyMins&limit=5'),
      apiCall('v1/goalie-stats-leaders/current?categories=wins,savePctg&limit=5'),
      apiCall('v1/standings/now')
    ]);

    // Crear un mapa de abreviatura -> nombre completo desde standings
    const teamNamesMap = {};
    if (standingsData && standingsData.standings) {
      standingsData.standings.forEach(team => {
        teamNamesMap[team.teamAbbrev.default] = team.teamName.default;
      });
    }

    // Inyectar el nombre completo en cada líder skater
    const skaterCategories = ['points', 'goals', 'assists', 'plusMinus', 'penaltyMins'];
    skaterCategories.forEach(cat => {
      if (leadersData[cat]) {
        leadersData[cat].forEach(player => {
          player.teamName = { 
            default: teamNamesMap[player.teamAbbrev] || player.teamAbbrev 
          };
        });
      }
    });

    // Inyectar el nombre completo en cada líder portero
    const goalieCategories = ['wins', 'savePctg'];
    goalieCategories.forEach(cat => {
      if (goalieData[cat]) {
        goalieData[cat].forEach(player => {
          player.teamName = {
            default: teamNamesMap[player.teamAbbrev] || player.teamAbbrev
          };
        });
      }
    });

    res.json({
      ...leadersData,
      goalieWins: goalieData.wins || [],
      goalieSavePctg: goalieData.savePctg || []
    });
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

    const pct = (v) => v != null ? (v * 100).toFixed(1) + '%' : '—';

    const points          = [...teams].sort((a, b) => b.points - a.points).slice(0, 5).map(t => mapTeam(t, t.points));
    const goalsFor        = [...teams].sort((a, b) => b.goalFor - a.goalFor).slice(0, 5).map(t => mapTeam(t, t.goalFor));
    const goalDifferential = [...teams].sort((a, b) => b.goalDifferential - a.goalDifferential).slice(0, 5).map(t => mapTeam(t, (t.goalDifferential > 0 ? '+' : '') + t.goalDifferential));
    const goalAgainst     = [...teams].sort((a, b) => a.goalAgainst - b.goalAgainst).slice(0, 5).map(t => mapTeam(t, t.goalAgainst));

    res.json({ points, goalsFor, goalDifferential, goalAgainst });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
