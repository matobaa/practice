// Kinetic Extension

Kinetic.Stage.prototype.selection = [];

Kinetic.Stage.prototype.unselect = function(evt) {
  for ( var n = 0; n < this.selection.length; n++) {
    this.selection[n].popAttr();
  }
};

Kinetic.Stage.prototype._keypress = function(evt) {
  if (evt.keyCode == 27) { // ESC
    this.unselect();
    this.draw(); // to stop the key events from bubbling up
    evt.preventDefault();
  } else {
    // Do Nothing; Not Implemented
  }
};

Kinetic.Stage.prototype._initStage_original = Kinetic.Stage.prototype._initStage;

Kinetic.Stage.prototype._initStage = function(config) {
  this._initStage_original(config);
  this.getContent().setAttribute('tabindex', 0);
  stage = this;
  $(this.getContent()).keydown(function(e) {
    stage._keypress(e);
    e.preventDefault(); // to stop the key events from bubbling up
  });
};

Kinetic.Stage.prototype.add_original = Kinetic.Stage.prototype.add;

Kinetic.Stage.prototype.add = function(layer) {
    this.add_original(layer);
    this.on('click', function(evt) {
      this.unselect(); // exclusive select
      (evt.shape || evt.targetNode).select(evt);
    });
}
  
Kinetic.Shape.prototype.select = function(evt) {
  // SYNOPSIS: Shape.pushAttr( {name: value, ...} )
  this.pushAttr = function(arr) {
    this.stack = this.stack || [];
    var attrs = {}
    for ( var key in arr) {
      attrs[key] = this.attrs[key] || {};
      this.setAttr(key, arr[key]);
    }
    this.stack.push(attrs);
  }
  this.popAttr = function(key) {
    if (!this.stack) return undefined;
    var attrs = this.stack.pop();
    for ( var key in attrs) {
      this.setAttr(key, attrs[key]);
    }
    return attrs;
  }

  this.pushAttr({
    'dashArray': [6, 6],
    'dashArrayEnabled': true,
    'stroke': 'red',
    'strokeWidth': this.getStrokeWidth() + 2,
    'strokeEnabled': true,
  });
  stage.selection.push(this);
  this.getLayer().draw();
};

Kinetic.Shape.prototype._initShape_original = Kinetic.Shape.prototype._initShape;

Kinetic.Shape.prototype._initShape = function(config) {
  this._initShape_original(config);
  this.on('click', this.select);
}
  
Kinetic.Global.extend(Kinetic.Rect, Kinetic.Shape);
Kinetic.Global.extend(Kinetic.Circle, Kinetic.Shape);
Kinetic.Global.extend(Kinetic.Wedge, Kinetic.Shape);
Kinetic.Global.extend(Kinetic.Ellipse, Kinetic.Shape);
Kinetic.Global.extend(Kinetic.Image, Kinetic.Shape);
Kinetic.Global.extend(Kinetic.Polygon, Kinetic.Shape);
Kinetic.Global.extend(Kinetic.Text, Kinetic.Shape);
Kinetic.Global.extend(Kinetic.Line, Kinetic.Shape);
Kinetic.Global.extend(Kinetic.Sprite, Kinetic.Shape);
Kinetic.Global.extend(Kinetic.Star, Kinetic.Shape);
Kinetic.Global.extend(Kinetic.RegularPolygon, Kinetic.Shape);
Kinetic.Global.extend(Kinetic.Path, Kinetic.Shape);
Kinetic.Global.extend(Kinetic.TextPath, Kinetic.Shape);

Kinetic.Node.prototype.focus = function() {};
