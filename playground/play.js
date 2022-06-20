// import { tap, once } from '../chapter-04'
import { curry } from '../chapter-06'

// tap('fun')((arg) => console.log(`value is ${arg}`))

// ['1', '2', '3', '4', '5', '6'].map(parseInt)

// const unary = (fn) =>
//   fn.length === 1
//     ? fn
//     : arg => fn(arg);

// ['1', '2', '3', '4', '5', '6'].map(unary(parseInt));

// const doPayment = () => {
//   console.log('doPayment: ', 'doPayment');
// }

// let payment = once(doPayment)
// payment()
// payment()

// const memoized = (fn) => {
//   const map = {};

//   return function(...args) {
//     return map[args.toString()] || (map[args.toString()] = fn.apply(this, args));
//   }
// }

// let factorial = (n) => {
//   if (n === 0) return 1;

//   return n * factorial(n - 1)
// }
// factorial = memoized(factorial)
// console.log(factorial(5))

const loggerHelper = (mode, initialMessage, errorMessage, lineNo) => {
  const handler = {
    DEBUG() {
      console.debug(initialMessage, `${errorMessage} at Line: ${lineNo}`);
    },
    ERROR() {
      console.error(initialMessage, `${errorMessage} at Line: ${lineNo}`);

    },
    WARN() {
      console.warn(initialMessage, `${errorMessage} at Line: ${lineNo}`);
    },
    default() {
      throw 'Wrong mode'
    }
  }
  return handler[mode]()
}

let errorLogger = curry(loggerHelper)('ERROR')('Error at stats.js')
let warnLogger = curry(loggerHelper)('WARN')('Warn at stats.js')
let debugLogger = curry(loggerHelper)('DEBUG')('Deubg at stats.js')

errorLogger('error message', 21)
warnLogger('error message', 21)
debugLogger('error message', 21)