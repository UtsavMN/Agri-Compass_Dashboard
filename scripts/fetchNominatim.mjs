import fs from 'fs';
import https from 'https';

const fetchNominatim = (name, url) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'AgriCompass-Dev/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed.length > 0 && parsed[0].geojson) {
            const geojson = {
              type: "FeatureCollection",
              features: [{
                type: "Feature",
                geometry: parsed[0].geojson,
                properties: { name: parsed[0].display_name }
              }]
            };
            const str = JSON.stringify(geojson);
            fs.writeFileSync(`public/models/${name}.geojson`, str);
            console.log(`[+] Saved ${name}.geojson - Size: ${(str.length / 1024).toFixed(2)} KB`);
            
            let totalVertices = 0;
            const countCoords = (arr) => {
              if (typeof arr[0] === 'number') return 1;
              return arr.reduce((acc, curr) => acc + countCoords(curr), 0);
            }
            totalVertices += countCoords(parsed[0].geojson.coordinates);
            console.log(`    Total vertices for ${name}: ${totalVertices}`);
          }
          resolve();
        } catch (e) {
          console.log(`[-] Failed to parse ${name}: ${e.message}`);
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
  // We already have India from datameet which is good, but let's see Nominatim's size
  await fetchNominatim('india_nom', 'https://nominatim.openstreetmap.org/search?country=India&polygon_geojson=1&format=json');
  await fetchNominatim('karnataka_nom', 'https://nominatim.openstreetmap.org/search?state=Karnataka&country=India&polygon_geojson=1&format=json');
};

run();
