

// add(1, 2, 3)

// add(1)
// add(2)
// add(4)

// add(1, 2)
// add(3)

// add(1)
// add(2, 3)

export function curry(fn, cacheArgs = []) {
  if (typeof fn !== 'function') {
    throw new TypeError('参数应为函数')
  }

  return function(...args) {
    cacheArgs = [...cacheArgs, ...args];

    if (cacheArgs.length < fn.length) {
      return curry(fn, cacheArgs)
    } else {
      return fn.apply(this, cacheArgs)
    }
  }
}

export const partial = (fn, ...args) => {
  return function(...restArgs) {
    const defaultArgs = [...args];
    const defaultArgsLen = defaultArgs.length
    let j = 0

    for (let i = 0; i < defaultArgsLen && restArgs.length < defaultArgsLen; i++) {
      if (defaultArgs[i] === undefined) {
        defaultArgs[i] = restArgs[j++]
      }
    }

    return fn.apply(this, defaultArgs)
  }
}

const delayTenMs = partial(setTimeout, undefined, 10)
delayTenMs(() => {
  console.log('延迟十秒')
})

delayTenMs(() => {
  console.log('延迟十.1秒')
})
delayTenMs(() => {
  console.log('延迟十.2秒')
})
// const add = (a, b, c) => {
//   return a + b + c;
// }
// curry(add)(1)(2)(3)