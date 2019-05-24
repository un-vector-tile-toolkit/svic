(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var data = require('./data.json');

var colors = {
  conflict: ['rgb', 255, 142, 0],
  'post-conflict': ['rgb', 255, 0, 139],
  other: ['rgb', 113, 1, 149]
};
fetch(window.confirm('Are you using TabularMaps?') ? 'https://tabularmaps.github.io/8bit-tile/style.json' : 'https://un-vector-tile-toolkit.github.io/tentatiles/style.json').then(function (response) {
  return response.json();
}).then(function (style) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = style.layers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var layer = _step.value;

      if (layer.id === 'bnda') {
        layer.paint['fill-color'] = ['match', ['get', 'iso3cd'], data.conflict, colors.conflict, data['post-conflict'], colors['post-conflict'], data.other, colors.other, ['rgb', 250, 250, 250]];
        console.log(layer.paint['fill-color']);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var map = new mapboxgl.Map({
    container: 'map',
    maxZoom: 2,
    style: style,
    attributionControl: true,
    hash: true
  });
  map.on('load', function () {
    map.addControl(new mapboxgl.NavigationControl());
  });
});

},{"./data.json":2}],2:[function(require,module,exports){
module.exports={
  "conflict": [
    "AFG",
    "CAF",
    "COL",
    "COD",
    "IRQ",
    "LBY",
    "MLI",
    "MMR",
    "SOM",
    "SSD",
    "SDN",
    "SYR",
    "YEM"
  ],
  "other": [
    "BDI",
    "NGA"
  ],
  "post-conflict": [
    "BIH",
    "CIV",
    "NPL",
    "LKA"
  ]
}

},{}]},{},[1]);
