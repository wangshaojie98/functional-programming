import R, { reduce, map, add, replace, compose } from 'ramda'

var CARS = [
  {name: "Ferrari FF", horsepower: 660, dollar_value: 700000, in_stock: true},
  {name: "Spyker C12 Zagato", horsepower: 650, dollar_value: 648000, in_stock: false},
  {name: "Jaguar XKR-S", horsepower: 550, dollar_value: 132000, in_stock: false},
  {name: "Audi R8", horsepower: 525, dollar_value: 114200, in_stock: false},
  {name: "Aston Martin One-77", horsepower: 750, dollar_value: 1850000, in_stock: true},
  {name: "Pagani Huayra", horsepower: 700, dollar_value: 1300000, in_stock: false}
];
// 练习 1:
// ============
// 使用 _.compose() 重写下面这个函数。提示：_.prop() 是 curry 函数
{
  var isLastInStock = function(cars) {
    var last_car = _.last(cars);
    return _.prop('in_stock', last_car);
  };
}

// answer
{
  const isLastInStock = R.compose(
    R.prop('in_stock'),
    R.last
  )

  console.log('isLastInStock(CARS): ', isLastInStock(CARS));
}

// 练习 2:
// ============
// 使用 _.compose()、_.prop() 和 _.head() 获取第一个 car 的 name
{
  const getFirstCarName = R.compose(
    R.prop('name'),
    R.head,
  )

  console.log('getFirstCarName', getFirstCarName(CARS))
}

// 练习 3:
// ============
// 使用帮助函数 _average 重构 averageDollarValue 使之成为一个组合
{
  var _average = function(xs) { return reduce(add, 0, xs) / xs.length; }; // <- 无须改动

  var averageDollarValue = function(cars) {
    var dollar_values = map(function(c) { return c.dollar_value; }, cars);
    return _average(dollar_values);
  };
}

// answer
{
  // const extractLength = R.prop('length')
  // const calculateArraySum =  reduce(add, 0)
  const calculateAverage = data => reduce(add, 0, data) / R.prop('length', data)
  // let average = R.curry(function(name, data) { 
  //   return reduce(add, 0, data) / R.prop(name, data); 
  // });
  // average = R.compose(
  //   R.divide(R.prop('length')),
  //   reduce(add, 0)
  // )
  const averageDollarValue = R.compose(calculateAverage, R.map(R.prop('dollar_value')));
  console.log('averageDollarValue: ', averageDollarValue(CARS));
}


// 练习 4:
// ============
// 使用 compose 写一个 sanitizeNames() 函数，返回一个下划线连接的小写字符串：例如：sanitizeNames(["Hello World"]) //=> ["hello_world"]。
{
  var _underscore = replace(/\W+/g, '_'); //<-- 无须改动，并在 sanitizeNames 中使用它
  var sanitizeNames = undefined;
}

// answer
{
  var _underscore = replace(/\W+/g, '_'); //<-- 无须改动，并在 sanitizeNames 中使用它
  var sanitizeNames = R.map(R.compose(_underscore, R.toLower, R.prop('name')))
  console.log('sanitizeNames: ', sanitizeNames(CARS));
}

// 彩蛋 1:
// ============
// 使用 compose 重构 availablePrices

var availablePrices = function(cars) {
  var available_cars = R.filter(_.prop('in_stock'), cars);
  return available_cars.map(function(x){
    return accounting.formatMoney(x.dollar_value);
  }).join(', ');
};

// answer
{
  // formatNumber :: String -> Object -> Number -> String
  const formatNumber = (locales, options, number) => new Intl.NumberFormat(locales, options).format(number)

  const curryFormatNumber = R.curryN(3, formatNumber);

  // formatNumToUSD :: Number -> String
  const formatNumToUSD = curryFormatNumber('en', { style: 'currency', currency: 'USD'}) 

  // const convertToUSD = R.compose(
  //   formatNumToUSD, 
  //   R.prop('dollar_value')
  // )

  // convertToUSD :: String -> (Object -> String)
  const convertToUSD = (name) => R.compose(
    formatNumToUSD, 
    R.prop(name)
  )
  
  // convertToUSDWithDollarValue :: Object -> String
  const convertToUSDWithDollarValue = convertToUSD('dollar_value')
  // updateDollarValue :: a -> a
  const updateDollarValue = it => R.assoc('dollar_value', convertToUSDWithDollarValue(it), it)
  
  // availablePrices :: [a] -> [a]
  const availablePrices = R.compose(
    R.map(updateDollarValue),
    R.filter(R.prop('in_stock'))
  )
  console.log('availablePrices', availablePrices(CARS))
}

{
  // const compose = function (f, g) {
  //   return function (x) {
  //     return f(g(x))
  //   }
  // }

  const toUpperCase = x => x.toUpperCase();
  const exclain = x => x + '!';
  const shout = compose(exclain, toUpperCase)

  shout("send in the clowns");
  //=> "SEND IN THE CLOWNS!"

  const head = x => x[0]
  const reverse = reduce((acc, x) => [x].concat(acc), [])
  const last = compose(head, reverse)

  last(['jumpkick', 'roundhouse', 'uppercut']);

  const lastUpper = compose(toUpperCase, head, reverse)
  lastUpper(['jumpkick', 'roundhouse', 'uppercut']);
  //=> 'UPPERCUT'

  const loudLastUpper = compose(exclaim, toUpperCase, head, reverse)
  loudLastUpper(['jumpkick', 'roundhouse', 'uppercut']);
  //=> 'UPPERCUT!'

  // pointfree
  {
    const snakeCase = word => word.toLowerCase().replace(/\s+/ig, '_')

    const snakeCasePf = compose(replace(/\s+/ig, '_'), toLowerCase)

    const initials = name => name.split(' ').map(compose(toUpperCase, head)).join('. ');
    initials('hunter stockton thompson')
    // 'H. S. T'
  }

  // debug
  {
    // error
    let latin = compose(map, angry, reverse)
    latin(['frog', 'eye']);

    // right
    latin = compose(map(angry), reverse);

    latin(['frog', 'eye'])

    const trace = curry((tag, x) => {
      console.log(tag, x)
      return x
    })

    let dasherize = compose(join('-'), toLower, split(' '), replace(/\s{2,}/ig, ' '));
    dasherize('The world is a vampire');
    // TypeError: Cannot read property 'apply' of undefined

    dasherize = compose(join('-'), toLower, trace("after split"), split(' '), replace(/\s{2,}/ig, ' '));
    // after split [ 'The', 'world', 'is', 'a', 'vampire' ]

    // right
    dasherize = compose(join('-'), map(toLower), split(' '), replace(/\s{2,}/ig, ' '));
  }
}

