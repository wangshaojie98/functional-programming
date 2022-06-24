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

let partialRight = (fn, ...presetArgs) => reverseArgs(partial(reverseArgs(fn), ...presetArgs.reverse()))
{
  

  const cache = {};
  let cacheResult = reverseArgs(
    partial(reverseArgs(ajax), function onResult(obj) {
      cache[obj.id] = obj
    })
  )

  // 处理之后
  cacheResult('/api/person', { user: "CURRENT_USER_ID" })

  // 实际是
  cacheResult = function reversedArgs(...args) { // [{ user: "CURRENT_USER_ID" }, '/api/person']
    const p = function partialed(...partialArgs) {
      const r = function (...reversedArgs) { // [{ user: "CURRENT_USER_ID" }, '/api/person']
        return ajax(reversedArgs.reverse()) // ['/api/person', { user: "CURRENT_USER_ID" }, function onResult(){}]
      }

      return r(
        function onResult(obj) {
          cache[obj.id] = obj
        }, 
        ...partialArgs // [{ user: "CURRENT_USER_ID" }, '/api/person']
      )
    }

    return p(...args.reverse()) // ['/api/person', { user: "CURRENT_USER_ID" }]
  }

  // 使用partialRight之后
  cacheResult = partialRight(ajax, function onResult(obj) {
    cache[obj.id] = obj
  })
  // 处理之后
  cacheResult('/api/person', { user: "CURRENT_USER_ID" })
}


