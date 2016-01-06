var util = require('util');

var tokenizer = require('./tokenizer');
var parser = require('./parser');
var generator = require('./generator');

var text = '(def avg (x y) ( / (+ x y ) 2)) (def addOne (x) (+ x 1)) (test = (def toto () (print "toto"))) (if (test === 1) (do (avg test 1)) (else (- test 1)))';
//var text = '(def avg (x y) ( / (+ x y ) 2)) (avg 1 2)';

var tokens = tokenizer(text);
var tree = parser(tokens);
var output = generator(tree.roots);

//console.log(util.inspect(tokens, false, null))
//console.log(util.inspect(tree, false, null));
console.log(output);
