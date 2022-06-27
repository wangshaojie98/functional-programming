/**
 * 立即传参和稍后传参
 */
function ajax(url, data, callback) {
  console.log(url, data, callback);
}

let partial =
  (fn, ...presetArgs) =>
  (...laterArgs) =>
    fn(...presetArgs, ...laterArgs);
{
  function getPerson(data, cb) {
    ajax("/api/person", data, cb);
  }

  function getOrder(data, cb) {
    ajax("/api/order", data, cb);
  }

  function getCurrentUser(cb) {
    getPerson({ user: "CURRENT_USER_ID" }, cb);
  }

  // function partial(fn, ...presetArgs) {
  //   return function partiallyApplied(...restArgs) {
  //     return fn.apply(this, presetArgs.concat(restArgs));
  //   };
  // }

  var getPerson = partial(ajax, "/api/person");
  var getOrder = partial(ajax, "/api/order");
  // 版本1
  var getCurrentUser = partial(ajax, "/api/person", {
    user: "CURRENT_USER_ID",
  });
  // 版本2
  var getCurrentUser = partial(getPerson, { user: "CURRENT_USER_ID" });

  const add = (x, y) => x + y;
  // version 1
  [1, 2, 3]
    .map((val) => {
      return add(3, val);
    })
    [
      // version 2
      (1, 2, 3)
    ].map(partial(add, 3));
}

/**
 * 将实参顺序颠倒
 */
let reverseArgs =
  (fn) =>
  (...args) =>
    fn(args.reverse());

let partialRight = (fn, ...presetArgs) =>
  reverseArgs(partial(reverseArgs(fn), ...presetArgs.reverse()));
{
  const cache = {};
  let cacheResult = reverseArgs(
    partial(reverseArgs(ajax), function onResult(obj) {
      cache[obj.id] = obj;
    })
  );

  // 处理之后
  cacheResult("/api/person", { user: "CURRENT_USER_ID" });

  // 实际是
  cacheResult = function reversedArgs(...args) {
    // [{ user: "CURRENT_USER_ID" }, '/api/person']
    const p = function partialed(...partialArgs) {
      const r = function (...reversedArgs) {
        // [{ user: "CURRENT_USER_ID" }, '/api/person']
        return ajax(reversedArgs.reverse()); // ['/api/person', { user: "CURRENT_USER_ID" }, function onResult(){}]
      };

      return r(
        function onResult(obj) {
          cache[obj.id] = obj;
        },
        ...partialArgs // [{ user: "CURRENT_USER_ID" }, '/api/person']
      );
    };

    return p(...args.reverse()); // ['/api/person', { user: "CURRENT_USER_ID" }]
  };

  // 使用partialRight之后
  cacheResult = partialRight(ajax, function onResult(obj) {
    cache[obj.id] = obj;
  });
  // 处理之后
  cacheResult("/api/person", { user: "CURRENT_USER_ID" });
}

/**
 * 一次只传一个
 */
function curry(fn, arity = fn.length) {
  function nextCurried(...prevArgs) {
    // nextCurried函数充当中间值，传递参数
    return function curried(...nextArgs) {
      const args = prevArgs.concat(nextArgs);

      if (arity.length <= args.length) {
        return fn(...args);
      } else {
        return nextCurried(...args);
      }
    };
  }

  return nextCurried();
}

let curry = (fn, arity = fn.length) =>
  (nextCurried =
    (...prevArgs) =>
    (...nextArgs) => {
      const args = prevArgs.concat(nextArgs);

      if (args.length >= arity) {
        return fn(...args);
      } else {
        return nextCurried(...args);
      }
    })();
let uncurry =
  (fn) =>
  (...args) => {
    let result = fn;
    args.forEach((arg) => {
      result = result(arg);
    });

    return result;
  };
let looseCurry = curry;

{
  let curriedAjax = curry(ajax);
  let personFetcher = curriedAjax("/api/ajax");
  let getCurrentUser = personFetcher({ user: "CURRENT_USER_ID" });

  getCurrentUser(function foundUser(...args) {
    console.log(args);
  });

  function sum(...args) {
    return args.reduce((acc, cur) => acc + cur, 0);
  }

  let curriedSum = curry(sum, 5);
  let unCurriedSum = curriedSum;

  curriedSum(1)(2)(3)(4)(5);
  unCurriedSum(1, 2, 3)(4)(5);
}

/**
 * 只要一个实参
 */
let unary = (fn) => (oneArg) => fn(oneArg);
unary = function (fn) {
  return function onlyOneArg(arg) {
    return fn(arg);
  };
};
{
  ["1", "2", "3", "4"].map(parseInt); // [1, NaN, NaN, NaN]
  ["1", "2", "3", "4"].map(unary(parseInt)); // [1, 2, 3, 4]
}

/**
 * 传一个返回一个
 */

function identity(v) {
  return function () {
    return v;
  };
}

/**
 * 扩展在参数中的妙用
 */
let spreadArgs = (fn) => (argsArr) => fn(...argsArr);
let gatherArgs =
  (fn) =>
  (...args) =>
    fn(args);

{
  let combineFirstTwo = ([v1, v2]) => v1 + v2;

  [1, 2, 3, 4, 5].reduce(gatherArgs(combineFirstTwo)); // 15
}



/**
 * 参数顺序的那些事儿
 */
function partialProps(fn, presetArgs = {}) {
  return function appliedPartialProps(laterArgs = {}) {
    return fn({ ...presetArgs, ...laterArgs });
  };
}

function curryProps(fn, arity = 1) {
  return (function nextCurried(prevArgs = {}) {
    return function curried(nextArgs = {}) {
      const allArgs = { ...prevArgs, ...nextArgs };

      if (Object.keys(allArgs).length >= arity) {
        return fn(allArgs);
      } else {
        return nextCurried(allArgs);
      }
    };
  })({});
}

{
  function foo({ x, y, z } = {}) {
    console.log(`x:${x} y:${y} z:${z}`);
  }

  var f1 = curryProps(foo, 3);
  var f11 = curryProps(foo, 3);
  var f2 = partialProps(foo, { y: 2 });

  f1({ y: 2,  x: 1 })({ z: 3 });
  f11( {y: 2} )( {x: 1} )( {z: 3} );
  // x:1 y:2 z:3
  // x:1 y:2 z:3
  f2({ z: 3, x: 1 });
  // x:1 y:2 z:3
}
