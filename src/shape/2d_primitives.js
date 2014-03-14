define(function (require) {

  'use strict';

  var Processing = require('core');
  var canvas = require('canvas');
  var constants = require('constants');

	Processing.prototype.arc = function(a, b, c, d, start, stop, mode) {
    var vals = canvas.modeAdjust(a, b, c, d, this.settings.ellipseMode);
    var radius = (vals.h > vals.w) ? vals.h / 2 : vals.w / 2,
      xScale = (vals.h > vals.w) ? vals.w / vals.h : 1, //scale the arc if it is oblong
      yScale = (vals.h > vals.w) ? 1 : vals.h / vals.w;
    this.curElement.context.scale(xScale, yScale);
    this.curElement.context.beginPath();
    this.curElement.context.arc(vals.x, vals.y, radius, start, stop);
    this.curElement.context.stroke();
    if (mode === constants.CHORD || mode === constants.OPEN) {
      this.curElement.context.closePath();
    } else if (mode === constants.PIE || mode === undefined) {
      this.curElement.context.lineTo(x, y);
      this.curElement.context.closePath();
    }
    this.curElement.context.fill();
    if(mode != constants.OPEN && mode != undefined) { // final stroke must be after fill so the fill does not cover part of the line
      this.curElement.context.stroke();
    }

    return this;
  };

  Processing.prototype.ellipse = function(a, b, c, d) {
    var vals = canvas.modeAdjust(a, b, c, d, this.settings.ellipseMode);
    var kappa = 0.5522848,
      ox = (vals.w / 2) * kappa, // control point offset horizontal
      oy = (vals.h / 2) * kappa, // control point offset vertical
      xe = vals.x + vals.w,      // x-end
      ye = vals.y + vals.h,      // y-end
      xm = vals.x + vals.w / 2,  // x-middle
      ym = vals.y + vals.h / 2;  // y-middle
    this.curElement.context.beginPath();
    this.curElement.context.moveTo(vals.x, ym);
    this.curElement.context.bezierCurveTo(vals.x, ym - oy, xm - ox, vals.y, xm, vals.y);
    this.curElement.context.bezierCurveTo(xm + ox, vals.y, xe, ym - oy, xe, ym);
    this.curElement.context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    this.curElement.context.bezierCurveTo(xm - ox, ye, vals.x, ym + oy, vals.x, ym);
    this.curElement.context.closePath();
    this.curElement.context.fill();
    this.curElement.context.stroke();

    return this;
  };

  Processing.prototype.line = function(x1, y1, x2, y2) {
    if (this.curElement.context.strokeStyle === 'rgba(0,0,0,0)') {
      return;
    }
    this.curElement.context.beginPath();
    this.curElement.context.moveTo(x1, y1);
    this.curElement.context.lineTo(x2, y2);
    this.curElement.context.stroke();

    return this;
  };

  Processing.prototype.point = function(x, y) {
    var s = this.curElement.context.strokeStyle;
    var f = this.curElement.context.fillStyle;
    if (s === 'rgba(0,0,0,0)') {
      return;
    }
    x = Math.round(x);
    y = Math.round(y);
    this.curElement.context.fillStyle = s;
    if (this.curElement.context.lineWidth > 1) {
      this.curElement.context.beginPath();
      this.curElement.context.arc(x, y, this.curElement.context.lineWidth / 2, 0, constants.TWO_PI, false);
      this.curElement.context.fill();
    } else {
      this.curElement.context.fillRect(x, y, 1, 1);
    }
    this.curElement.context.fillStyle = f;

    return this;
  };

  Processing.prototype.quad = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    this.curElement.context.beginPath();
    this.curElement.context.moveTo(x1, y1);
    this.curElement.context.lineTo(x2, y2);
    this.curElement.context.lineTo(x3, y3);
    this.curElement.context.lineTo(x4, y4);
    this.curElement.context.closePath();
    this.curElement.context.fill();
    this.curElement.context.stroke();

    return this;
  };

  Processing.prototype.rect = function(a, b, c, d) {
    var vals = canvas.modeAdjust(a, b, c, d, this.settings.rectMode);
    this.curElement.context.beginPath();
    this.curElement.context.rect(vals.x, vals.y, vals.w, vals.h);
    this.curElement.context.fill();
    this.curElement.context.stroke();

    return this;
  };

  Processing.prototype.triangle = function(x1, y1, x2, y2, x3, y3) {
    this.curElement.context.beginPath();
    this.curElement.context.moveTo(x1, y1);
    this.curElement.context.lineTo(x2, y2);
    this.curElement.context.lineTo(x3, y3);
    this.curElement.context.closePath();
    this.curElement.context.fill();
    this.curElement.context.stroke();

    return this;
  };

  return Processing;

});
