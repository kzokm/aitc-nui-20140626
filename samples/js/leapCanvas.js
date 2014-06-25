(function() {
  LeapCanvas = function(domElement) {
    if (domElement === undefined) {
      domElement = document.createElement('canvas');
    }
    this.domElement = domElement;
    this.context = domElement.getContext('2d');
  };

  LeapCanvas.prototype = {
    width: 0, height: 0,
    iBoxArea: {
      scale: { width: 0.4, height: 0.5 }
    },
    direction: {
      X: 0, Y: 1, Z: 2
    },

    setSize: function(width, height) {
      this.domElement.width = this.width = width;
      this.domElement.height = this.height = height;

      var box = this.iBoxArea;
      box.left = width * ((1.0 - box.scale.width) / 2);
      box.top = height * ((1.0 - box.scale.height) / 2);
      box.width = width - box.left * 2;
      box.height = height - box.top * 2;

      this.clear();
      return this;
    },

    clear: function() {
      this.context.clearRect(0, 0, this.width, this.height);
      this.drawIBoxArea();
      return this;
    },

    drawIBoxArea: function() {
      var box = this.iBoxArea;
      var c = this.context;
      c.strokeStyle = 'black';
      c.lineWidth = 1;
      c.strokeRect(box.left, box.top, box.width, box.height);
    },

    drawLine: function(from, to, color) {
      var c = this.context;
      c.strokeStyle = color;
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(from.x, from.y)
      c.lineTo(to.x, to.y)
      c.closePath();
      c.stroke();
      return this;
    },

    drawCircle: function(center, radius, color) {
      var c = this.context;
      c.strokeStyle = color;
      c.lineWidth = 3;
      c.beginPath();
      c.arc(center.x, center.y, radius, 0, Math.PI * 2);
      c.closePath();
      c.stroke();
      return this;
    },

    fillCircle: function(center, radius, color) {
      var c = this.context;
      c.fillStyle = color;
      c.beginPath();
      c.arc(center.x, center.y, radius, 0, Math.PI * 2);
      c.closePath();
      c.fill();
      return this;
    },

    leapToScene: function(frame, leapPosition) {
      var X = this.direction.X, Y = this.direction.Y, Z = this.direction.Z;
      var box = this.iBoxArea;

      normalized = frame.interactionBox.normalizePoint(leapPosition);
      var pos = {
        x: normalized[X] * box.width + box.left,
        y: normalized[Y] * box.height + box.top,
        distance: Leap.vec3.distance(normalized,
                                     Leap.vec3.fromValues(0.5, 0.5, 0.5))
      };

      if (Y != 2) {
        pos.y = this.height - pos.y;
      }

      var radius = Math.sqrt(normalized[Z]) * Math.min(box.width, box.height) / 16.0 || 0;
      pos.radius = Math.max(radius, 10.0);

      pos.opacity = Math.max(0, Math.min(1, 1.0 - pos.distance));

      for (i = 0; i < 3; i++) {
        if (normalized[i] < 0.0 || normalized[i] > 1.0) {
          pos.inbounds = false;
          break;
        }
      }
      pos.inbounds = (pos.inbounds === undefined);

      return pos;
    },
  };
})();
