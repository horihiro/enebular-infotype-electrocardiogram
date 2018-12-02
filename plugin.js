import * as smoothie from 'smoothie';

export default class Electrocardiogram {
  constructor(settings, options) {
    this.pulseWidth = 200;
    this.pulse = [
      {
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
      }
    ];

    this.styleEl = window.document.createElement('style');
    this.styleEl.innerText = "body{margin:0}";
    this.canvasEl = window.document.createElement('canvas');
    this.divEl = window.document.createElement('div');
    this.divEl.className = "dispHeartRate";
    this.el = window.document.createElement('div');
    this.el.appendChild(this.styleEl);
    this.el.appendChild(this.canvasEl);
    this.el.appendChild(this.divEl);

    this.settings = settings;
    switch(this.settings.speed) {
      case 'fast':
      this.millisPerPixel = 3;
      break;
      case 'slow':
      this.millisPerPixel = 10;
      break;
      default:
      this.millisPerPixel = 5;
    }
    this.options = options;
    this.data = [];

    this.canvasEl.style.width = this.width = options.width || 700;
    this.canvasEl.style.height = this.height = (options.height || 500) - 10;

    this.sm = new smoothie.SmoothieChart({
      millisPerPixel:this.millisPerPixel,
      grid: {
        strokeStyle:'rgb(0, 120, 0)',
        fillStyle:'rgb(0, 50, 0)',
        lineWidth: 1,
        millisPerLine: 250,
        verticalSections: 6
      },
      maxValue: 1.5,
      minValue: -0.5
    });
    this.sm.streamTo(this.canvasEl, 1000);

    this.line = new smoothie.TimeSeries();
    this.sm.addTimeSeries(this.line, {lineWidth:2,strokeStyle:'#00ff00'});
    setInterval(() => {
      if(!this.isPulsing) this.line.append(Date.now(), 0);
    }, 1000);
  }

  drawPulse() {
    this.isPulsing = true;
    this.line.append(Date.now(), 0);
    this.drawingPulse = this.heartRate <= 0 ? null : setTimeout(() => {
      this.drawPulse();
    }, 60000/this.heartRate);

    this.pulse.reduce((prev, curr, index, arr) => prev.then((prevPosition) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.line.append(Date.now(), curr.value);
          resolve(curr.position);
        }, (curr.position - prevPosition) * this.pulseWidth);
      });
    }), Promise.resolve(0))
    .then(() => {
      this.isPulsing = false;
    });
  }

  addData (data) {
    this.divEl.innerText = this.heartRate = data[0][this.settings.value] || 0;
    if (this.heartRate && !this.drawingPulse) {
      this.drawingPulse = setTimeout(() => {
        this.drawPulse();
      }, 60000/this.heartRate);
    }
  } 

  clearData () {
    // do nothing.
  }

  resize (options) {　
    // just resizing canvas.
    this.canvasEl.width = this.width = options.width;
    this.canvasEl.height = this.height = options.height - 10;
  }

  getEl() {
    return this.el;
  }
}

Electrocardiogram.defaultSettings = {
    "label" : "Person",
    "value": "heartRate",
    "limit": "1",
    "speed": "normal"
};

Electrocardiogram.settings = EnebularIntelligence.SchemaProcessor(
  [
    {
      type : 'key',
      name : 'label',
      help : 'Please specify the key of the data to be the label.'
    },{
      type : 'key',
      name : 'value',
      help : 'Please specify the key of the data representing the value.'
    },{
      type : 'select',
      name : 'speed',
      help : 'Please specify the key of the data representing the value.',
      options: [
        'slow',
        'normal',
        'fast'
      ]
    },{
      type: 'select',
      name: 'limit',
      help: 'The number of data to be displayed',
      options: [
        '1'
      ]
    }
  ], Electrocardiogram.defaultSettings); 

window.EnebularIntelligence.register('linechart', Electrocardiogram);
