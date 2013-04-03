/*
 * Copyright (C) 2012-2013 MATOBA Akihiro <matobaa+trac-hacks@gmail.com>
 * All rights reserved.
 *
 * This software is licensed as described in the file COPYING, which
 * you should have received as part of this distribution.
 */
require.config({
  shim: {
    "kinetic.selectable": ["kinetic-v4.3.3"]
  },
  waitSeconds: 30 // for Debug
});

require(
    ["jquery", "kinetic-v4.3.3", "kinetic.selectable"],
    function($) {
      $(function() {

        var stage = new Kinetic.Stage({
          container: 'container',
          width: 1000,
          height: 200,
        });

        var layer = new Kinetic.Layer();

        var oval = new Kinetic.Ellipse({
          x: stage.getWidth() / 2,
          y: stage.getHeight() / 2,
          radius: {
            x: 100,
            y: 50
          },
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
//        oval.on('click', oval.select); // When clicked, Select it
//        oval2.on('click', oval2.select); // TODO: move to INIT on Shape
      }); // document.ready
    });// retuire.js
