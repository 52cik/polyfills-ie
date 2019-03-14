function dequal(foo, bar) {
  var ctor, len;
  if (foo === bar) return true;
  if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
    if (ctor === Date) return foo.getTime() === bar.getTime();
    if (ctor === RegExp) return foo.toString() === bar.toString();
    if (ctor === Array && (len = foo.length) === bar.length) {
      while (len-- && dequal(foo[len], bar[len]));
      return len === -1;
    }
    if (ctor === Object) {
      if (Object.keys(foo).length !== Object.keys(bar).length) return false;
      for (len in foo)
        if (!(len in bar) || !dequal(foo[len], bar[len])) return false;
      return true;
    }
  }
  return foo !== foo && bar !== bar;
}

// 写到页面
function write(str) {
  result.innerHTML += str;
}

/**
 * 测试用例
 * @param {string} describe 描述
 * @param {any} expression 表达式/函数
 * @param {any} expected 期待值
 */
 function test(describe, expression, expected) {
  var ret = expression;

  if (typeof expression === 'function') {
    ret =  expression();
  }

  if (typeof ret.then === 'function') {
    ret.then(function(res) {
      ret = dequal(res, expected);
      write('<p class="' + (ret ? 'ok' : 'err') + '">' + describe + '</p>');
    });
  } else {
    ret = dequal(ret, expected);
    write('<p class="' + (ret ? 'ok' : 'err') + '">' + describe + '</p>');
  }
}

(function() {
  test('Array.entries', function () {
    var arr = ['a', 'b'];
    var iterator = arr.entries();
    iterator.next();
    return iterator.next().value;
  }, [1, 'b']);
  test('Array.from', Array.from([1, 2, 3], function(x) { return x + x }), [2, 4, 6]);
  test('Array.isArray', Array.isArray([1, 2, 3]) && !Array.isArray({ foo: 123 }), true);
  test('Array.of', Array.of(1, 2, 3), [1, 2, 3]);
  test('Array.prototype.copyWithin', ['a', 'b', 'c', 'd', 'e'].copyWithin(0, 3, 4), ['d', 'b', 'c', 'd', 'e']);
  test('Array.prototype.every', [2, 4, 6, 8].every(function(it){ return it % 2 === 0 }), true);
  test('Array.prototype.fill', Array(3).fill(1), [1, 1, 1]);
  test('Array.prototype.filter', [1, 2, 3, 4].filter(function(it){ return it % 2 === 0 }), [2, 4]);
  test('Array.prototype.find', [1, 2, 3, 4].find(function(it){ return it > 2 }), 3);
  test('Array.prototype.findIndex', [1, 2, 3, 4].findIndex(function(it){ return it > 2 }), 2);
  test('Array.prototype.forEach', function () {
    var arr = [{ a: 1 }, { a: 2 }];
    arr.forEach(function(it){ return it.a += 1 });
    return arr;
  }, [{ a: 2 }, { a: 3 }]);
  test('Array.prototype.includes', [1, 2, 3, 4].includes(3), true);
  test('Array.prototype.indexOf', [1, 2, 3, 4].indexOf(3), 2);
  test('Array.prototype.map', [1, 2, 3, 4].map(function(it){ return it * 2 }), [2, 4, 6, 8]);
  test('Array.prototype.reduce', [1, 2, 3, 4].reduce(function(accumulator, currentValue) { return accumulator + currentValue}), 10);
  test('Array.prototype.reduceRight', [[0, 1], [2, 3], [4, 5]].reduceRight(function(accumulator, currentValue) { return accumulator.concat(currentValue) }), [4, 5, 2, 3, 0, 1]);
  test('Array.prototype.some', [1, 2, 3, 4].some(function(it) { return it % 2 === 0 }), true);
  test('Array.values', function () {
    var arr = ['a', 'b'];
    var iterator = arr.values();
    iterator.next();
    return iterator.next().value;
  }, 'b');

  test('Date.now', Date.now() / 1000 | 0, (+new Date()) / 1000 | 0);
  test('Date.prototype.toISOString', new Date('2020/02/20 20:20:20').toISOString(), '2020-02-20T12:20:20.000Z');

  test('Function.prototype.bind', (function () { return this }).bind({ tt: 1 }), { tt: 1 });

  test('JSON.parse', JSON.parse('{"a":{"b":2}}'), { a: { b: 2 } });
  test('JSON.stringify', JSON.stringify({ a: { b: 2 } }), '{"a":{"b":2}}');

  test('String.prototype.endsWith', '2333!'.endsWith('!'), true);
  test('String.prototype.includes', '2333!'.includes('!'), true);
  test('String.prototype.padEnd', '2333!'.padEnd(7, '!'), '2333!!!');
  test('String.prototype.padStart', '2333!'.padStart(7, '!'), '!!2333!');
  test('String.prototype.repeat', '2333!'.repeat(2), '2333!2333!');
  test('String.prototype.startsWith', '2333!'.startsWith('233'), true);
  test('String.prototype.trim', ' 2333! '.trim(), '2333!');

  test('Object.assign', Object.assign({ a: 1, x: 3 }, { a: 2, b: 2 }), { a: 2, b: 2, x: 3 });
  test('Object.create', Object.create({ a: 1, x: 3 }).x, 3);
  test('Object.entries', Object.entries({ a: 1, x: 3 })[1], ['x', 3]);
  test('Object.freeze', Object.freeze({ a: 1, x: 3 }), { a: 1, x: 3 });
  test('Object.seal', Object.seal({ a: 1, x: 3 }), { a: 1, x: 3 });
  test('Object.is', Object.is(null, null), true);
  test('Object.keys', Object.keys({ a: 1, x: 3 }), ['a', 'x']);
  test('Object.values', Object.values({ a: 1, x: 3 }), [1, 3]);
  test('Object.getOwnPropertyDescriptor', Object.getOwnPropertyDescriptor({ a: 1, x: 3 }, 'x').value, 3);
  test('Object.getOwnPropertyNames', Object.getOwnPropertyNames({ a: 1, x: 3 }), ['a', 'x']);
  test('Object.getPrototypeOf', Object.getPrototypeOf({ __proto__: { a: 1, x: 3 } }), { a: 1, x: 3 });
  test('Object.setPrototypeOf', Object.setPrototypeOf({ a: 1 }, { x: 3 }).x, 3);
  test('Object.defineProperty', (function () {
    var obj = {};
    Object.defineProperty(obj, 'haha', {
      value: 42
    });
    return obj;
  })().haha, 42);
  test('Object.defineProperties', (function () {
    var obj = {};
    Object.defineProperties(obj, {
      haha: {
        value: 1,
        writable: true
      },
      hehe: {
        value: 22,
        writable: false
      }
    });
    return obj;
  })().hehe, 22);

  test('Symbol', /symbol\b/i.test(Symbol('233').toString()), true);

  test('Set', (function () {
    var set = new Set([11, 22, 33]);
    return set.has(22);
  })(), true);

  test('Map', (function () {
    var map = new Map();
    map.set('aa', 1);
    map.set('aa', 2);
    map.set('bb', 2);
    return map.size && map.get('aa');
  })(), 2);

  test('Promise', Promise.resolve(123), 123);
  test('Promise.finally', function() {
    var obj = { a: 1 };
    Promise.resolve(obj)['finally'](function() { obj.a = 2333 });
    return Promise.resolve(obj);
  }, { a: 2333 });

  test('atob', atob('MjMzMw=='), '2333');
  test('btoa', btoa('2333'), 'MjMzMw==');
})();
