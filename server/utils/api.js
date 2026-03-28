const nhlApiUrl = "https://api-web.nhle.com/";

// Simple in-memory cache map
const cache = new Map();

// In-flight map to deduplicate identical concurrent API requests
const inflight = new Map();

async function apiCall(endpoint, ttl = 3600000) { // Default TTL: 1 hour (3.6 million ms)
  const now = Date.now();
  
  // 1. Check completed cache
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

  // 2. Check inflight requests (Cache Stampede prevention)
  if (inflight.has(endpoint)) {
    console.log(`[INFLIGHT HIT] sharing connection for ${endpoint}`);
    return inflight.get(endpoint);
  }

  // 3. Fetch from NHL API and store Promise
  const requestPromise = (async () => {
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
    
    // Save to cache
    cache.set(endpoint, {
      timestamp: Date.now(),
      ttl: ttl,
      data: data
    });
    
    return data;
  })();

  // Track the promise and remove it from inflight when settled
  inflight.set(endpoint, requestPromise);
  requestPromise.finally(() => {
    inflight.delete(endpoint);
  });

  return requestPromise;
}

function clearApiCache() {
  cache.clear();
  console.log('[CACHE] All API caches cleared.');
}

module.exports = { apiCall, clearApiCache };
