module.exports = {
  debug: {
    print: function(x){ console.log(x); }
  },
  math: {
    add: function(x, y){ return x + y; },
  	subtract: function(x, y){ return x - y; },
  	multiply: function(x, y){ return x * y;},
  	divide: function(x, y){ return x / y; },
    modulus: function(x, y){ return x % y; }
  }
}
