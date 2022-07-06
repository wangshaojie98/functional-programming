import R, { reduce, map, add } from 'ramda'

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
  let average = R.curry(function(key, xs) { 
    return reduce(add, 0, xs) / R.prop(key, xs); 
  });
  // average = R.compose(
  //   R.divide(R.prop('length')),
  //   reduce(add, 0)
  // )
  const averageDollarValue = R.compose(average('length'), R.map(R.prop('dollar_value')));
  console.log('averageDollarValue: ', averageDollarValue(CARS));
}