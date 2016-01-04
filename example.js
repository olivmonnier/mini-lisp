var util = require('util');

var tokenizer = require('./tokenizer');
var parser = require('./parser');

var text = '(def avg (x y) ( / (+ x y ) 2)) (def addOne (x) (+ x 1)) (test = 0) (if (test === 1) (do (+ test 1)) (else (- test 1)))';

var tokens = tokenizer(text);
var tree = parser(tokens);

console.log(util.inspect(tree, false, null));
