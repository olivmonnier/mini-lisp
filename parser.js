var constants = require('./constants.js');
var _ = require('lodash');
var Tree = require('./tree.js');
var AstResult = require('./ast.js');

var FUNC_NAMES = constants.coreFunctions.slice();
var COND_NAMES = constants.conditions.slice();

module.exports = function Parser(tokens) {
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
  });
  return ast;
}

function processOperators(token, ast) {
  switch (token.value) {
    case constants.openParens:
      var tree = new Tree();
      ast.newTree(tree);
      break;
    case constants.plus:
    case constants.minus:
    case constants.times:
    case constants.divide:
      ast.pointer.setType('function');
      ast.pointer.setValue(token.value);
      break;
    case constants.closeParens:
      ast.back();
      break;
    default:
      if (_.contains(constants.assignments, token.value)) {
        ast.pointer.setType('assignment');
        ast.pointer.setValue(token.value);

      } else if (_.contains(constants.comparison, token.value)) {
        var tree  = new Tree();
        tree.setType('comparison');
        tree.setValue(token.value);
        ast.pointer.insert(tree);
      }
  }
}

function processValue(token, ast) {
  // values are children of function nodes so when we reach a value
  // we just add it as a new child of the current node
  var tree = new Tree();
  tree.setType('value');
  tree.setValue(token.value);
  ast.pointer.insert(tree);
}

function processKeywords(token, ast) {
  if (ast.pointer.get('type') === 'function' && ast.pointer.get('value') === 'def') {
    var tree = new Tree();
    tree.setType('function_name');
    tree.setValue(token.value);
    FUNC_NAMES.push(token.value)
    ast.pointer.insert(tree);

  } else if (ast.pointer.get('value') === null && !_.contains(FUNC_NAMES, token.value) && !_.contains(COND_NAMES, token.value)) {
    ast.pointer.setType('arguments');
    var tree = new Tree();
    tree.setType('variable');
    tree.setValue(token.value);
    ast.pointer.insert(tree);

  } else if (_.contains(FUNC_NAMES, token.value)) {
    ast.pointer.setType('function');
    ast.pointer.setValue(token.value);

  } else if (_.contains(COND_NAMES, token.value)) {
    ast.pointer.setType('condition');
    ast.pointer.setValue(token.value);
  } else {
    processValue(token, ast);
  }
}
