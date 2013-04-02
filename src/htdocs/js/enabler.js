/*
 * Copyright (C) 2012-2013 MATOBA Akihiro <matobaa+trac-hacks@gmail.com>
 * All rights reserved.
 * 
 * This software is licensed as described in the file COPYING, which
 * you should have received as part of this distribution.
 */

requirejs.config({
  shim: {
    'jquery.ui.core': ['jquery']
    ,'jquery.ui.widget': ['jquery.ui.core']
    ,'jquery.ui.mouse': ['jquery.ui.core']
    ,'jquery.ui.selectable': ['jquery.ui.widget']
    ,'jquery.ui.draggable': ['jquery.ui.widget']
    ,'jquery.ui.resizable': ['jquery.ui.widget']
  }
});

require(["jquery"
    ,"kinetic-v4.3.3"
    ,"jquery.ui.core"
    ,"jquery.ui.widget"
    ,"jquery.ui.mouse"
    ,"jquery.ui.selectable"
    ,"jquery.ui.draggable"
    ,"jquery.ui.resizable"
    ], function($) {
  $(document).ready(function() {
    $('#ticket').css('background-color', 'azure');
    $('#ticket').draggable();
    $('#ticket').resizable();
    $('#ticket').selectable();
    $('#container').css('border-color', 'red');
    $('#container').css('border-width', 'thin');
    $('#container').css('border-style', 'dotted');

    // # Kinetic Extension

    Kinetic.Stage.prototype.selection = [];

    Kinetic.Stage.prototype.unselect = function(evt) {
        for(var n = 0; n < this.selection.length; n++) {
            this.selection[n].popAttr();
        };
    };

    // TODO: bind function below to canvas context, like as kinetic.js[_bindContentEvents] l.4459

    Kinetic.Stage.prototype._keypress = function(evt) {
      if (evt.keyCode == 27) { // ESC
        this.unselect();
        this.draw();
        evt.preventDefault(); // to stop the key events from bubbling up
      } else {
        // Do Nothing; Not Implemented
      }
    };

    Kinetic.Stage.prototype._initStage_original = Kinetic.Stage.prototype._initStage;
    
    Kinetic.Stage.prototype._initStage = function(config) {
        this._initStage_original(config);
        this.enableKey();
    };
    
    Kinetic.Stage.prototype.enableKey = function() {
      $(this.getContent()).attr('tabindex', 0);
                  $(this.getContent()).keydown(function(e) {
                    stage._keypress(e);
                    e.preventDefault(); // to stop the key events from bubbling up
                  });
                }
    
    Kinetic.Shape.prototype.select = function(evt) {
      stage = evt.shape.getStage();
      stage.unselect();

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
      layer.draw();
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
    Kinetic.Global.extend(Kinetic.Star, Kinetic.Shape);
    Kinetic.Global.extend(Kinetic.RegularPolygon, Kinetic.Shape);
    Kinetic.Global.extend(Kinetic.Path, Kinetic.Shape);
    Kinetic.Global.extend(Kinetic.TextPath, Kinetic.Shape);

    var stage = new Kinetic.Stage({
      container: 'container',
      width: 1000,
      height: 200,
    });

    var layer = new Kinetic.Layer();

    var oval = new Kinetic.Ellipse({
      x: stage.getWidth() / 2,
      y: stage.getHeight() / 2,
      radius: { x: 100, y: 50 },
      fill: 'yellow',
      stroke: 'green',
      strokeWidth: 2,
      draggable: true,
    });
    layer.add(oval);
    oval2 = oval.clone();
    layer.add(oval2);
    stage.add(layer);
    layer.draw();
    oval.on('click', oval.select);  // When clicked, Select it
    oval2.on('click', oval2.select); // TODO: move to INIT on Shape
  }); // document.ready
}); // retuire.js
