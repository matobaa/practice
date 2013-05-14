// Kinetic Extension

(function() {

  var selection = [];

  var unselect_all = function() {
    for ( var n = selection.length; n >= 0; n--) {
      unselect(selection[n]);
    }
  };
  
  var unselect = function(node) {
    index = selection.indexOf(node);
    if(index == -1) return;
    popAttr(selection[index]);
    selection[index].getLayer().draw();
    selection.splice(index, 1);
    
  }

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
    var stage = this;
    
    var consume = function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      evt.returnValue = false;  // for IE
      evt.cancelBubble = true;  // for IE
      return HANDLED;
    }
    var HANDLED = false;
    var NOT_HANDLED = !HANDLED;
    
    var handler_D = function(stage, evt) {
      switch (evt.keyCode) {
        case 'R'.charCodeAt(0): // Draw Rectangle; FIXME: this is Trial Code.
          var layer = stage.children[0];
          layer.add(new Kinetic.Rect({
            x: stage.getWidth() / 2 + 100,
            y: stage.getHeight() / 2 + 50,
            width: 100,
            height: 100,
            fill: 'yellow',
            stroke: 'green',
            strokeWidth: 2,
            draggable: true,
          }));
          stage.draw();
          return stage.handler = consume(evt);  // FIXME: cannot clear handler_D for handler
        default:
          break;
      }
      return NOT_HANDLED;
    };
    
    if (evt.keyCode == 27) { // ESC
        unselect_all();
        this.draw();
        return consume(evt);
    }      
    if(stage.handler && (stage.handler(stage, evt) == HANDLED))
      return HANDLED;
    
    switch(evt.keyCode) {    
      case 'D'.charCodeAt(0): // Draw
        stage.handler = handler_D;
        return consume(evt);
    default:
      break;
  }
  return NOT_HANDLED;
};

//  Kinetic.Stage.prototype._initStage_original = Kinetic.Stage.prototype._initStage;
  Kinetic.Stage.prototype._initStage_original = Kinetic.Stage.prototype._initStage;

  Kinetic.Stage.prototype._initStage = function(config) {
    this._initStage_original(config);
    this.getContent().setAttribute('tabindex', 0);
    stage = this;
    $(this.getContent()).keydown(function(e) {
      stage._keypress(e);
    });
  };

  Kinetic.Shape.prototype._initShape_original = Kinetic.Shape.prototype._initShape;

  Kinetic.Shape.prototype._initShape = function(config) {
    this._initShape_original(config);
    var indrag = false;
    this.on('dragstart', function(evt) {
      indrag = true;
    });
    this.on('dragend', function(evt) {
      indrag = false;
    });
    this.on('click', function(evt) {
      if (indrag) return; // ignore click when dragging 
      if (!evt.shiftKey) unselect_all(); // exclusive select
      evt.targetNode.select(evt);
    });
  }

  Kinetic.Shape.prototype.select = function(evt) {
    // SYNOPSIS: Shape.pushAttr( {name: value, ...} )
    shape = this;
    
    index = selection.indexOf(shape);
    if(index != -1) {
      unselect(selection[index]);
      return;
    } 

    pushAttr(shape, {
//      'dashArray': [6, 6],
//      'dashArrayEnabled': true,
      'stroke': 'red',
      'strokeWidth': this.getStrokeWidth() + 1,
      'strokeEnabled': true,
    });

    selection.push(this);
    this.getLayer().draw();
  };

  Kinetic.DD._drag_original = Kinetic.DD._drag;
  Kinetic.DD._drag = function(evt) {
    var dd = Kinetic.DD, 
    node = dd.node;
    if(node) var pb = node.getPosition(); // position before drag tick
    Kinetic.DD._drag_original(evt);
    if(node) {
      var pa = node.getPosition(); // position after drag tick
      if (selection.indexOf(node) != -1) {
        for ( var i in selection) {
          if (selection[i] == node) continue; // skip me
          if (selection[i].getDraggable()) {
            selection[i].move(pa.x - pb.x, pa.y - pb.y);  
          }
        }
      }
    }
  }
  
  
  // Extend Shapes
  Shapes = [Kinetic.Rect, Kinetic.Circle, Kinetic.Wedge, Kinetic.Ellipse,
      Kinetic.Image, Kinetic.Polygon, Kinetic.Text, Kinetic.Line,
      Kinetic.Sprite, Kinetic.Path, Kinetic.TextPath, Kinetic.RegularPolygon,
      Kinetic.Star, Kinetic.LabelRect, ];
  for ( var i in Shapes) {
    Kinetic.Global.extend(Shapes[i], Kinetic.Shape);
    Shapes[i].prototype._initShape = Kinetic.Shape.prototype._initShape; //  Force override existing function
  }
  ;
})();
