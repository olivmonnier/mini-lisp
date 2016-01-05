var _ = require('lodash');
var constants = require('./constants');

var Controller = function() {
  this.result = '';
}

module.exports = interpreter = function(roots) {
  var controller = new Controller();
  _.each(roots, function(node) {
    interpretNode(node, controller);
  });
  return controller.result;
};

function interpretNode(node, controller) {
  var type = node.get('type');
  var value = node.get('value');

  if (type === 'function') {
    if (value === 'def') {
      writeCustomFunction(node, controller);
    } else {
      writeFunction(node, controller);
    }
  } else if (type === 'assignment') {
    writeAssignment(node, controller);
  } else if (type === 'condition') {
    writeCondition(node, controller);
  } else {
    controller.result += node.get('value');
  }
}

function writeAssignment(node, controller) {
  var value = node.get('value');
  var variable = (node.children[0].data.type === 'variable') ? 'var ' : '';
  variable += node.children[0].data.value;
  controller.result += variable + value;
  interpretNode(node.children[1], controller);
}

function writeCondition(node, controller) {
  var value = node.get('value');
  if ((value === 'if') || (value === 'elseif')) {
    var condition = _.result(_.find(node.children, function(child) {
      return child.data.type === 'arguments';
    }), 'children');
    var operator = _.result(_.find(condition, function(arg) {
      return arg.data.type === 'comparison';
    }), 'data.value');
    var values = condition.filter(function(arg) {
      return arg.data.type !== 'comparison';
    });
    controller.result += value + '(' + values[0].data.value + operator + values[0].data.value + ') {\n';
    var conditions = node.children.filter(function(arg) {
      return arg.data.type === 'condition';
    });
    _.each(conditions, function(condition) {
      interpretNode(condition, controller);
    });
    controller.result += '\n}\n';
  } else if ((value === 'do') || (value === 'else')) {
    controller.result += value + '{\n';
    interpretNode(node.children, controller);
    controller.result += '\n}\n';
  }
}

function writeFunction(ast, controller) {
	var value = ast.get('value');
	var functionName = constants.functionMap[value];
	if (functionName === undefined) {
		functionName = value;
	}
	controller.result += functionName + '(';
	_.each(ast.children, function(argument, idx) {
		interpretNode(argument, controller);
		if (ast.children.length > 1 && idx < ast.children.length-1) {
			controller.result += ', ';
		}
	});
	controller.result += ')';
}

function writeCustomFunction(node, controller) {
	var functionName = node.children[0];
	var arguments = node.children[1];
	var functionBody = node.children[2];

	controller.result += 'function ' + functionName.get('value') + '(';

	var numArgs = arguments.children.length;

	_.each(arguments.children, function(argNode, idx) {
		controller.result += argNode.get('value');
		if (numArgs > 1 && idx < numArgs - 1) {
			controller.result += ', ';
		}
	});

	controller.result += ') {\n';

	var customController = new Controller();
	interpretNode(functionBody, customController);

	controller.result += 'return '+customController.result+ ';';
	controller.result += '\n}\n';
}
