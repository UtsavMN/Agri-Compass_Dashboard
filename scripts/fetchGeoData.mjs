import fs from 'fs';
import https from 'https';

const urls = {
  karnataka: 'https://raw.githubusercontent.com/datameet/maps/master/States/Karnataka/karnataka.geojson',
  states: 'https://raw.githubusercontent.com/datameet/maps/master/States/india-states.geojson'
};

const fetchGeoJSON = (name, url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          fs.writeFileSync(`public/models/${name}.geojson`, data);
          console.log(`[+] Saved ${name}.geojson - Size: ${(data.length / 1024).toFixed(2)} KB`);
          
          if (parsed.features) {
            let totalVertices = 0;
            parsed.features.forEach(f => {
              if (f.geometry && f.geometry.coordinates) {
                const countCoords = (arr) => {
                  if (typeof arr[0] === 'number') return 1;
                  return arr.reduce((acc, curr) => acc + countCoords(curr), 0);
                }
                totalVertices += countCoords(f.geometry.coordinates);
              }
            });
            console.log(`    Total vertices for ${name}: ${totalVertices}`);
          }
          resolve();
        } catch (e) {
          console.log(`[-] Failed to parse ${name} from ${url}: ${res.statusCode}`);
          resolve();
        }
      });
    }).on('error', reject);
  });
};

const run = async () => {
  if (!fs.existsSync('public/models')) {
    fs.mkdirSync('public/models', { recursive: true });
  }
  // Try direct Karnataka map
  await fetchGeoJSON('karnataka', urls.karnataka);
  // Also get the states map just in case
  await fetchGeoJSON('india_states', urls.states);
};

run();
