  (function() {

  // utility function
  var extend = function(base, ext) {
    result = {};
    for (name in base) { result[name] = base[name] }
    for (name in ext ) { result[name] = ext [name] }  // override if conflict
    return result;
  }
  
  // prepare original
  Target = function() {};

  Target.prototype = {
    param: 'original',
    other: 'Hello, ',
    echo: function(message) {return this.other + message;}
  };

  Target.prototype.other = "Cheers, "; 

  // extend
  Target.prototype = (function(base) {
    return extend(base, {
      param: 'extended for ' + base.param,
      echo: function(param) {return base.echo(param) + '!'}
    });
  })(Target.prototype);
  
  Target.prototype.other = "Hi, "; 
  
  // confirmation
  var t = new Target();
  console.log(t);
  console.log(t.param);
  console.log(t.other);
  console.log(t.echo('there'));

})();
