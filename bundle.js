(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var data = require('./data.json');

var lut = {};

for (var _i = 0, _Object$keys = Object.keys(data); _i < _Object$keys.length; _i++) {
  var k = _Object$keys[_i];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = data[k][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var iso3cd = _step2.value;
      lut[iso3cd] = k;
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
}

var labels = {
  conflict: 'Sexual violence in conflict-affected settings',
  'post-conflict': 'Sexual violence in post-conflict settings',
  other: 'Other situations of concern'
};
var colors = {
  conflict: ['rgb', 255, 142, 0],
  'post-conflict': ['rgb', 255, 0, 139],
  other: ['rgb', 113, 1, 149]
};
var overlay = document.getElementById('overlay');
var country = document.getElementById('country');
var description = document.getElementById('description');
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
    hash: true,
    renderWorldCopies: false
  });
  map.on('mousemove', function (e) {
    var f = map.queryRenderedFeatures(e.point)[0];

    if (f) {
      overlay.classList.remove('default', 'conflict', 'post-conflict', 'other');
      var state = lut[f.properties.iso3cd];

      if (state) {
        var label = labels[state];
        overlay.classList.add(state);
        country.textContent = f.properties.maplab;
        description.textContent = label;
        console.log("".concat(f.properties.maplab, ": ").concat(label, " ").concat(overlay.classList));
      } else {
        overlay.classList.add('default');
        country.textContent = '';
        description.textContent = '';
      }
    }
  });
  map.on('load', function () {
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');
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
