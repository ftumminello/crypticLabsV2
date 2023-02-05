const functions = require('../modules/functions');

const a = functions.generatePasscode(6, 'ABCDEF12344567');
const b = functions.generatePromocodeArr(6, 15);
const c = functions.generateUUID();
console.log(a);
console.log(b);
console.log(c);