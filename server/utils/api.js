const nhlApiUrl = "https://api-web.nhle.com/";

async function apiCall(endpoint) {
  let url = nhlApiUrl + endpoint;
  
  let response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  let data = await response.json();
  return data;
}

module.exports = { apiCall };
