const fs = require('fs');
const polyfillFeatures = require('polyfill-library/polyfills/__dist/aliases.json');

// 所有补丁
let esFeatures = polyfillFeatures.all;
esFeatures.sort();

// 忽略不需要的补丁
const ignore = [
  /^Intl/,
  /^Event/,
  /^Node/,
  /^Element/,
  /^Document/i,
  /^DOM/,
  /^HTML/,
  /^Math/,
  /^Blob/,
  /^[_~]/,
  /^console/,
  /^CustomEvent/,
  /^MutationObserver/,
  /^UserTiming/,
  /^Weak/,
  /^Window/,
  /^XMLHttpRequest/,
  /^devicePixelRatio/,
  /^fetch/,
  /^getComputedStyle/,
  /^location/,
  /^matchMedia/,
  /^navigator/,
  /^performance/,
  /^screen/,
  /^WebAnimations/,
  /^AudioContext/,
  /^Intersection/,
];

const features = [...new Set(esFeatures)].filter(name => !ignore.some(re => re.test(name)))
fs.writeFileSync('features-all.json', JSON.stringify(features, null, 2));
