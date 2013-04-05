// Kinetic Extension

(function() {
  
  var selection = [];

  var unselect = function() {
    for ( var n = 0; n < selection.length; n++) {
      popAttr(selection[n]);
    }
  };
  
  var pushAttr = function(shape, arr) {
    shape.stack = shape.stack || [];
    var attrs = {}
    for ( var key in arr) {
      attrs[key] = shape.attrs[key] || {};
      shape.setAttr(key, arr[key]);
    }
    shape.stack.push(attrs);
  };
  
  var popAttr = function(shape, key) {
    if (!shape.stack) return undefined;
    var attrs = shape.stack.pop();
    for ( var key in attrs) {
      shape.setAttr(key, attrs[key]);
    }
    return attrs;
  };

  Kinetic.Stage.prototype._keypress = function(evt) {
    if (evt.keyCode == 27) { // ESC
      unselect();
      this.draw();
      evt.preventDefault(); // to stop the key events from bubbling up
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
    });
  };

  Kinetic.Stage.prototype.add_original = Kinetic.Stage.prototype.add;

  Kinetic.Stage.prototype.add = function(layer) {
    this.add_original(layer);
    // TODO: Fix a bug:
    // Stage で DDの状態を見るのでは遅い。
    //    ∵ Node.mouseup で DD.isDragging を False にしたあと、
    //    Stage.mouseup が handle されるなかで
    //    !DD.isDragging のとき click.fire される。
    //    つまり必ず dd終わりでstage.clickはfireする。
    // さて、どう解決する?
    //    Node.click にバインドすればいいかも。←こっち実現できる?
    //    Stage で dd.isDragging相当のフラグを持たせると判断つくかも。
    this.on('click', function(evt) {
      if(!evt.shiftKey)
        unselect(); // exclusive select
      evt.targetNode.select(evt);
    });
  }

  Kinetic.Shape.prototype.select = function(evt) {
    // SYNOPSIS: Shape.pushAttr( {name: value, ...} )
    shape = this;

    pushAttr(shape, {
      'dashArray': [6, 6],
      'dashArrayEnabled': true,
      'stroke': 'red',
      'strokeWidth': this.getStrokeWidth() + 1,
      'strokeEnabled': true,
    });
    
    selection.push(this);
    this.getLayer().draw();
  };

  Kinetic.Global.extend(Kinetic.Rect, Kinetic.Shape);
  Kinetic.Global.extend(Kinetic.Circle, Kinetic.Shape);
  Kinetic.Global.extend(Kinetic.Wedge, Kinetic.Shape);
  Kinetic.Global.extend(Kinetic.Ellipse, Kinetic.Shape);
  Kinetic.Global.extend(Kinetic.Image, Kinetic.Shape);
  Kinetic.Global.extend(Kinetic.Polygon, Kinetic.Shape);
  Kinetic.Global.extend(Kinetic.Text, Kinetic.Shape);
  Kinetic.Global.extend(Kinetic.Line, Kinetic.Shape);
  Kinetic.Global.extend(Kinetic.Sprite, Kinetic.Shape);
  Kinetic.Global.extend(Kinetic.Path, Kinetic.Shape);
  Kinetic.Global.extend(Kinetic.TextPath, Kinetic.Shape);
  Kinetic.Global.extend(Kinetic.RegularPolygon, Kinetic.Shape);
  Kinetic.Global.extend(Kinetic.Star, Kinetic.Shape);
  Kinetic.Global.extend(Kinetic.LabelRect, Kinetic.Shape);

})();
