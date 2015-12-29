var tokenizer = require('./tokenizer');

var text = '(add 1 2)';
var tokens = tokenizer(text);
console.log(tokens);
