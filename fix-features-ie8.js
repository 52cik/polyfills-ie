const fs = require('fs');

// 强制 IE8 补丁这些特性
const features = [
  'Object.entries',
  'Object.values',
  'Object.setPrototypeOf',
];

const pathTpl = name => `polyfill-library/polyfills/__dist/${name}/meta.json`;

features.forEach(name => {
  const path = pathTpl(name);
  const meta = require(path);
  meta.browsers.ie = meta.browsers.ie.replace('9', '8');
  fs.writeFileSync(require.resolve(path), JSON.stringify(meta), 'utf8');
});
