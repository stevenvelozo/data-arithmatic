const libDataArithmatic = require('../source/DataArithmatic.js');

let _DataArithmatic = new libDataArithmatic();

// The insecureStringHash function generates stable hashes based on a passed-in string
// You can define a custom prefix string, but it defaults to HSH
let tmpHash = _DataArithmatic.insecureStringHash('Dogs');

// tmpHash equals 'HSH2135767'
console.log(tmpHash);