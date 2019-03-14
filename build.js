const fs = require('fs');
const polyfillLibrary = require('polyfill-library');

// ua 信息
const uaMap = {
  ie7: 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
  ie8: 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)',
  ie9: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
  ie10: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)',
  ie11: 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
};

// 获取补丁列表
const polyfillFeatures = require('polyfill-library/polyfills/__dist/aliases.json');

// es2015 - 今年的所有补丁，DOM 等补丁忽略
let esFeatures = polyfillFeatures.es5;
for (let i = 2015; i <= new Date().getFullYear(); i++) {
  esFeatures = esFeatures.concat(polyfillFeatures[`es${i}`] || []);
}
esFeatures.push('JSON'); // 额外添加 JSON
esFeatures.push('atob'); // base64
esFeatures.sort();

// 忽略不需要的补丁
const ignore = [
  // /^Array\.prototype\.(@@iterator|entries|values)$/,
  /^Function\.prototype\.name/,
  /^Math/,
  // /^Object\.(getOwnPropertyDescriptor|getOwnPropertyNames|getPrototypeOf|setPrototypeOf)/,
  /^RegExp/,
  /^String\.prototype\.codePointAt/,
  // /^Symbol/,
  /^Weak/,
];

// 整理成指定格式的参数
const features = [...new Set(esFeatures)]
  .filter(name => !ignore.some(re => re.test(name)))
  .reduce((res, it) => {
    res[it] = { flags: 'gated' };
    return res;
  }, {});

// 添加任务
const tasks = [
  ...Object.keys(uaMap).map(name => polyfill(name, uaMap[name])),
  // ...Object.keys(uaMap).map(name => polyfill(name, uaMap[name], true)), // min 后IE8报错，暂不提供 min 版本
];

// 并发执行任务
Promise.all(tasks).then(() => {
  fs.writeFileSync(
    'polyfills/features.json',
    JSON.stringify(Object.keys(features), null, 2),
  );
  // console.log('done');
});

// 生成补丁
function polyfill(name, uaString, minify = false) {
  const filePath = `polyfills/${name}/polyfill${minify ? '.min' : ''}.js`;
  return polyfillLibrary
    .getPolyfillString({ uaString, minify, features })
    .then(bundle => {
      fs.writeFileSync(filePath, fixIE8bug(bundle), 'utf8');
    });
}

// var Map = function Map() {} 压缩后 var a = function b() {} 在 IE8 下判定是否实例是用 b 导致报错。
function fixIE8bug (str) {
  const re = /var (Symbol|Map|Set) = function \1\(/g;
  return str.replace(re, 'var $1 = function (');
}
