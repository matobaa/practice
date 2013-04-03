/*
 * Copyright (C) 2012-2013 MATOBA Akihiro <matobaa+trac-hacks@gmail.com>
 * All rights reserved.
 *
 * This software is licensed as described in the file COPYING, which
 * you should have received as part of this distribution.
 */
require.config({
  shim: {
    "kinetic.selectable": ["kinetic-v4.4.0"]
  },
  waitSeconds: 30 // for Debug
});

require(
    ["jquery", "kinetic-v4.4.0", "kinetic.selectable"],
    function($) {
      $(function() {

        var stage = new Kinetic.Stage({
          container: 'container',
          width: 1000,
          height: 200,
        });

        var layer = new Kinetic.Layer();

        var oval = new Kinetic.Ellipse({
          x: stage.getWidth() / 2 + 100,
          y: stage.getHeight() / 2 + 50,
          radius: {
            x: 50,
            y: 100
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
        stage.add(layer);
        layer.draw();
      }); // document.ready
    });// retuire.js
