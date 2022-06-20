/**
 * fns顺序是从右到左执行
 * @param  {Array<function>} fns 
 * @returns {any}
 */
export const compose = (...fns) => {
  return function(val) {
    return fns.reverse().reduce((acc, fn) => {
      return fn(acc);
    }, val)
  }
}