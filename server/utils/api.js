const nhlApiUrl = "https://api-web.nhle.com/";

// Simple in-memory cache map
const cache = new Map();

async function apiCall(endpoint, ttl = 3600000) { // Default TTL: 1 hour (3.6 million ms)
  const now = Date.now();
  
  // 1. Check cache
  if (cache.has(endpoint)) {
    const cachedEntry = cache.get(endpoint);
    // If not expired, serve from cache
    if (now - cachedEntry.timestamp < cachedEntry.ttl) {
      console.log(`[CACHE HIT] ${endpoint}`);
      return cachedEntry.data;
    }
    // Expired, delete it
    cache.delete(endpoint);
  }

  // 2. Fetch from NHL API
  console.log(`[API FETCH] ${endpoint}`);
  let url = nhlApiUrl + endpoint;
  
  let response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 429) {
      console.error(`[API ERROR 429] Rate limited on ${endpoint}`);
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  let data = await response.json();
  
  // 3. Save to cache
  cache.set(endpoint, {
    timestamp: now,
    ttl: ttl,
    data: data
  });
  
  return data;
}

function clearApiCache() {
  cache.clear();
  console.log('[CACHE] All API caches cleared.');
}

module.exports = { apiCall, clearApiCache };
