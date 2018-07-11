/// var date = new Date();
// console.log(date.getMonth());
//
//
var moment = require('moment');
var date = moment(); // current date

date.add(1, 'year').subtract(9, 'months');
console.log(date.format('MMM Do, YYYY'));



//tema
// 10:35 am
console.log(date.format('h:mm a'));


var createdAt = 1234;
var date = moment(createdAt);
console.log(date.format('h:mm a'));

//timestamp cu moment
var someTimestamp = moment().valueOf();
console.log(someTimestamp);