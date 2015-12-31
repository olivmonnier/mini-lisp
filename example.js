var util = require('util');

var tokenizer = require('./tokenizer');
var parser = require('./parser');

var text = '(def avg (x y) ( / (+ x y ) 2)) (def addOne (x) (+ x 1)) (print (if avg (addOne 10) (addOne 20)))';

var tokens = tokenizer(text);
var tree = parser(tokens);

console.log(util.inspect(tree, false, null));
