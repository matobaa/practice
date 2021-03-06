// Kinetic Extension

(function() {
  
  Kinetic.Stage.prototype._keypress = function(evt) {

    var stage = this;
    
    var HANDLED = false;
    var root = HANDLED;
    var NOT_HANDLED = !HANDLED;
    
    var consume = function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      evt.returnValue = false;  // for IE
      evt.cancelBubble = true;  // for IE
      return root;
    }

    if (evt.keyCode == 219) { // ^[  // cancel keystroke context
      stage.handler = root;
      return consume(evt);
    }
    
    if (evt.keyCode == 27) { // ESC  // clear selection 
      this.unselect_all();
      return consume(evt);
    }
    
    var command_DR = function() {   // Draw Rectangle; FIXME: this is Trial Code.
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
    }

    var command_AR = function(stage, evt) {  // Align Right; FIXME: this is Trial Code
      stage.align_right();
    }

    var handler_D = function(stage, evt) {
      switch (evt.keyCode) {
        case 'R'.charCodeAt(0):
          command_DR();
          return stage.handler = consume(evt);
        default:
          break;
      }
      return NOT_HANDLED;
    };

    var handler_A = function(stage, evt) {
      switch (evt.keyCode) {
        case 'R'.charCodeAt(0):
          command_AR(stage, evt);
          return stage.handler = consume(evt);
        default:
          break;
      }
      return NOT_HANDLED;
    };
    
    if(stage.handler && (stage.handler(stage, evt) == HANDLED))
      return HANDLED;
    
    // FIXME: stopgap code
    map = {'D': {'R': command_DR} }
    console.log(map);
    
    // root key handler
    switch(evt.keyCode) {    
      case 'D'.charCodeAt(0): // Draw
        stage.handler = handler_D;
        return consume(evt);
      case 'A'.charCodeAt(0): // Align
        stage.handler = handler_A;
        return consume(evt);
      default:
        break;
    }
    return NOT_HANDLED;
  };

})();


//Kinetic Extension

(function() {
  
  // local functions
  var selection = [];

  var unselect_all = function() {
    for ( var n = selection.length - 1; n >= 0; n--) {
      unselect(selection[n]);
    }
  };

  var align_right = function() {
    var alignto;
    var node;
    var pos;
    alignto = selection[selection.length - 1];
    if(!alignto) return;
    alignto = alignto.getX() + alignto.getWidth();
    for ( var n = selection.length - 2; n >= 0; n--) {
      node = selection[n];
      pos = node.getPosition();
      pos.x = alignto - node.getWidth();
      node.setPosition(pos);
    }
    node && node.getLayer().draw();
  }
  
  Kinetic.Stage.prototype.unselect_all = unselect_all; // called by KeyHandler
  Kinetic.Stage.prototype.align_right = align_right; // called by KeyHandler
  
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

  Kinetic.Stage.prototype._initStage = (function(wrapped) {
    return function(config) {
      wrapped.apply(this, arguments);
      this.getContent().setAttribute('tabindex', 0);
      stage = this;
      $(this.getContent()).keydown(function(e) {
        stage._keypress(e);
      });
      this.on('click', function(evt) {
        console.log(evt); // FIXME: stopgap implementation
      });
    };
  })(Kinetic.Stage.prototype._initStage);

  Kinetic.Shape.prototype._initShape = (function(wrapped) {
    return function(config) {
      wrapped.apply(this, arguments);
      var indrag = false;
      this.on('dragstart', function(evt) {
        indrag = true;
      });
      this.on('dragend', function(evt) {
        indrag = false;
      });
      this.on('click', function(evt) {
        if (indrag) return; // ignore click when dragging 
        var index = selection.indexOf(evt.targetNode);
        var found = index != -1;
        if( found &&  evt.shiftKey) {
          unselect(selection[index]);
          return;
        }
        if( found && !evt.shiftKey) {
          var node = selection.splice(index, 1)[0];
          selection.push(node);  // move clicked node to last of selection
          return;
        }
        if(!found && !evt.shiftKey) unselect_all(); // select new node
        evt.targetNode.select(evt);
      });
    }
  })(Kinetic.Shape.prototype._initShape);

  Kinetic.Shape.prototype.select = function(evt) {
    // SYNOPSIS: Shape.pushAttr( {name: value, ...} )
    shape = this;

    pushAttr(shape, {
      'stroke': 'red',
      'strokeWidth': this.getStrokeWidth() + 1,
      'strokeEnabled': true,
    });

    selection.push(this);
    this.getLayer().draw();
  };

  Kinetic.DD._drag = (function(wrapped) {
    return function(evt) {
      var dd = Kinetic.DD, 
      node = dd.node;
      if(node) var pb = node.getPosition(); // position before drag tick
      wrapped.apply(Kinetic.DD, arguments);
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
  })(Kinetic.DD._drag);
  
  
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
