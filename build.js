// Builds index.html (the quiz) and calibrate.html (marker zone tool), both fully self-contained.
// Usage: node build.js
const fs = require('fs'), path = require('path');
const dir = __dirname;
const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
const imgs = {};
for (const f of fs.readdirSync(path.join(dir, 'images'))) {
  const ext = path.extname(f).toLowerCase();
  if (!mime[ext]) continue;
  imgs[path.basename(f, ext)] = `data:${mime[ext]};base64,` + fs.readFileSync(path.join(dir, 'images', f)).toString('base64');
}
const zones = JSON.parse(fs.readFileSync(path.join(dir, 'zones.json'), 'utf8'));
for (const [out, tpl] of [['index.html', 'quiz.template.html'], ['calibrate.html', 'calibrate.template.html']]) {
  const html = fs.readFileSync(path.join(dir, tpl), 'utf8')
    .replace('/*IMAGES*/{}', () => JSON.stringify(imgs))
    .replace('/*ZONES*/{}', () => JSON.stringify(zones));
  fs.writeFileSync(path.join(dir, out), html);
  console.log(out, (html.length / 1024).toFixed(0) + ' KB');
}
