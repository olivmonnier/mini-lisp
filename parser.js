var constants = require('./constants.js');
var _ = require('lodash');
var Tree = require('./tree.js');
var AstResult = require('./ast.js');

var FUNC_NAMES = constants.coreFunctions.slice();

module.exports = function Parser(tokens){
  var ast = new AstResult();
	var parserMap = {
		'operator': processOperators,
		'keyword':	processKeywords,
		'number': 	processValue,
		'string': 	processValue
	}
  _.each(tokens, function(token){
    var func = parserMap[token.type];
    func(token, ast);
  })
  return ast;
}

function processOperators(token, ast) {}

function processValue(token, ast) {}

function processKeywords(token, ast) {}
