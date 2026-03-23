const https = require('https');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'frontend', 'public', 'images', 'categories');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const images = {
  'control-cable.jpg': 'https://nyxcable.com/wp-content/uploads/2019/04/YSLY-JZ.jpg',
  'vfd-servo-cable.jpg': 'https://nyxcable.com/wp-content/uploads/2019/04/Double-Shield.jpg',
  'heat-resistant-cable.jpg': 'https://nyxcable.com/wp-content/uploads/2019/04/SiHF-SiHFC.jpg',
  'shielded-cable.jpg': 'https://nyxcable.com/wp-content/uploads/2019/11/LiYCY.jpg',
  'crane-cable.jpg': 'https://nyxcable.com/wp-content/uploads/2019/04/NSHTOU.jpg',
  'bus-data-cable.jpg': 'https://nyxcable.com/wp-content/uploads/2019/04/PROFIBUS-Cable-1.jpg',
};

async function download(name, url) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(dir, name));
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, (res2) => {
          res2.pipe(file);
          file.on('finish', () => { file.close(); console.log('OK:', name, res2.statusCode); resolve(); });
        });
      } else {
        res.pipe(file);
        file.on('finish', () => { file.close(); console.log('OK:', name, res.statusCode); resolve(); });
      }
    }).on('error', (e) => { console.log('FAIL:', name, e.message); reject(e); });
  });
}

(async () => {
  for (const [name, url] of Object.entries(images)) {
    await download(name, url).catch(() => {});
  }
  console.log('All done!');
})();
