// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"data.json":[function(require,module,exports) {
module.exports = {
  "conflict": ["AFG", "CAF", "COL", "COD", "IRQ", "LBY", "MLI", "MMR", "SOM", "SSD", "SDN", "SYR", "YEM"],
  "other": ["BDI", "NGA"],
  "post-conflict": ["BIH", "CIV", "NPL", "LKA"]
};
},{}],"node_modules/@tilecloud/mbgl-gesture-handling/mbgl-gesture-handling.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class GestureHandling {
  constructor(options) {
    this.id = `mbgl-gesture-handling-help-container-${GestureHandling.count}`;
    GestureHandling.count++;
    this.timer = null;
    this.settings = {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      textColor: '#ffffff',
      textMessage: 'Use alt + scroll to zoom the map.',
      textMessageMobile: 'Use two fingers to move the map.',
      timeout: 2000,
      ...options
    };
    this.helpElement = document.querySelector(`#${this.id}`);

    if (null === this.helpElement) {
      this.helpElement = document.createElement('div');
      this.helpElement.id = this.id;
      this.helpElement.style.backgroundColor = this.settings.backgroundColor;
      this.helpElement.style.position = 'absolute';
      this.helpElement.style.display = 'none';
      this.helpElement.style.zIndex = 9999;
      this.helpElement.style.justifyContent = 'center';
      this.helpElement.style.alignItems = 'center';
      const textBox = document.createElement('div');
      textBox.style.textAlign = 'center';
      textBox.style.color = this.settings.textColor;
      textBox.innerText = "";
      this.helpElement.appendChild(textBox);
      document.body.appendChild(this.helpElement);
    }
  }

  showHelp(map, message) {
    const rect = map.getContainer().getBoundingClientRect();
    this.helpElement.style.top = `${rect.top + window.scrollY}px`;
    this.helpElement.style.left = `${rect.left + window.scrollX}px`;
    this.helpElement.style.width = `${rect.width}px`;
    this.helpElement.style.height = `${rect.height}px`;
    this.helpElement.style.display = 'flex';
    this.helpElement.querySelector('div').innerText = message;
  }

  hideHelp() {
    this.helpElement.style.display = 'none';
  }

  addTo(map) {
    map.scrollZoom.disable();
    this.helpElement.addEventListener('wheel', event => {
      if (event.altKey) {
        event.preventDefault();
        this.hideHelp();
      } else {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.hideHelp();
        }, this.settings.timeout);
      }
    });
    map.getContainer().addEventListener('wheel', event => {
      if (event.altKey) {
        event.preventDefault();

        if (!map.scrollZoom.isEnabled()) {
          map.scrollZoom.enable();
        }
      } else {
        map.scrollZoom.disable();
        this.showHelp(map, this.settings.textMessage);
        this.timer = setTimeout(() => {
          this.hideHelp();
        }, this.settings.timeout);
      }
    });
    this.helpElement.addEventListener('touchstart', event => {
      if (event.touches && 2 <= event.touches.length) {
        clearTimeout(this.timer);
        this.hideHelp();
        map.dragPan.enable();
        event.preventDefault();
      }
    });
    map.on('movestart', event => {
      if (event.originalEvent && 'touches' in event.originalEvent && 2 > event.originalEvent.touches.length) {
        this.showHelp(map, this.settings.textMessageMobile);
        map.dragPan.disable();
        this.timer = setTimeout(() => {
          map.dragPan.enable();
          this.hideHelp();
        }, this.settings.timeout);
      }
    });
  }

}

GestureHandling.count = 0; // static

var _default = GestureHandling;
exports.default = _default;
},{}],"app.js":[function(require,module,exports) {
"use strict";

var _mbglGestureHandling = _interopRequireDefault(require("@tilecloud/mbgl-gesture-handling"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
        _iterator2.return();
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
        layer.paint['fill-color'] = ['match', ['get', 'iso3cd'], data.conflict, colors.conflict, data['post-conflict'], colors['post-conflict'], data.other, colors.other, ['rgb', 175, 226, 254]];
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
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
  new _mbglGestureHandling.default({
    backgroundColor: 'rgba(207, 207, 207, 0.8)',
    textColor: '#000',
    timeout: 2000
  }).addTo(map);
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
  map.on('load', function () {});
});
},{"./data.json":"data.json","@tilecloud/mbgl-gesture-handling":"node_modules/@tilecloud/mbgl-gesture-handling/mbgl-gesture-handling.js"}],"../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60351" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.js"], null)
//# sourceMappingURL=/app.c328ef1a.js.map