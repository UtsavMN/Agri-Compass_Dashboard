const https = require('https');
const fs = require('fs');
const files = ['dashboard', 'crops', 'fertilizer', 'weather', 'market', 'community', 'voice', 'schemes', 'farm', 'ai'];

files.forEach(name => {
  const file = fs.createWriteStream(`public/screenshots/${name}.png`);
  https.get(`https://placehold.co/1920x1080/111008/C9A84C.png?text=${name.toUpperCase()}`, response => {
    response.pipe(file);
  });
});
