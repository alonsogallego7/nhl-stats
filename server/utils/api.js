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

  // 3. Fetch from NHL API with retry for 429 errors
  const requestPromise = (async () => {
    try {
      console.log(`[API FETCH] ${endpoint}`);
      let url = nhlApiUrl + endpoint;
      
      const maxRetries = 3;
      let delay = 500; // Start with 500ms backoff
      
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        let response = await fetch(url);
        
        if (response.ok) {
          let data = await response.json();
          cache.set(endpoint, {
            timestamp: Date.now(),
            ttl: ttl,
            data: data
          });
          return data;
        }
        
        if (response.status === 429 && attempt < maxRetries) {
          // Add jitter to avoid thundering herd on retries
          const jitter = Math.floor(Math.random() * 200);
          console.warn(`[API 429] Rate limited on ${endpoint}, retry ${attempt + 1}/${maxRetries} in ${delay + jitter}ms`);
          await new Promise(r => setTimeout(r, delay + jitter));
          delay *= 2; // Exponential backoff
          continue;
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } finally {
      // Remove from inflight map whether it resolved or rejected
      inflight.delete(endpoint);
    }
  })();

  inflight.set(endpoint, requestPromise);
  return requestPromise;
}

function clearApiCache() {
  cache.clear();
  console.log('[CACHE] All API caches cleared.');
}

module.exports = { apiCall, clearApiCache };
