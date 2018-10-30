"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var smoothie = _interopRequireWildcard(require("smoothie"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LineChart2 =
/*#__PURE__*/
function () {
  function LineChart2(settings, options) {
    var _this = this;

    _classCallCheck(this, LineChart2);

    this.pulseWidth = 200;
    this.pulse = [{
      position: 0,
      value: 0
    }, {
      position: 0.15,
      value: 0.2
    }, {
      position: 0.3,
      value: 0
    }, {
      position: 0.4,
      value: 0
    }, {
      position: 0.46,
      value: -0.1
    }, {
      position: 0.5,
      value: 0.8
    }, {
      position: 0.6,
      value: -0.2
    }, {
      position: 0.7,
      value: 0
    }, {
      position: 0.8,
      value: 0
    }, {
      position: 0.9,
      value: 0.2
    }, {
      position: 1,
      value: 0
    }];
    this.canvasEl = window.document.createElement('canvas');
    this.divEl = window.document.createElement('div');
    this.divEl.className = "dispHeartRate";
    this.el = window.document.createElement('div');
    this.el.appendChild(this.canvasEl);
    this.el.appendChild(this.divEl);
    this.settings = settings;
    this.options = options;
    this.data = [];
    this.canvasEl.width = this.width = options.width || 700;
    this.canvasEl.height = this.height = (options.height || 500) - 50;
    this.sm = new smoothie.SmoothieChart({
      millisPerPixel: 4,
      grid: {
        strokeStyle: 'rgb(0, 120, 0)',
        fillStyle: 'rgb(0, 50, 0)',
        lineWidth: 1,
        millisPerLine: 250,
        verticalSections: 6
      },
      maxValue: 1.5,
      minValue: -0.5
    });
    this.sm.streamTo(this.canvasEl, this.pulseWidth);
    this.line = new smoothie.TimeSeries();
    this.sm.addTimeSeries(this.line, {
      lineWidth: 2,
      strokeStyle: '#00ff00'
    });
    setInterval(function () {
      if (!_this.isPulsing) _this.line.append(Date.now(), 0);
    }, 50);
  }

  _createClass(LineChart2, [{
    key: "drawPulse",
    value: function drawPulse() {
      var _this2 = this;

      this.isPulsing = true;
      this.line.append(Date.now(), 0);
      this.drawingPulse = this.heartRate <= 0 ? null : setTimeout(function () {
        _this2.drawPulse();
      }, 60000 / this.heartRate);
      this.pulse.reduce(function (prev, curr, index, arr) {
        return prev.then(function (prevPosition) {
          return new Promise(function (resolve) {
            setTimeout(function () {
              _this2.line.append(Date.now(), curr.value);

              resolve(curr.position);
            }, (curr.position - prevPosition) * _this2.pulseWidth);
          });
        });
      }, Promise.resolve(0)).then(function () {
        _this2.isPulsing = false;
      });
    }
  }, {
    key: "addData",
    value: function addData(data) {
      var _this3 = this;

      console.log(data[0][this.settings.value]);
      this.divEl.innerText = this.heartRate = data[0][this.settings.value];

      if (this.heartRate && !this.drawingPulse) {
        this.drawingPulse = setTimeout(function () {
          _this3.drawPulse();
        }, 60000 / this.heartRate);
      }
    }
  }, {
    key: "clearData",
    value: function clearData() {// do nothing.
    }
  }, {
    key: "resize",
    value: function resize(options) {
      // just resizing canvas.
      this.canvasEl.width = this.width = options.width;
      this.canvasEl.height = this.height = options.height - 50;
    }
  }, {
    key: "getEl",
    value: function getEl() {
      return this.el;
    }
  }]);

  return LineChart2;
}();

exports.default = LineChart2;
LineChart2.defaultSettings = {
  "label": "country",
  "value": "value",
  "limit": "10"
};
LineChart2.settings = EnebularIntelligence.SchemaProcessor([{
  type: "key",
  name: "label",
  help: "Please specify the key of the data to be the label."
}, {
  type: "key",
  name: "value",
  help: "Please specify the key of the data representing the value."
}, {
  type: "select",
  name: "limit",
  help: "The number of data to be displayed",
  options: ["10", "20", "30", "all"]
}], LineChart2.defaultSettings);
window.EnebularIntelligence.register('linechart', LineChart2);
