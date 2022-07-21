import _ from "lodash";
import fp from "lodash/fp";
import R from 'ramda';


const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const powData = _(data)
  .reverse()
  .map((it) => it ** 2);
// console.log('powData: ', powData.value());
const json = [
  {
    a: "1",
  },
  {
    a: "2",
  },
];

const eqA = _.unary(fp.pipe([_.partialRight(_.get, "a"), _.partialRight(_.eq, "2")]));
const res = _.partial(
  _.find,
  _,
  _.unary(_.flow([_.partialRight(_.get, "a"), _.partialRight(_.eq, "2")])),
  _.flow([
    // (input) => {
    //   console.log('input: ', input);
    //   return input
    // },
    _.partialRight(_.get, "a"), 
    _.partialRight(_.eq, "2"),
    (output) => {
      console.log('output: ', output);
      return output
    },
  ])
)(json)
// console.log(_.unary(_.flow([_.partialRight(_.get, "a"), _.partialRight(_.eq, "2")])).length);

// console.log("res: ", res);

// const res = _.flow([
//   _.partialRight(
//     _.find,
//     // _.unary(_.flow([_.partialRight(_.get, "a"), _.partialRight(_.eq, "2")])),
//     _.flow([
//       // (input) => {
//       //   console.log('input: ', input);
//       //   return input
//       // },
//       _.partialRight(_.get, "a"), 
//       _.partialRight(_.eq, "2"),
//       (output) => {
//         console.log('output: ', output);
//         return output
//       },
//     ])
//   ),
//   (val) => {
//     console.log("findAfter", val);
//     return val;
//   },
// ])(json);


const find = R.pipe(
  R.find(
    R.pipe(
      R.prop('a'),
      R.propEq('1',)
    )
  )
)
console.log('aaaa', find(json));


const gatherStats = function (stat, country) {
  if(!isValid(stat[country])) {
     stat[country] = {'name': country, 'count': 0};
  }
  stat[country].count++;
  return stat;
};


class Person {
  constructor(name, a, phone) {
    this.name = name;
    this.a = a;
    this.phone = phone;
  }
}

const p5 = new Person('David', 'Hilbert', '555-55-5555');
p5.address = new Address('Germany');
p5.birthYear = 1903;

const p6 = new Person('Alan', 'Turing', '666-66-6666');
p6.address = new Address('England');
p6.birthYear = 1912;

const p7 = new Person('Stephen', 'Kleene', '777-77-7777');
p7.address = new Address('US');
p7.birthYear = 1909;

_.chain(persons)
    .filter(isValid)
   .map(_.property('address.country'))
    .reduce(gatherStats, {})
    .values()
    .sortBy('count')
    .reverse()
    .first()
    .value()
    .name; //-> 'US'