export const tap = (val) => 
  (fn) => {
    if (typeof fn === 'function') {
      fn(val)
      console.log(val)
    }
  }

export const unary = (fn) =>
  fn.length === 1
    ? fn
    : arg => fn(arg);

export const once = (fn) => {
  let done = false;    

  return function (args) {
    return done ? undefined : (done = true, fn.apply(this, args))
  }
}

export const memoized = (fn) => {
  const map = {};

  return function(...args) {
    return map[args.toString()] || (map[args.toString()] = fn.apply(this, args));
  }
}