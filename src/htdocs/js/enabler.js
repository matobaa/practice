/*
 * Copyright (C) 2012-2013 MATOBA Akihiro <matobaa+trac-hacks@gmail.com>
 * All rights reserved.
 *
 * This software is licensed as described in the file COPYING, which
 * you should have received as part of this distribution.
 */
require.config({
  shim: {
    "kinetic.selectable": ["kinetic-v4.4.1"]
  },
  waitSeconds: 30 // for Debug
});

require(
    ["jquery", "kinetic-v4.4.1", "kinetic.selectable"],
    function($) {
      $(function() {

        var stage = new Kinetic.Stage({
          container: 'container',
          width: 1000,
          height: 600,
        });

        var layer = new Kinetic.Layer();

        var oval = new Kinetic.Ellipse({
          x: stage.getWidth() / 2 + 100,
          y: stage.getHeight() / 2 + 50,
          radius: {
            x: 50,
            y: 50
          },
          fill: 'yellow',
          stroke: 'green',
          strokeWidth: 2,
          draggable: true,
        });
        layer.add(oval);
        var oval = new Kinetic.Ellipse({
          x: stage.getWidth() / 2,
          y: stage.getHeight() / 2,
          radius: {
            x: 100,
            y: 50
          },
          fill: 'pink',
          stroke: 'white',
          strokeWidth: 1,
          draggable: false,
        });
        layer.add(oval);
        var oval = new Kinetic.Rect({
          x: stage.getWidth() / 2,
          y: stage.getHeight() / 2,
          width: 50,
          height: 100,
          fill: 'green',
          stroke: 'black',
          strokeWidth: 4,
          draggable: true,
        });
        layer.add(oval);
        var label = new Kinetic.Label({
          x: stage.getWidth() / 2,
          y: stage.getHeight() / 2,
          listening: true,
          text: {
            text: 'Tooltip pointing down',
            fontFamily: 'Calibri',
            fontSize: 18,
            padding: 5,
            fill: 'white'
          },
          draggable: true,
          rect: {
            fill: 'black',
            pointerDirection: 'down',
            pointerWidth: 10,
            pointerHeight: 10,
            lineJoin: 'round',
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: 10,
            shadowOpacity: 0.5
          }
        })
        layer.add(label);

        stage.add(layer);
        layer.draw();
        
      }); // document.ready
    });// retuire.js
