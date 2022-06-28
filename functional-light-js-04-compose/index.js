import { compose, filter, where, gte, lt, __, partial, partialRight } from 'ramda';

function words(str) {
  return String(str)
          .toLowerCase()
          .split(/\s|\b/)
          .filter(v => /^[\w]+$/.test( v ))
}

function unique(list) {
  return Array.from(new Set(list))
}

const skipShortWords = filter(where({length: gte(__, 4)}))
const skipLongWords = filter(where({length: lt(__, 4)}))

var text = "To compose two functions together, pass the \
output of the first function call as the input of the \
second function call.";

const wordsUsed = unique(words(text))
console.log('wordsUsed: ', wordsUsed);

const wordsUsedByRamda = compose(skipShortWords, unique, words);
const wordsUsedByRamda1 = compose(skipLongWords, unique, words);
console.log('wordsUsedByRamda1: ', wordsUsedByRamda1(text));
console.log('wordsUsedByRamda: ', wordsUsedByRamda(text));


/**
 * 抽象
 */
 function saveComment(txt) {
	if (txt != "") {
		comments[comments.length] = txt;
	}
}

function trackEvent(evt) {
	if (evt.name !== undefined) {
		events[evt.name] = evt;
	}
}

const storeData = (store, location, val, checkFn) => {
  if (checkFn(val, store, location)) {
    store[location] = val;
  }
}

const isUndefined = val => val === undefined;
const notEmpty = val => val !== "";
const isPropUndefined = (val, obj, prop) => isUndefined(obj[prop]);

const comments = {}
function saveComment1(txt) {
  return storeData(comments, comments.length, txt, notEmpty)
}

function trackEvent2(evt) {
  return storeData(events, evt.name, evt, isPropUndefined)
}



// 回顾形参
// 提供该API：ajax( url, data, cb )
function ajax(url, data, callback) {
  console.log(url, data, callback);
}
var getPerson = partial( ajax, "http://some.api/person" );
var getLastOrder = partial( ajax, "http://some.api/order", { id: -1 } );

const output = val => val;

getLastOrder( function orderFound(order){
	getPerson( { id: order.personId }, function personFound(person){
		output( person.name );
	} );
} );


// 提取personFound
// const extractName = person => person.name;
const prop = (name, obj) => obj[name];
const setProp = (name, obj, val) => ({...obj, [name]: val})
const extractName = partial(prop, "name")

const outputPersonName = compose(output, extractName);
getLastOrder( function orderFound(order){
	getPerson( { id: order.personId }, outputPersonName);
});


const makeObjProp = (name, val) => setProp(name, {}, val);
const extractPersonId = partial(prop, "personId");
const personData = partial(makeObjProp, 'id');
const processPerson = partialRight(getPerson, outputPersonName)

const lookupPerson = compose(processPerson, personData, extractPersonId)
getLastOrder(lookupPerson)
