(function() {

  Kinetic.Hyperbola = function(config) {
    this._initHyperbola(config);
  };

  Kinetic.Hyperbola.prototype = {
    _initHyperbola: function(config) {
      this.createAttrs();

      // call super constructor
      Kinetic.Shape.call(this, config);
      this.shapeType = 'Hyperbola';
      this._setDrawFuncs();
    },
    drawFunc: function(canvas) {
      x,y,w,h;
      
      var context = canvas.getContext(),
          innerRadius = this.attrs.innerRadius,
          outerRadius = this.attrs.outerRadius,
          numPoints = this.attrs.numPoints;

      context.beginPath();
      context.moveTo(0, 0 - this.attrs.outerRadius);
      context.arc(width - cornerRadius, cornerRadius, cornerRadius, Math.PI * 3 / 2, 0, false);
      
      
      for ( var n = 1; n < numPoints * 2; n++) {
        var radius = n % 2 === 0 ? outerRadius : innerRadius;
        var x = radius * Math.sin(n * Math.PI / numPoints);
        var y = -1 * radius * Math.cos(n * Math.PI / numPoints);
        context.lineTo(x, y);
      }
      context.closePath();

      canvas.fillStroke(this);
    }
  };
  Kinetic.Global.extend(Kinetic.Hyperbola, Kinetic.Shape);

})();
