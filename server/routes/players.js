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

// Optional utility to delay execution
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let fallbackPlayers = [];
try {
  fallbackPlayers = require('../utils/fallback_players.json');
} catch (e) {
  console.warn('[CACHE] Fallback players file not found or invalid.');
}

let allPlayersCache = {
  timestamp: 0,
  data: fallbackPlayers,
  isFetching: false
};

// Background task to warm the cache slowly but efficiently
async function warmPlayersCache() {
  if (allPlayersCache.isFetching) return;
  allPlayersCache.isFetching = true;
  try {
    console.log('[CACHE WARMUP] Starting background fetch for all NHL players...');
    const teamMap = await getTeamMap();
    const triCodes = Object.keys(teamMap);
    const allPlayers = [];

    // Process sequentially to be fully safe against NHL API rate limits
    // The user will not feel this delay due to the Vercel Edge caching headers
    for (const triCode of triCodes) {
      try {
        const data = await apiCall(`v1/roster/${triCode}/current`);
        const rosterPlayers = [
          ...(data.forwards || []),
          ...(data.defensemen || []),
          ...(data.goalies || [])
        ];
        
        const mapped = rosterPlayers.map(p => ({
          id: p.id,
          firstName: p.firstName?.default || '',
          lastName: p.lastName?.default || '',
          headshot: p.headshot || '',
          positionCode: p.positionCode || '',
          teamAbbrev: triCode,
          teamName: teamMap[triCode]?.fullName || '',
          teamLogo: teamMap[triCode]?.logo || ''
        }));
        
        allPlayers.push(...mapped);
        
        // 250ms delay between teams ensures we don't trigger 429 Too Many Requests
        await sleep(250);
      } catch (err) {
        console.warn(`[CACHE WARMUP] Failed to fetch roster for ${triCode}:`, err.message);
      }
    }

    allPlayersCache.data = allPlayers;
    allPlayersCache.timestamp = Date.now();
    console.log(`[CACHE WARMUP] Completed. Loaded ${allPlayers.length} players.`);
  } finally {
    allPlayersCache.isFetching = false;
  }
}

// Start warming the cache as soon as the file gets required (server startup)
warmPlayersCache();

// GET /players/all — returns all players from all team rosters
router.get('/all', async function(req, res, next) {
  try {
    // Enable Vercel Edge caching for 24 hours to eliminate cold starts for users
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400, stale-while-revalidate');

    const now = Date.now();
    
    // Stale-while-revalidate: If we have data but it's older than 1 hour, trigger a background refresh
    if (allPlayersCache.data.length > 0 && (now - allPlayersCache.timestamp >= 3600000)) {
      warmPlayersCache(); // Runs in background
    }

    // 1. If we have data ready, serve it instantly! (0ms)
    if (allPlayersCache.data.length > 0) {
      return res.json(allPlayersCache.data);
    }

    // 2. If data is still fetching (e.g. immediately after server startup), wait for it to finish
    if (allPlayersCache.isFetching) {
      while (allPlayersCache.isFetching) {
        await sleep(200);
      }
      return res.json(allPlayersCache.data);
    }

    // 3. Fallback: if not fetching and no data, start fetch and wait.
    await warmPlayersCache();
    res.json(allPlayersCache.data);
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
